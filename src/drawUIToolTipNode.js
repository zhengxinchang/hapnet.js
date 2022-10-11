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
import {capitalize} from "lodash-es";

/**
 * Class of tooltip to show data in  the nodes -> one node -> meta -> hover
 */
class UIToolTipNode extends PIXI.Container {

  /**
   * @constructor
   */
  constructor() {
    super();
    this.name = "hapnet_menu";
    //sub objects must be initialized in the constructor(), otherwise, accidents will occur!
    this.chartBackGround = this.addChild(new PIXI.Graphics())
    this.chartText = this.addChild(new PIXI.Text());
    this.boundMask = this.addChild(new PIXI.Graphics());

    /* turn on the interactive mode */
    this.interactive = true;
    this.buttonMode = true;

    /* set mouse status */
    this.on('mouseover', (event) => {
      store.runtimeGlobal.mouseStatus.onToolTip = true;
    });
    this.on('mouseout', (event) => {
      store.runtimeGlobal.mouseStatus.onToolTip = false;
    });

    /* init parameters */
    this.scaleBorderWidth = store.runtimeGlobal.initOption.width * 0.002;
    this.toolTipWidth = store.runtimeGlobal.initOption.width * 0.15
    this.toolTipHeight = store.runtimeGlobal.initOption.height * 0.3
    this.toolTipFontSize = store.runtimeGlobal.plotOption.toolTip.fontSize;
    this.toolTipBackGroundColor = store.runtimeGlobal.plotOption.toolTip.backgroundColor;
    this.toolTipBorderColor = store.runtimeGlobal.plotOption.toolTip.borderColor;
    /* init padding of text on the left and top */
    this.paddingLeft = this.toolTipWidth * 0.02;
    this.paddingTop = this.toolTipHeight * 0.02;

  }

  clear() {

    console.log('toolTip code cleaning....')

  }

  scroll(deltaFixed) {


    const scrollContentDelta = this.toolTipHeight * deltaFixed / 30;
    const nextYPosition = this.chartText.y + scrollContentDelta;
    const scrollContent = Math.max((this.textMetrics.lineHeight * this.textMetrics.lines.length), this.toolTipHeight)
    // console.log(`
    // this.chartText.y:${this.chartText.y},
    // deltaFixed:${deltaFixed},
    // this.textMetrics.height:${this.textMetrics.height},
    // this.toolTipHeight ${this.toolTipHeight}
    // nextYPosition ${nextYPosition}
    // this.paddingTop ${this.paddingTop}
    // scrollContent ${scrollContent}
    // `)
    // console.log(this.textMetrics)

    /* use delta to compare two value */

    if (nextYPosition > 0) {
      if (Math.abs(nextYPosition - this.paddingTop) < 0.01) {
        this.chartText.y = this.paddingTop
      }
    } else {

      /*
          TODO:
          set bottom border detection.
      */
      this.chartText.y = nextYPosition
    }
  }


  setAndShow(node, posX, posY) {


    /* offset one px as padding */
    this.x = posX + 1;
    this.y = posY + 1;
    this.chartBackGround.x = 0;
    this.chartBackGround.y = 0;
    this.chartBackGround.visible = true;
    this.zIndex = 2;

    /* the position of this.chartBackGround is based on parent container. */
    this.chartBackGround
      .beginFill(this.toolTipBackGroundColor, 1)
      .lineStyle(this.scaleBorderWidth, this.toolTipBorderColor)
      .moveTo(0, 0)
      .lineTo(this.toolTipWidth, 0)
      .lineTo(this.toolTipWidth, this.toolTipHeight)
      .lineTo(0, this.toolTipHeight)
      .lineTo(0, 0)
      .endFill();

    const style = new PIXI.TextStyle({
      fill: store.runtimeGlobal.plotOption.toolTip.fontColor,
      fontSize: this.toolTipFontSize,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: this.toolTipWidth * 0.95,
      // width:toolTipWidth ,
    });
    // let textMetrics = PIXI.TextMetrics.measureText('hello woo000000000000000000000000000000oorld', style)
    this.chartText.x = this.paddingLeft;
    this.chartText.y = this.paddingTop;
    this.chartText.resolution = 2;
    this.chartText.zIndex = 4;
    this.chartText.style = style

    let toolTipText = `ID: ${node.id}\n\nRadius: ${node.size}\n\n`
    Object.keys(node.meta.hover).forEach(d => {
      toolTipText += `${capitalize(d)}: ${node.meta.hover[d]}\n\n`
    })
    console.log(toolTipText)
    console.log(node)
    this.chartText.text = toolTipText;
    // this.chartText.width = toolTipWidth *0.95
    this.chartText.visible = true;

    this.textMetrics = PIXI.TextMetrics.measureText(toolTipText, style)

    // console.log(textMetrics)
    // Add the rectangular area to show
    this.boundMask.beginFill(0xff19ff, 1)
      .moveTo(0, 0)
        .lineTo(this.toolTipWidth,0)
        .lineTo(this.toolTipWidth,this.toolTipHeight)
        .lineTo(0,this.toolTipHeight)
        .lineTo(0,0)
        .endFill();
        this.mask = this.boundMask;

    }
}


export {UIToolTipNode}