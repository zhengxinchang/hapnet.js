

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
        tickIteration: 1000,
        collideIteration: 2,
        hubNumOFLinksThreshold: 20, // 定义hub Node的最小边的数量
        maxExpandSteps: 50, // 最大的迭代步数
        hubNodePadding: 100,
        chargeStrength: 10000,
        forceLinkDistance: 5,
        forceLinkStrength: 2,
    },
    fullGraph:{
        tickIteration:150,
        collideIteration: 2,
        forceLinkDistance: 1,
        forceLinkStrength: 1,
        eachNodePadding: 100,
        chargeStrength: 800000,
        chargeTheta:0.99,
    },
    
    style: {
        linkWidth: 40,
        linkColor: "#FFFFFF", //white
        NodeOutline: {
            show: true,
            lineWidth: 1,
            lineColor: "#FFFFFF"
        }
    }
}


/**
 * Copy of global options
 */
let hapnetConfig = {
    options:{},
    highlightedObjList:{
        nodes:[],
        links:[],
    },
    nodeFirstLevel:{
        /**
         * nodeID:[
         *      {
         *          linkID:xxx,
         *          anotherNodeID:yyy
         *      }
         * ]
         *
         */
    }
}; 




export {hapnetConfig,preDefinedPalettesList,defaultOptions}