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
import {UINodeColorLegendUnit} from './drawUINodeColorLegendUnit'

/**
 * Class to draw panel ui to show data in the nodes -> one node -> meta -> panel
 */
class UINodeColorLegend extends PIXI.Container {

  /**
   * @constructor
   */
  constructor() {
    super();

    /* init UINodeColorLegend object*/
    this.name = "hapnet_ui_color_legend";
    this.interactive = true;

    /* initialize objects */
    this.chartBackGround = this.addChild(new PIXI.Graphics());
    this.boundMask = this.addChild(new PIXI.Graphics());
    this.content = this.addChild(new PIXI.Container()); // Container of color codes.
    this.chartTitle = this.content.addChild(new PIXI.Text());
    this.chartLegendContainer = this.content.addChild(new PIXI.Container());
    this.chartLegendContainer.sortableChildren = true;
    this.chartLegendContainer.x = 10;
    this.chartLegendContainer.y = 10;
    this.content.x = 10;
    this.content.y = 10;
    this.sortableChildren = true;

    /* init drawing parameters */
    this.scaleBorderWidth = store.runtimeGlobal.initOption.width * 0.002;
    this.toolTipWidth = store.runtimeGlobal.initOption.width * 0.2
    this.toolTipHeight = store.runtimeGlobal.initOption.height * 0.4
    this.toolTipFontSize = store.runtimeGlobal.plotOption.nodeColorLegend.fontSize;
    this.toolTipBackGroundColor = store.runtimeGlobal.plotOption.nodeColorLegend.backgroundColor;
    this.toolTipBorderColor = store.runtimeGlobal.plotOption.nodeColorLegend.borderColor;
    this.chartTitleHeight = 40;
    /* init padding of text on the left and top */
    this.paddingLeft = this.toolTipWidth * 0.02;
    this.paddingTop = this.toolTipHeight * 0.02;
  }

  clear() {

    console.log('toolTip code cleaning....')

  }

  scroll(deltaFixed) {

    console.log("UINodeColorLegend scrolling.")
    const scrollContentDelta = this.toolTipHeight * deltaFixed / 30;
    const nextYPosition = this.chartLegendContainer.y + scrollContentDelta;

    this.chartLegendContainer.y = nextYPosition;

    // if (nextYPosition > 0) {
    //   if (Math.abs(nextYPosition - this.paddingTop) < 0.01) {
    //     this.chartText.y = this.paddingTop
    //   }
    // } else {
    //
    //   /*
    //       TODO:
    //       set bottom border detection.
    //   */
    //   this.chartText.y = nextYPosition
    // }
  }


  setAndShow(node) {
    this.x = 0;
    this.y = 0;
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

    /* draw chartTitie*/
    this.chartTitle.text = `Color code for ${node.id}`
    this.chartTitle.x = this.paddingLeft;
    this.chartTitle.style = new PIXI.TextStyle({
      fill: 0x000000,
      fontSize: this.toolTipFontSize,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: this.toolTipWidth * 0.95,
      // width:toolTipWidth ,
    });

    /* remove all children */
    this.chartLegendContainer.y = this.chartTitleHeight;
    this.chartLegendContainer.removeChildren();

    node.sectors.forEach((sector, idx) => {

      this.chartLegendContainer.addChild(new UINodeColorLegendUnit(sector, node.id, idx));
    });

    this.boundMask.beginFill(0xff19ff, 1)
      .moveTo(0, this.chartTitleHeight)
      .lineTo(this.toolTipWidth - this.paddingLeft, this.chartTitleHeight)
      .lineTo(this.toolTipWidth - this.paddingLeft, this.toolTipHeight - this.paddingTop)
      .lineTo(0, this.toolTipHeight - this.paddingTop)
      .lineTo(0, this.chartTitleHeight)
      .endFill();
    this.chartLegendContainer.mask = this.boundMask;

  }
}

export {UINodeColorLegend}