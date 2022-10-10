/*
MIT License

Copyright (c) 2022 zhengxinchang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import * as PIXI from 'pixi.js'
import { conformsTo, isNumber, isObject, defaultsDeep } from 'lodash-es';
import { calLineHitArea } from './utils'
import store from './store'
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

        // 
        this.name = [linkOptions.source.id, linkOptions.target.id].sort().join("_"); // set unique name for each link.

        this.chart = this.addChild(new PIXI.Graphics());
        this.chart.interactive = true;
        this.chart.buttonMode = true;

        // this.chart.on("pointerdown", function (e) {
        //     /**
        //      *  'this' is the polygen object. It's parent is the link object
        //      */
        //     // console.log(e)

        //     console.log(this)

        //     const linkObj = this.parent

        //     console.log("link", linkObj)
        // });

        /* trigger tooltip when hover */
        this.chart.on('mouseover', (event) => {
            
            store.runtimeGlobal.mouseStatus.onLink = true;
            // console.log(store.runtimeGlobal.mouseStatus.onLink)
        });
        this.chart.on('mouseout', (event) => {
            store.runtimeGlobal.mouseStatus.onLink = false;
        });



    }

    draw(drawOptions) {

        if (drawOptions === undefined) {
            drawOptions = {}
        }

        const defaultDrawOptions = {
            heighLight: false
        }
        defaultsDeep(drawOptions, defaultDrawOptions);
        this.chart.clear();
        if (drawOptions.heighLight == false) {
            this.chart
                .lineStyle(this.linkStyles.linkWidth, this.linkStyles.linkColor, 1)
                .moveTo(this.linkOptions.source.x, this.linkOptions.source.y)
                .lineTo(this.linkOptions.target.x, this.linkOptions.target.y);
        } else {
            this.chart
                .lineStyle(this.linkStyles.linkWidth * 2, 0xFF0000, 1)
                .moveTo(this.linkOptions.source.x, this.linkOptions.source.y)
                .lineTo(this.linkOptions.target.x, this.linkOptions.target.y);
        }





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

export { LINK }