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
import {UILinkPanelUnit} from "./UILinkPanelUnit";
import {getLinkName} from '../../utils'
class UILinkPanel extends PIXI.Container {
  constructor(data) {
    super();

    /* init drawing parameters */
    this.scaleBorderWidth = store.runtimeGlobal.initOption.width * 0.002;
    this.uiWidth = store.runtimeGlobal.initOption.width * 0.2;
    this.uiHeight = store.runtimeGlobal.initOption.height * 0.55;
    this.uiFontSize = store.runtimeGlobal.plotOption.linkMetaPanel.fontSize;
    this.uiBackGroundColor = store.runtimeGlobal.plotOption.linkMetaPanel.backgroundColor;
    this.uiBorderColor = store.runtimeGlobal.plotOption.linkMetaPanel.borderColor;
    this.chartTitleHeight = 40;


    /* init parameters*/
    this.chartBackGround = this.addChild(new PIXI.Graphics());

    this.boundMask = this.addChild(new PIXI.Graphics());
    this.content = this.addChild(new PIXI.Container()); // Container of color codes.
    this.chartTitle = new PIXI.Text();
    this.content.x = 10;
    this.content.y = 10;

    /* init total containers properties */
    this.interactive = true;
    this.paddingLeft = this.uiWidth * 0.02;
    this.paddingTop = this.uiHeight * 0.02;
    this.x = store.runtimeGlobal.initOption.width * 0.795;
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

  /**
   * draw and show link panel
   * @param {object} link linkOptions
   */
  setAndShow(link) {

    this.content.removeChild();
    this.chartBackGround.x = 0;
    this.chartBackGround.y = 0;
    this.zIndex = 2;

    // debugger;

    this.chartBackGround
      .beginFill(this.uiBackGroundColor, 1)
      .lineStyle(this.scaleBorderWidth, this.uiBorderColor)
      .moveTo(0, 0)
      .lineTo(this.uiWidth, 0)
      .lineTo(this.uiWidth, this.uiHeight)
      .lineTo(0, this.uiHeight)
      .lineTo(0, 0)
      .endFill();

    /* deal with header text */
    console.log(link)
    this.chartTitle.text = `Metadata of Link ${getLinkName(link)}`
    this.chartTitle.style = new PIXI.TextStyle({
      fill: 0x000000,
      fontSize: this.uiFontSize,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: this.uiWidth * 0.95,
    });
    this.chartTitle.x = this.paddingLeft;
    this.chartTitle.y = this.paddingTop;
    this.addChild(this.chartTitle);

    /* setup the y of container for NodeBlocks*/
    this.content.y = this.chartTitle.height * 1.5 + this.paddingTop;

    let offset = 0;
    for (const [onePanelMetaKey, onePanelMetaValue] of Object.entries(link.meta.panel)) {
      /* UINodePanelUnit is the unit for one entry in the meta -> panel */

      let onePanelUnit = this.content.addChild(new UILinkPanelUnit(onePanelMetaValue, onePanelMetaKey, getLinkName(link), offset, this.uiWidth * 0.95));
      onePanelUnit.draw();
      offset = onePanelUnit.getNewOffset();
    }
  }

}

export {UILinkPanel}