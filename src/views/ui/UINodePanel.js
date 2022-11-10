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
import {UINodePanelUnit} from "./UINodePanelUnit";

/**
 * class to draw panel data from nodes -> one node -> meta -> panel.
 *  最外层的容器，内部this.content中应该包含子容器(drawUINodePanelUnit)，子容器中包含多个item项目(drawUINodePanelUnitSub)。
 */
class UINodePanel extends PIXI.Container {

  /**
   * @constructor
   */
  constructor(data) {
    super();

    // this.name =  "hapnet_ui_date_panel_node";
    this.interactive = true;

    /* init parameters*/
    this.chartBackGround = this.addChild(new PIXI.Graphics());
    this.boundMask = this.addChild(new PIXI.Graphics());
    this.content = this.addChild(new PIXI.Container()); // Container of color codes.
    this.chartTitle = new PIXI.Text();
    this.content.x = 10;
    this.content.y = 10;
    this.sortableChildren = true;

    /* init drawing parameters */
    this.scaleBorderWidth = store.runtimeGlobal.initOption.width * 0.002;
    this.toolTipWidth = store.runtimeGlobal.initOption.width * 0.2;
    this.toolTipHeight = store.runtimeGlobal.initOption.height * 0.55;
    this.toolTipFontSize = store.runtimeGlobal.plotOption.nodeMetaPanel.fontSize;
    this.toolTipBackGroundColor = store.runtimeGlobal.plotOption.nodeMetaPanel.backgroundColor;
    this.toolTipBorderColor = store.runtimeGlobal.plotOption.nodeMetaPanel.borderColor;
    this.chartTitleHeight = 40;

    /* init padding of text on the left and top */
    this.paddingLeft = this.toolTipWidth * 0.02;
    this.paddingTop = this.toolTipHeight * 0.02;
    this.x = 1;
    this.y = store.runtimeGlobal.initOption.height * 0.41;
  }


  scroll(deltaFixed) {
    const scrollContentDelta = this.height * deltaFixed / 20;
    const nextYPosition = this.content.y + scrollContentDelta;

    this.content.y = nextYPosition

    /*
     TODO:
     set bottom border detection.
    */
  }

  setAndShow(node) {
    /* remove all children from this.meta
    *  the chartTitle are also be removed.
    */
    this.content.removeChildren();

    this.chartBackGround.x = 0;
    this.chartBackGround.y = 0;
    // this.chartBackGround.visible = true;
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

    this.chartTitle.text = `Metadata of Haplotype ${node.id}`
    this.chartTitle.style = new PIXI.TextStyle({
      fill: 0x000000,
      fontSize: this.toolTipFontSize,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: this.toolTipWidth * 0.95,
    });
    this.chartTitle.x = this.paddingLeft;
    this.chartTitle.y = this.paddingTop;

    /* finally, the title of panel is added in this.content*/
    this.addChild(this.chartTitle);

    /* setup the y of container for NodeBlocks*/
    this.content.y = this.chartTitle.height * 1.5 + this.paddingTop;

    /* Iteratively draw unit */
    /*the offset indicate the offset y value for the current unit and this value will be passed to next unit, thus the next unit will start with offset y vlaue.*/
    let offset = 0;
    for (const [onePanelMetaKey, onePanelMetaValue] of Object.entries(node.meta.panel)) {
      /* UINodePanelUnit is the unit for one entry in the meta -> panel */
      let onePanelUnit = this.content.addChild(new UINodePanelUnit(onePanelMetaValue, onePanelMetaKey, node.id, offset, this.toolTipWidth * 0.95));
      onePanelUnit.draw();
      offset = onePanelUnit.getNewOffset();
    }

    /* set mask */
    this.boundMask.beginFill(0xff19ff, 1)
      .moveTo(this.paddingLeft, this.chartTitle.height * 2)
      .lineTo(this.toolTipWidth - this.paddingLeft, this.chartTitle.height * 2)
      .lineTo(this.toolTipWidth - this.paddingLeft, this.toolTipHeight - this.paddingTop)
      .lineTo(0, this.toolTipHeight - this.paddingTop)
      .lineTo(0, this.chartTitle.height * 1.5)
      .endFill();
    this.content.mask = this.boundMask;
  }

}

export {UINodePanel}