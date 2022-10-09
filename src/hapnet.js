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
import { defaultsDeep, isArray } from "lodash-es";
import { Network } from "./drawNetwork";
import { calculateCoarseGraph,calculateFullGraph } from './layout'
import { hapnetConfig,preDefinedPalettesList,defaultOptions } from "./envs";

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
    static init(initOption){
        /*
            Format validation
        */
        if(! initOption instanceof Object){
            throw TypeError("initOption MUST be an Object.")
        };

        if ( ! 'el'  in initOption  ) {
            throw Error("attr 'el' is required.")
        }
        
    }
    
    /**
     * @hideconstructor
     * @constructor
     * @param {Object} options hapnet global configure
     */
    constructor(options) {

        this.options = options;
        defaultsDeep(this.options, defaultOptions);
        hapnetConfig.options = this.options
        this.options.backgroundColor = chroma(this.options.backgroundColor).num();
        this.options.style.linkColor = chroma(this.options.style.linkColor).num();
        this.options.style.NodeOutline.lineColor = chroma(this.options.style.NodeOutline.lineColor).num();
        this.options.toolTip.backgroundColor = chroma(this.options.toolTip.backgroundColor ).num();
        this.options.toolTip.borderColor = chroma(this.options.toolTip.borderColor ).num();
        
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
        this.options.nodes.forEach(d => {
            d.sectors && d.sectors.forEach(x => {
                nodeColors.add(x.category);
                if(d.radius > maxRadius) maxRadius = d.radius;
                if(d.radius < minRadius) minRadius = d.radius;
            })
        });
        nodeColors = Array.from(nodeColors);

        const radiusInterval = this.options.radiusMax- this.options.radiusMin
        this.options.nodes.forEach(d => {
            d.radius = this.options.radiusMin + radiusInterval/(maxRadius-minRadius ) * (d.radius - minRadius);
        });


        if (isArray(this.options.paletteArray)) {
            /**
             * 1. validate paletteArray
             * 2. assign color to each category accorrding to paletteArray
             * 3. fill the reset catetory by palette
             */
        } else {

            /**
             * check wether the palette is in the pre-defined list
             */
            if (!preDefinedPalettesList[this.options.palette]) {
                console.error(`Palette is not valid, please select one from: ${Object.keys(preDefinedPalettesList)}`)
            } else {
                /**
                 * calculate palette and convert them to number
                 */
                const nodeColorsPalette = chroma.scale(preDefinedPalettesList[this.options.palette]).colors(nodeColors.length).map(d => chroma(d).num());
                let tmpPalette = {}
                nodeColors.forEach((d, idx) => {
                    tmpPalette[d] = nodeColorsPalette[idx]
                })
                this.options.nodeColors = tmpPalette
                this.options.nodes.forEach(node=>{
                    node.sectors.forEach(sector=>{
                        sector.color = this.options.nodeColors[sector.category];
                        return sector;
                    });
                    return node;
                });
            }

        }

        const network = new Network(this.options);
        // network.drawBackground();
        calculateCoarseGraph(this.options);
        calculateFullGraph(this.options);

        network.init();
        // network.setOption(this.options)
        // console.log(this.options)

        network.draw();
    }




}


export { HapNet }