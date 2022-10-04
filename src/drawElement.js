import * as PIXI from 'pixi.js'
import { conformsTo, isNull, isNumber, isArray, isObject, isBoolean, isString } from 'lodash-es';
import { calLineHitArea } from './utils'
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
        // debugger;
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
        this.drawCoarseGraph = drawCoarseGraph;
        if (this.nodeOptions != null) {

            /**
             * init the graphic object and append it to container
             */
            this.chart = this.addChild(new PIXI.Graphics())
            this.chart.interactive = true;
            this.chart.buttonMode = true;
            this.chart.on('pointerdown', (event) => {
                /**
                 * TODO:
                 * 1. add callback functions
                 */
                console.log(this.nodeOptions)
            });


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
    draw() {
        if (this.drawCoarseGraph == true) {
            /**
             * draw coarse graph
             */
        } else {
            /**
             * draw normal graph
             */
            // console.log(this.nodeOptions)
            if (this.nodeOptions.sectors.length == 1) {
                // draw a circle with outline
                this._drawCircle();

            } else {
                // draw a pie with outline
                this._drawPie();
            }

        }
    }

}


// const defaultLinkOptions = {
//     source:null,
//     target:null,
//     distance:null,
//     meta:null,
// }

/**
 * Link object
 */
class LINK extends PIXI.Container {

    constructor(linkOptions, linkStyles, drawCoarseGraph = false, debug = false) {
        super();

        const isValidate = conformsTo(linkOptions, {
            source: d => isObject(d),
            target: d => isObject(d),
            distance: d => isNumber(d),
            meta: d => isObject(d)
        }) && conformsTo(linkStyles, {
            linkWidth: d => isNumber(d),
            linkColor: d => isNumber(d)
        })

        if (isValidate) {
            this.linkOptions = linkOptions;
            this.linkStyles = linkStyles;
        } else {
            console.log("Can not draw link");
            console.log(linkOptions, linkStyles)
        }




        this.chart = this.addChild(new PIXI.Graphics());
        this.chart.interactive = true;
        this.chart.buttonMode = true;

        this.chart.on("pointerdown", function (e) {
            /**
             *  'this' is the polygen object. It's parent is the link object
             */
            // console.log(e)
            
            
            const linkObj = this.parent

            console.log("link", linkObj)
        });

    }

    draw() {

        this.chart
            .lineStyle(this.linkStyles.linkWidth, this.linkStyles.linkColor, 1)
            .moveTo(this.linkOptions.source.x, this.linkOptions.source.y)
            .lineTo(this.linkOptions.target.x, this.linkOptions.target.y);

        // let rawHitPath = this.chart.geometry.points
        // let point4 = rawHitPath.slice(7,8)
        // console.log(point4)
        // console.log(hitPath)

        /**
         * calculate hit area of the link
         */
        const hitPath = calLineHitArea(
            this.linkOptions.source.x, 
            this.linkOptions.source.y, 
            this.linkOptions.target.x, 
            this.linkOptions.target.y, 
            this.linkStyles.linkWidth
            )

        this.chart.hitArea = new PIXI.Polygon(hitPath)
    }
}


export { SINGLEPIE, LINK }