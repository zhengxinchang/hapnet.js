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
import store from './store'


class toolTip extends PIXI.Container {

    constructor(options){
        super();
        this.options = options;
        this.name = "hapnet_menu";
        //sub objects must be initialized in the constructor(), otherwise, accidents will occur!
        this.chartBackGround = this.addChild(new PIXI.Graphics())
        this.chartText = this.addChild( new PIXI.Text());
        this.boundMask = this.addChild(new PIXI.Graphics());

        /* turn on the interactive mode */
        this.interactive = true;
        this.buttonMode = true;
        /* set mouse status */
        this.on('mouseover', (event) => {
            // console.log(event)
            store.runtimeGlobal.mouseStatus.onToolTip = true;
        });
        this.on('mouseout', (event) => {
            // console.log(event)
            store.runtimeGlobal.mouseStatus.onToolTip = false;
        });

                /* init parameters */
        this.scaleBorderWidth = store.runtimeGlobal.initOption.width * 0.002 ;
        this.toolTipWidth = store.runtimeGlobal.initOption.width *0.2 
        this.toolTipHeight = store.runtimeGlobal.initOption.height *0.5  
        this.toolTipFontSize = store.runtimeGlobal.plotOption.toolTip.fontSize  ;
        this.toolTipBackGroundColor = store.runtimeGlobal.plotOption.toolTip.backgroundColor;
        this.toolTipBorderColor = store.runtimeGlobal.plotOption.toolTip.borderColor;


    }

    clear(){

        
        console.log('toolTip code cleaning....')

    }

    scroll(deltaFixed){
        console.log(`
        this.chartText.y:${this.chartText.y},
        deltaFixed:${deltaFixed},
        this.textMetrics.height:${this.textMetrics.height},
        (this.chartText.y + Math.max(this.textMetrics.height,this.toolTipHeight)) :${(this.chartText.y + Math.max(this.textMetrics.height,this.toolTipHeight)) }
        `)
        // this.chartBackGround.y +=  this.toolTipHeight * deltaFixed /100
        // if(this.chartText.y >= 0 && deltaFixed < 0){
            
        //     this.chartText.y +=  this.toolTipHeight * deltaFixed /100
        // }else if( this.chartText.y < 0 && deltaFixed <0  ){
            
        // }

        if( this.chartText.y >= this.toolTipWidth *0.02 || (Math.abs(this.chartText.y) - Math.max(this.textMetrics.height,this.toolTipHeight)) > this.toolTipWidth *0.02 ){

        }else{
            this.chartText.y +=  this.toolTipHeight * deltaFixed /100
        }
        
        // this.chartText.y +=  this.toolTipHeight * deltaFixed /100
    }
        

    setAndShow(node,posX,posY){



        this.x = posX+1;
        this.y = posY+1;
        this.chartBackGround.x = 0;
        this.chartBackGround.y = 0;
        this.chartBackGround.visible = true;
        this.zIndex = 2;

        // the position of this.chartBackGround is based on parent container. 
        this.chartBackGround
        .beginFill(this.toolTipBackGroundColor, 1)
        .lineStyle(this.scaleBorderWidth, this.toolTipBorderColor)
        .moveTo(0,0)
        .lineTo(this.toolTipWidth,0)
        .lineTo(this.toolTipWidth,this.toolTipHeight)
        .lineTo(0,this.toolTipHeight)
        .lineTo(0,0)
        .endFill();

        const  style = new PIXI.TextStyle({
            fill: store.runtimeGlobal.plotOption.toolTip.fontColor,
            fontSize: this.toolTipFontSize ,
            breakWords:true,
            wordWrap:true,
            wordWrapWidth:this.toolTipWidth *0.95 ,
            // width:toolTipWidth ,
        });
        // let textMetrics = PIXI.TextMetrics.measureText('hello woo000000000000000000000000000000oorld', style)
        this.chartText.x = this.toolTipWidth *0.02;
        this.chartText.y = this.toolTipHeight *0.02;
        this.chartText.resolution = 2 ;
        this.chartText.zIndex = 4;
        this.chartText.style =  style

        const toolTipText = `ID: ${node.id}\n\nRadius: ${node.radius}\n\nComposition: \n${
            node.sectors.map(d=>{
                return d.category +": "+d.number.toFixed(4)
            }).join("\n")
        }\n
        asdfasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        `

        this.chartText.text = toolTipText;
        // this.chartText.width = toolTipWidth *0.95
        this.chartText.visible = true;

        this.textMetrics = PIXI.TextMetrics.measureText(toolTipText, style)
        
        // console.log(textMetrics)
        // Add the rectangular area to show
        this.boundMask.beginFill(0xff19ff,1)
        .moveTo(0,0)
        .lineTo(this.toolTipWidth,0)
        .lineTo(this.toolTipWidth,this.toolTipHeight)
        .lineTo(0,this.toolTipHeight)
        .lineTo(0,0)
        .endFill();
        this.mask = this.boundMask;

    }
}


export {toolTip}