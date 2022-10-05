import * as PIXI from 'pixi.js'
import { conformsTo, isNull, isNumber, isArray, isObject, isBoolean, isString } from 'lodash-es';
import { calLineHitArea } from './utils'
import {defaultsDeep} from 'lodash-es'
import {hapnet_options} from './envs'
// const defaultNodeOptions = {
//     id:null,
//     radius:null,
//     x:null,
//     y:null
//     values:[],
//     meta:{}
// }

/**
 *  Pie chart element
 */
class SINGLEPIE extends PIXI.Container {
    constructor(nodeOptions, nodeStyles, drawCoarseGraph = false, debug = false) {
        super();
        /**
         * Validate inputs
         */

        const isValidate = conformsTo(nodeOptions, {
            id: id => !isNull(id),
            radius: radius => isNumber(radius),
            x: x => !isNull(x),
            y: y => !isNull(y),
            sectors: sectors => isArray(sectors),
            meta: meta => isObject(meta)
        }) && conformsTo(nodeStyles, {
            show: d => isBoolean(d),
            lineWidth: d => isNumber(d),
            lineColor: d => isNumber(d),
        })

        if (isValidate) {
            this.nodeOptions = nodeOptions;
            this.nodeStyles = nodeStyles;
        } else {
            this.nodeOptions = null;
            console.error("can not draw haplotype!")
        }



        this.debug = debug;
        this.name = this.nodeOptions.id; // set unique name for each node.
        this.drawCoarseGraph = drawCoarseGraph;
        if (this.nodeOptions != null) {

            /**
             * init the graphic object and append it to container
             */
            this.chart = this.addChild(new PIXI.Graphics())
            // this.chart.interactive = true;
            // this.chart.buttonMode = true;
            // this.chart.on('pointerdown', (event) => {
            //     /**
            //      * TODO:
            //      * 1. add callback functions
            //      */
            //     console.log(this.nodeOptions)
            // });

            this.interactive = true; // add event listener in this object, everything works well too.
            this.buttonMode = true;
            this.on('mouseover', (event) => {
                /**
                 * TODO:
                 * 1. add callback functions
                 */
                // event.preventDefault();
                // console.log("mouse over node")
                // console.log(this.nodeOptions);

                // this.emit("pointerdown")

                /**
                 * add node_menu to the center of node
                 */
                    console.log("nodeMessageBox")
                    this.nodeMessageBox = this.parent.getChildByName("node_menu");
                    console.log(this.nodeMessageBox)
      
                    
                    this.nodeMessageBox.x = this.nodeOptions.x;
                    this.nodeMessageBox.y = this.nodeOptions.y;
                    this.nodeMessageBox.visible = true;
                    



            });

            this.on('mouseout', (event) => {
                /**
                 * TODO:
                 * 1. add callback functions
                 */
                // event.preventDefault();
                // console.log("mouse leave node")
                // console.log(this.nodeOptions);

                // this.emit("pointerdown")



                this.nodeMessageBox.visible = false;
            });

            // this.on('mousemove', (event) => {
            //     /**
            //      * TODO:
            //      * 1. add callback functions
            //      */
            //     // event.preventDefault();
            //     console.log("mouse moving node")
            //     console.log(this.nodeOptions);

            //     // this.emit("pointerdown")
            // });

        }
    }

    _angle2radian(angle) {
        return (angle - 90) * PIXI.DEG_TO_RAD;
    }
    _drawOneSector(startAngle, percent, color) {

        let endAngle = 360 * percent + startAngle;

        let center = {
            x: this.nodeOptions.x,
            y: this.nodeOptions.y
        }

        const radius = this.nodeOptions.radius;

        startAngle = this._angle2radian(startAngle);

        let circleStartPoint = {
            x: center.x + radius * Math.cos(startAngle),
            y: center.y + radius * Math.sin(startAngle),
        }


        this.chart.beginFill(color, 1)
            .lineStyle(this.nodeStyles.lineWidth, this.nodeStyles.lineColor)
            .moveTo(center.x, center.y)
            .lineTo(circleStartPoint.x, circleStartPoint.y)
            .arc(center.x, center.y, radius, startAngle, this._angle2radian(endAngle), false)
            .lineTo(center.x, center.y)
            .endFill();

        return endAngle;
    }


