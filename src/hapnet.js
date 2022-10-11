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

import chroma from "chroma-js";
import {
    cloneDeep,
    defaultsDeep,
    isArray,
    isNumber
} from "lodash-es";
import { Network } from "./drawNetwork";
import {
    defaultInitOption,
    defaultPlotOption,
    predefinedPalettesList
} from './constant'
import { 
    calculateCoarseGraph, 
    calculateFullGraph 
} from './layout'
// import { hapnetConfig, preDefinedPalettesList, defaultOptions } from "./envs";
import store from './store'

/**
 * Main class of hapnet.js
 */
class HapNet {

    /**
     * @param {Object} initOption <pre> initialization option 
     *   {
     *      el: string , // Id of the DOM element
     *      width: number, // Width of the plot area
     *      height: number, // Height of the plot area
     *   }
     *  <pre>
     *  @return {HapNet} Instance of HapNet class.
     */
    static init(initOption) {
        /*
            Format validation
        */
        if (!initOption instanceof Object) {
            throw TypeError("initOption MUST be an Object.")
        };
        if (! 'el' in initOption) {
            throw Error("attr 'el' is required.")
        }
        /*
        validate el point
         */
        try {
            document.getElementById(initOption.el)
        } catch (error) {
            throw Error(`can not get element ${initOption.el}`)
        }
        /*
        set width and height
        */
        if (!initOption.hasOwnProperty("width")) {
            initOption.width = window.innerWidth;
        } else {
            if (!isNumber(initOption.width)) {
                throw Error(`attr width is invalid ${initOption.width}`)
            }
        }
        if (!initOption.hasOwnProperty("height")) {
            initOption.height = window.innerHeight;
        } else {
            if (!isNumber(initOption.height)) {
                throw Error(`attr height is invalid ${initOption.height}`)
            }
        }

        /*
        Add initialization options to instance 
        */
        store.runtimeGlobal.initOption = initOption;
        store.runtimeGlobal.hapnetMainInstance = new HapNet();
        return store.runtimeGlobal.hapnetMainInstance;
    }

    // /**
    //  * @hideconstructor
    //  * @constructor
    //  * @param {Object} options hapnet global configure
    //  */
    // constructor() {


    // }
    /**
     * 
     * @param {Object} plotOption <pre>setup the plot option
     * </pre>
     */
    setOption(plotOption) {

      store.runtimeGlobal.plotOption = this.plotOption = cloneDeep(plotOption);
      // console.log(store.runtimeGlobal.plotOption)
      defaultsDeep(store.runtimeGlobal.plotOption, defaultPlotOption);
      store.runtimeGlobal.plotOption.backgroundColor = chroma(store.runtimeGlobal.plotOption.backgroundColor).num();
      store.runtimeGlobal.plotOption.style.linkColor = chroma(store.runtimeGlobal.plotOption.style.linkColor).num();
      store.runtimeGlobal.plotOption.style.NodeOutline.lineColor = chroma(store.runtimeGlobal.plotOption.style.NodeOutline.lineColor).num();
      store.runtimeGlobal.plotOption.toolTip.backgroundColor = chroma(store.runtimeGlobal.plotOption.toolTip.backgroundColor).num();
      store.runtimeGlobal.plotOption.toolTip.borderColor = chroma(store.runtimeGlobal.plotOption.toolTip.borderColor).num();
      store.runtimeGlobal.plotOption.nodeColorLegend.backgroundColor = chroma(store.runtimeGlobal.plotOption.nodeColorLegend.backgroundColor).num();
      store.runtimeGlobal.plotOption.nodeColorLegend.borderColor = chroma(store.runtimeGlobal.plotOption.nodeColorLegend.borderColor).num();
      store.runtimeGlobal.plotOption.style.highlightColor = chroma(store.runtimeGlobal.plotOption.style.highlightColor).num();

      /**
       * TODO:
       * if paletteArray is not null and  like [{category:A, color:'#FFFFFF'}],
       * this Array will be applied to draw pie chart. If the length of the
       * Array is less than real category in all nodes. it will be filled by
       * palette which is spicified in the 'palette' option.
       *
       * if paletteArray is null. Hapnet.js will assingn all category accroding
       * to the 'palette' option.
         * 
         */
        let nodeColors = new Set();
        let maxRadius = 0;
        let minRadius = 0;
        store.runtimeGlobal.plotOption.nodes.forEach(d => {
            d.sectors && d.sectors.forEach(x => {
                nodeColors.add(x.category);
                if (d.radius > maxRadius) maxRadius = d.radius;
                if (d.radius < minRadius) minRadius = d.radius;
            })
        });

        nodeColors = Array.from(nodeColors);
        const radiusInterval = store.runtimeGlobal.plotOption.radiusMax - store.runtimeGlobal.plotOption.radiusMin
        store.runtimeGlobal.plotOption.nodes.forEach(d => {
            d.size = cloneDeep(d.radius);
            d.radius = store.runtimeGlobal.plotOption.radiusMin + radiusInterval / (maxRadius - minRadius) * (d.radius - minRadius);
        });

        if (isArray(store.runtimeGlobal.plotOption.paletteArray)) {
            /**
             * 1. validate paletteArray
             * 2. assign color to each category accorrding to paletteArray
             * 3. fill the reset catetory by palette
             */
        } else {
            /**
             * check wether the palette is in the pre-defined list
             */
            if (!predefinedPalettesList[store.runtimeGlobal.plotOption.palette]) {
                console.error(`Palette is not valid, please select one from: ${Object.keys(predefinedPalettesList)}`)
            } else {
                /**
                 * calculate palette and convert them to number
                 */
                const nodeColorsPalette = chroma.scale(predefinedPalettesList[store.runtimeGlobal.plotOption.palette]).colors(nodeColors.length).map(d => chroma(d).num());
                let tmpPalette = {}
                nodeColors.forEach((d, idx) => {
                    tmpPalette[d] = nodeColorsPalette[idx]
                })
                store.runtimeGlobal.plotOption.nodeColors = tmpPalette
                store.runtimeGlobal.plotOption.nodes.forEach(node => {
                    node.sectors.forEach(sector => {
                        sector.color = store.runtimeGlobal.plotOption.nodeColors[sector.category];
                        return sector;
                    });
                    return node;
                });
            }

        }

        Network.create(); // Will read store.runtimeGlobal
        // network.drawBackground();
        calculateCoarseGraph(store.runtimeGlobal.plotOption);
        calculateFullGraph(store.runtimeGlobal.plotOption);
        Network.init();
        Network.draw();
        console.log(store.runtimeGlobal)
    }



}


export { HapNet }