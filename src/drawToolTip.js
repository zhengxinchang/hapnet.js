import * as PIXI from 'pixi.js'
import {defaultsDeep} from 'lodash-es'
import { hapnetConfig } from './envs'
import {Scrollbox} from 'pixi-scrollbox'

class toolTip extends PIXI.Container {

    constructor(options){
        super();
        this.options = options;
        this.name = "hapnet_menu";
        //sub objects must be initialized in the constructor(), otherwise, accidents will occur!
        this.chartBackGround = this.addChild(new PIXI.Graphics())
        this.chartText = this.addChild( new PIXI.Text());
        this.boundMask = this.addChild(new PIXI.Graphics());
        // this.scrollbox = new Scrollbox();
    }

    clear(){

        
        console.log('toolTip code cleaning....')

    }

    setAndShow(node,posX,posY){

        const initVScurrent = hapnetConfig.initStageHeight / hapnetConfig.currentStageHeight
        // console.log(`initVScurrent ${ Math.log10(initVScurrent)}`)
        // const zoomToLarge = hapnetConfig.currentStageHeight / hapnetConfig.initStageHeight
        // const scaledNodeX = node.x * hapnetConfig.initScale;
        // const scaledNodeY = node.y * hapnetConfig.initScale;
        const scaledNodeX = posX;
        const scaledNodeY = posY;
        const scaleBorderWidth = this.options.toolTip.width * 0.2 * hapnetConfig.initScale * hapnetConfig.initStageHeight / hapnetConfig.currentStageHeight ;
        // const toolTipWidth = window.innerWidth *0.2 * hapnetConfig.initStageWidth / hapnetConfig.currentStageWidth ;
        // const toolTipHeight = window.innerHeight *0.5  * hapnetConfig.initStageHeight / hapnetConfig.currentStageHeight ;
        const toolTipWidth = window.innerWidth *0.2 
        const toolTipHeight = window.innerHeight *0.5  
        const toolTipFontSize = this.options.toolTip.fontSize  ;


        this.x = scaledNodeX;
        this.y = scaledNodeY;
        this.chartBackGround.visible = true;
        this.zIndex = 2;

        
        // this.scrollbox.boxWidth= toolTipWidth;
        // this.scrollbox.boxHeight = toolTipHeight /2 ;

        // the position of this.chartBackGround is based on parent container. 
        this.chartBackGround
        .beginFill(this.options.toolTip.backgroundColor, 1)
        .lineStyle(scaleBorderWidth, this.options.toolTip.borderColor)
        .moveTo(0,0)
        .lineTo(toolTipWidth,0)
        .lineTo(toolTipWidth,toolTipHeight)
        .lineTo(0,toolTipHeight)
        .lineTo(0,0)
        .endFill();



        const  style = new PIXI.TextStyle({
            fill: this.options.toolTip.fontColor,
            fontSize: toolTipFontSize ,
            breakWords:true,
            wordWrap:true,
            wordWrapWidth:toolTipWidth ,
            // width:toolTipWidth ,
        });
        // let textMetrics = PIXI.TextMetrics.measureText('hello woo000000000000000000000000000000oorld', style)
        this.chartText.resolution = 2 ;
        this.chartText.zIndex = 4;
        this.chartText.style =  style

        const toolTipText = `ID: ${node.id}\n\nRadius: ${node.radius}\n\nComposition: \n${
            node.sectors.map(d=>{
                return d.category +": "+d.number.toFixed(4)
            }).join("\n")
        }\n
        `

        this.chartText.text = toolTipText;
        // this.chartText.width = toolTipWidth *0.95
        this.chartText.visible = true;

        // let textMetrics = PIXI.TextMetrics.measureText(toolTipText, style)
        
        // Add the rectangular area to show
        this.boundMask.beginFill(0xff19ff,1)
        .moveTo(0,0)
        .lineTo(toolTipWidth,0)
        .lineTo(toolTipWidth,toolTipHeight)
        .lineTo(0,toolTipHeight)
        .lineTo(0,0)
        .endFill();
        this.mask = this.boundMask;
    }
}


export {toolTip}