    _drawPie() {
        // calculate percent of each sector
        this.total = 0;
        this.nodeOptions.sectors.forEach((a) => this.total += a.number);

        this.sectorsWithPercent = this.nodeOptions.sectors.map(item => {
            item.percent = item.number / this.total
            return item
        });
        // this.colorPalette = utils.getColorPalette(this.config.dataValue.length);
        // init start angle to 12 oclock
        this.startAngle = 0;

        // draw each section
        // for (let idxOnePercent in this.percent) {
        //     this.startAngle = this._drawOneSector(this.startAngle, this.percent[idxOnePercent], this.colorPalette[idxOnePercent]);
        // }

        this.sectorsWithPercent.forEach(sector => {
            this.startAngle = this._drawOneSector(this.startAngle, sector.percent, sector.color);
        })

        // console.log(this.total,this.sectorsWithPercent)

        if (this.debug == true) {
            const thisPosX = this.nodeOptions.x < 0 ? -1 * this.width : this.width;
            const thisPosY = this.nodeOptions.y < 0 ? -1 * this.height : this.height;
            this.chart.beginFill(0x000000, 0.1)
                .lineStyle(4, 0xFFFFFF)
                .drawRect(this.x - this.nodeOptions.radius, this.y - this.nodeOptions.radius, thisPosX, thisPosY)
                .endFill();
        }

        return {
            x: this.nodeOptions.x,
            y: this.nodeOptions.y
        }
    }

    _drawCircle() {


        this.chart.beginFill(this.nodeOptions.sectors[0].color, 1)
            .lineStyle(this.nodeStyles.lineWidth, this.nodeStyles.lineColor)
            .drawCircle(this.nodeOptions.x, this.nodeOptions.y, this.nodeOptions.radius)
            .endFill();
    }



    _drawHeighLightOneSector(startAngle, percent, color) {

        let endAngle = 360 * percent + startAngle;

        let center = {
            x: this.nodeOptions.x,
            y: this.nodeOptions.y
        }

        const radius = this.nodeOptions.radius;

        startAngle = this._angle2radian(startAngle);

        let circleStartPoint = {
            x: center.x + radius * Math.cos(startAngle),
            y: center.y + radius * Math.sin(startAngle),
        }


        this.chart.beginFill(color, 1)
            .lineStyle(radius*0.05, 0xFF0000)
            .moveTo(center.x, center.y)
            .lineTo(circleStartPoint.x, circleStartPoint.y)
            .arc(center.x, center.y, radius, startAngle, this._angle2radian(endAngle), false)
            .lineTo(center.x, center.y)
            .endFill();
        return endAngle;
    }



    _drawHeightLightPie() {
        // calculate percent of each sector
        this.total = 0;
        this.nodeOptions.sectors.forEach((a) => this.total += a.number);

        this.sectorsWithPercent = this.nodeOptions.sectors.map(item => {
            item.percent = item.number / this.total
            return item
        });
        // this.colorPalette = utils.getColorPalette(this.config.dataValue.length);
        // init start angle to 12 oclock
        this.startAngle = 0;

        // draw each section
        // for (let idxOnePercent in this.percent) {
        //     this.startAngle = this._drawOneSector(this.startAngle, this.percent[idxOnePercent], this.colorPalette[idxOnePercent]);
        // }

        this.sectorsWithPercent.forEach(sector => {
            this.startAngle = this._drawHeighLightOneSector(this.startAngle, sector.percent, sector.color);
        })

        // console.log(this.total,this.sectorsWithPercent)

        if (this.debug == true) {
            const thisPosX = this.nodeOptions.x < 0 ? -1 * this.width : this.width;
            const thisPosY = this.nodeOptions.y < 0 ? -1 * this.height : this.height;
            this.chart.beginFill(0x000000, 0.1)
                .lineStyle(8, 0xFFFFFF)
                .drawRect(this.x - this.nodeOptions.radius, this.y - this.nodeOptions.radius, thisPosX, thisPosY)
                .endFill();
        }

        return {
            x: this.nodeOptions.x,
            y: this.nodeOptions.y
        }
    }



    _drawHeighLightCircle() {


        this.chart.beginFill(this.nodeOptions.sectors[0].color, 1)
            .lineStyle(this.nodeOptions.radius * 0.05,  0xFF0000)
            .drawCircle(this.nodeOptions.x, this.nodeOptions.y, this.nodeOptions.radius)
            .endFill();
    }

    draw(drawOptions) {
        
        if(drawOptions === undefined ){
            drawOptions = {}
        }
        this.chart.clear();
        /**
         * TODO:
         * To optimize performance, the defaultDrawOptions should be move to class level.
         */
        const defaultDrawOptions = { 
            heighLight:false
        }
        defaultsDeep(drawOptions, defaultDrawOptions);

        // console.log(drawOptions)

        if (this.drawCoarseGraph == true) {
            /**
             * draw coarse graph
             */
        } else {
            /**
             * draw normal graph
             */
            // console.log(this.nodeOptions)

            if (drawOptions.heighLight == false){
                if (this.nodeOptions.sectors.length == 1) {
                    // draw a circle with outline
                    // this._drawCircle();
                    this._drawCircle();
    
                } else {
                    // draw a pie with outline
                    this._drawPie();
                }
            }else{

                this.chart.clear();
                if (this.nodeOptions.sectors.length == 1) {
                    // draw a circle with outline
                    // this._drawCircle();
                    this._drawHeighLightCircle();
    
                } else {
                    // draw a pie with outline
                    this._drawHeightLightPie();
                }
            }


        }
    }

}

export {SINGLEPIE}