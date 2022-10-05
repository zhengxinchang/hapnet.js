
import chroma from "chroma-js";
import { defaultsDeep, isArray } from "lodash-es";
import { Network } from "./drawNetwork";
import { calculateCoarseGraph,calculateFullGraph } from './layout'
import { hapnetConfig,preDefinedPalettesList,defaultOptions } from "./envs";




class HapNet {

    constructor(options) {

        this.options = options;
        defaultsDeep(this.options, defaultOptions);
        hapnetConfig.options = this.options
        this.options.backgroundColor = chroma(this.options.backgroundColor).num();
        this.options.style.linkColor = chroma(this.options.style.linkColor).num();
        this.options.style.NodeOutline.lineColor = chroma(this.options.style.NodeOutline.lineColor).num();
        
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

        
        // network.setOption(this.options)
        console.log(this.options)

        network.draw();
    }




}


export { HapNet }