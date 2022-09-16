
import chroma from "chroma-js";
import { defaultsDeep, isArray } from "lodash-es";
import { Network } from "./drawNetwork";
import { calculateCoarseGraph,calculateFullGraph } from './layout'


const preDefinedPalettesList = {
    npg: [
        "#E64B35FF", "#4DBBD5FF", "#00A087FF", "#3C5488FF", "#F39B7FFF", "#8491B4FF", "#91D1C2FF", "#DC0000FF", "#7E6148FF", "#B09C85FF"
    ],
    jco: [
        "#0073C2FF", "#EFC000FF", "#868686FF", "#CD534CFF", "#7AA6DCFF", "#003C67FF", "#8F7700FF", "#3B3B3BFF", "#A73030FF", "#4A6990FF"
    ],
    aaas: [
        "#3B4992FF", "#EE0000FF", "#008B45FF", "#631879FF", "#008280FF", "#BB0021FF", "#5F559BFF", "#A20056FF", "#808180FF", "#1B1919FF"
    ],
    nejm: [
        "#BC3C29FF", "#0072B5FF", "#E18727FF", "#20854EFF", "#7876B1FF", "#6F99ADFF", "#FFDC91FF", "#EE4C97FF"
    ],
    lancet: [
        "#00468BFF", "#ED0000FF", "#42B540FF", "#0099B4FF", "#925E9FFF", "#FDAF91FF", "#AD002AFF", "#ADB6B6FF", "#1B1919FF"
    ],
    jama: [
        "#374E55FF", "#DF8F44FF", "#00A1D5FF", "#B24745FF", "#79AF97FF", "#6A6599FF", "#80796BFF"
    ],

}

const defaultOptions = {
    el: null,
    nodes: [
    ],
    links: [
    ],
    radiusMax:5500,
    radiusMin:250,
    width: window.innerWidth,
    height: window.innerHeight,
    debug: false,
    backgroundColor: '#1A237E',
    palette: "default",
    paletteArray: null,
    zoom: 1,
    tooTip: {
        show: true,
        formatter: function (meta) {
            return null
        },
    },
    coarseGraph: {
        tickIteration: 100,
        collideIteration: 2,
        hubNumOFLinksThreshold: 20, // 定义hub Node的最小边的数量
        maxExpandSteps: 50, // 最大的迭代步数
        hubNodePadding: 10,
        chargeStrength: 200,
        forceLinkDistance: 10,
        forceLinkStrength: 2,
    },
    fullGraph:{
        LayoutSimulationIterations: 100,
    },
    
    style: {
        linkWidth: 4,
        linkColor: "#FFFFFF", //white
        NodeOutline: {
            show: true,
            lineWidth: 1,
            lineColor: "#FFFFFF"
        }
    }



}




class HapNet {

    constructor(options) {

        this.options = options;
        defaultsDeep(this.options, defaultOptions);

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


        calculateCoarseGraph(this.options);
        calculateFullGraph(this.options);

        const network = new Network(this.options);
        console.log(this.options)
        network.draw();
    }




}


export { HapNet }