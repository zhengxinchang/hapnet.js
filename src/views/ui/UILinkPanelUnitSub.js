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

class UILinkPanelUnitSub extends PIXI.Container {

  constructor(subUnitData, dataType, offSet) {
    super();
    this.subUnitData = subUnitData;
    this.dataType = dataType;
    this.offSet = offSet;

    this.contentWidth = store.runtimeGlobal.initOption.width * 0.2 * 0.95;
    this.chartText = this.addChild(new PIXI.Text());
    this.y = this.offSet;
    this.scaleBorderWidth = store.runtimeGlobal.initOption.width * 0.002;
    this.uiFontSize = store.runtimeGlobal.plotOption.linkMetaPanel.fontSize;


    if (this.dataType == "string") {

      this.chartText.text = this.subUnitData;
      this.chartText.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: this.uiFontSize,
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: this.contentWidth * 0.95,
      });

    } else if (this.dataType == "object") {
      let conentText = "";

      for (const [k, v] of Object.entries(this.subUnitData)) {
        console.log(`subUnitData ${k},${v}`)
        conentText += `${k}: ${v}\n`
      }
      this.chartText.text = conentText;
      this.chartText.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: this.uiFontSize,
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: this.contentWidth * 0.95,
      });
    } else if (this.dataType == "singleValue") {
      this.chartText.text = `value:  ${this.subUnitData}`;
      this.chartText.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: this.uiFontSize,
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: this.contentWidth * 0.95,
      });
    }
  }

  getNewOffset() {
    return this.offSet + this.height;
  }


}

export {UILinkPanelUnitSub}