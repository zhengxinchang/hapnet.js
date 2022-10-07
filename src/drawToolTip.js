import * as PIXI from 'pixi.js'
import {defaultsDeep} from 'lodash-es'
import { hapnetConfig } from './envs'


class toolTip extends PIXI.Container {

    constructor(options){
        super();
        this.options = options;
        this.name = "hapnet_menu";
        this.chartBackGround = this.addChild(new PIXI.Graphics())

        this.scale.x = 1/hapnetConfig.initScale
        this.scale.y = 1/hapnetConfig.initScale

        



        this.chartText = this.addChild( new PIXI.Text());

    }

    clear(){
        this.chartBackGround.visible = false;
        this.chartBackGround.clear();
        this.chartText.visible = false;
    }

    setAndShow(node){

        // console.log(node)
        const initVScurrent = hapnetConfig.initStageHeight / hapnetConfig.currentStageHeight
        console.log(`initVScurrent ${ Math.log10(initVScurrent)}`)
        // const zoomToLarge = hapnetConfig.currentStageHeight / hapnetConfig.initStageHeight
        const scaledNodeX = node.x * hapnetConfig.initScale;
        const scaledNodeY = node.y * hapnetConfig.initScale;
        const scaleBorderWidth = this.options.toolTip.width * 0.2 * hapnetConfig.initScale * hapnetConfig.initStageHeight / hapnetConfig.currentStageHeight ;
        const toolTipWidth = window.innerWidth *0.2 * hapnetConfig.initStageWidth / hapnetConfig.currentStageWidth ;
        const toolTipHeight = window.innerHeight *0.5  * hapnetConfig.initStageHeight / hapnetConfig.currentStageHeight ;
        const toolTipFontSize = this.options.toolTip.fontSize *1.5  * hapnetConfig.initStageHeight / hapnetConfig.currentStageHeight ;

        console.log(`window.innerWidth ${window.innerWidth}`)
        console.log(`hapnetConfig.initStageWidth ${hapnetConfig.initStageWidth}`)
        console.log(`hapnetConfig.currentStageWidth  ${ hapnetConfig.currentStageWidth }`)
        console.log(`toolTipWidth  ${toolTipWidth }`)
        this.x = scaledNodeX;
        this.y = scaledNodeY;
        console.log(hapnetConfig)
        this.chartBackGround.visible = true;
        // this.chart.zIndex = 2;
        this.zIndex = 2;
        this.chartBackGround
        .beginFill(this.options.toolTip.backgroundColor, 1)
        .lineStyle(scaleBorderWidth, this.options.toolTip.borderColor)
        .moveTo(scaledNodeX,                 scaledNodeY)
        .lineTo(scaledNodeX + toolTipWidth,  scaledNodeY)
        .lineTo(scaledNodeX + toolTipWidth,  scaledNodeY+toolTipHeight)
        .lineTo(scaledNodeX,                 scaledNodeY + toolTipHeight)
        .lineTo(scaledNodeX,                 scaledNodeY)
        .endFill();

        console.log(this)

        console.log(`toolTipWidth: ${toolTipWidth}`)

        const  style = new PIXI.TextStyle({
            fill: "#FF0000",
            fontSize: toolTipFontSize ,
            breakWords:true,
            wordWrap:true,
            wordWrapWidth:toolTipWidth ,
            width:toolTipWidth ,
        });
        // let textMetrics = PIXI.TextMetrics.measureText('hello woo000000000000000000000000000000oorld', style)
        // console.log(textMetrics)
        // this.chartText.destroy()
        this.chartText.x = scaledNodeX +1 ;
        this.chartText.y = scaledNodeY + 1;
        // console.log(`this.chartText.resolution  ${this.chartText.resolution }`)
        this.chartText.resolution = 20 ;
        console.log(this.chartText)
        // this.chartText.scale.y =  hapnetConfig.initStageHeight/hapnetConfig. currentStageHeight
        // this.chartText.scale.x =  hapnetConfig.initStageWidth /hapnetConfig.currentStageWidth
        this.chartText.zIndex = 4;
        this.chartText.style =  style
        this.chartText.text = `Node ID: ${node.id}`
        this.chartText.width = toolTipWidth *0.95
        this.chartText.visible = true;


    }
}


export {toolTip}