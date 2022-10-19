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
import store from '../../store'


/**
 * Class to draw one color code in the NodeColorLegend Object.
 */
class UINodeColorLegendUnit extends PIXI.Container {

  /**
   * @constructor
   * @param {Object} options <pre>options to draw one color code:
   * {
   *   number: number // number value for one sector. range from 1-100.
   *   percent: number // percent value for one sector. range from 0-1.
   *   color: number  // color in the number format.
   * }
   * </pre>
   * @param {String} nodeName name of related node
   * @param {number} idx the idx of sector
   */
  constructor(options, nodeName, idx) {
    super();
    this.options = options;
    this.nodeName = nodeName;
    this.idx = idx;
    /* init UINodeColorLegend object*/
    this.name = "hapnet_ui_color_legend";
    this.interactive = true;

    /* initialize objects */
    this.chartBackGround = this.addChild(new PIXI.Graphics());
    this.boundMask = this.addChild(new PIXI.Graphics());
    this.chartText = this.addChild(new PIXI.Text());


    /* init drawing parameters */
    this.scaleBorderWidth = store.runtimeGlobal.initOption.width * 0.001;
    this.toolTipWidth = store.runtimeGlobal.initOption.width * 0.2
    this.toolTipHeight = store.runtimeGlobal.initOption.height * 0.04
    this.toolTipFontSize = store.runtimeGlobal.plotOption.nodeColorLegend.fontSize;
    this.toolTipBorderColor = store.runtimeGlobal.plotOption.nodeColorLegend.borderColor;

    /* init padding of text on the left and top */
    this.paddingLeft = this.toolTipWidth * 0.02;
    this.paddingTop = this.toolTipHeight * 0.02;

    this.draw();
  }

  draw() {

    // debugger;
    this.chartBackGround.x = 0;
    this.chartBackGround.y = 0 + this.toolTipHeight * this.idx;
    this.chartBackGround.visible = true;
    this.zIndex = 2;

    this.chartBackGround
      .beginFill(this.options.color, 1)
      .lineStyle(this.scaleBorderWidth, this.toolTipBorderColor)
      .moveTo(0, 0)
      .lineTo(this.toolTipWidth, 0)
      .lineTo(this.toolTipWidth, this.toolTipHeight)
      .lineTo(0, this.toolTipHeight)
      .lineTo(0, 0)
      .endFill();

    const style = new PIXI.TextStyle({
      fill: store.runtimeGlobal.plotOption.nodeColorLegend.fontColor,
      fontSize: this.toolTipFontSize,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: this.toolTipWidth * 0.95,
      // width:toolTipWidth ,
    });

    this.chartText.x = this.paddingLeft;
    this.chartText.y = this.paddingTop + this.toolTipHeight * this.idx;
    this.chartText.resolution = 2;
    this.chartText.zIndex = 8;
    this.chartText.style = style
    this.chartText.text = `${this.options.category}  ${(this.options.percent * 100).toFixed(2)}%`;

    // this.boundMask
    //   .beginFill(0xff19ff,1)
    //   .moveTo(0,0)
    //   .lineTo(this.toolTipWidth,0)
    //   .lineTo(this.toolTipWidth,this.toolTipHeight)
    //   .lineTo(0,this.toolTipHeight)
    //   .lineTo(0,0)
    //   .endFill();
    // this.mask = this.boundMask;
  }
}

export {UINodeColorLegendUnit}