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
import {isPlainObject, isArray, isString} from 'lodash-es'
import {NodePanelUnitSub} from "./UINodePanelUnitSub";

/**
 * unit class to draw data block from node panel data
 * @param {Ojbect} data data from nodes -> one node -> meta -> panel
 * @param {String} dataName name  of data
 * @param {String} linkName name of node
 * @param {Number} offset offset
 * @param {Number} maxWidth maxWidth of data block
 */
class UILinkPanelUnit extends PIXI.Container {

  constructor(data, dataName, linkName, offset, maxWidth) {
    super();
    this.name = "hapnet_ui_link_panel_unit";
    this.data = data;
    this.dataName = dataName;
    this.linkName = linkName;
    this.offset = offset;
    this.maxWidth = maxWidth;
    this.interactive = true;

    this.y = this.offset;
    this.x = 0;

    /* initialize children elements */
    this.chartBackGround = this.addChild(new PIXI.Graphics());
    this.boundMask = this.addChild(new PIXI.Graphics());
    this.content = this.addChild(new PIXI.Container()); // Container of color codes.
    this.chartTitle = this.addChild(new PIXI.Text());


    /* init drawing parameters */
    this.scaleBorderWidth = store.runtimeGlobal.initOption.width * 0.002;
    this.uiWidth = this.maxWidth;
    this.uiFontSize = store.runtimeGlobal.plotOption.nodeMetaPanel.fontSize;
    this.uiBackGroundColor = store.runtimeGlobal.plotOption.nodeMetaPanel.backgroundColor;
    this.uiBorderColor = store.runtimeGlobal.plotOption.nodeMetaPanel.borderColor;
    this.UIFrontColor = store.runtimeGlobal.plotOption.nodeMetaPanel.fontColor
    this.chartTitleHeight = 40;

    /* init padding of text on the left and top */
    this.paddingLeft = this.uiWidth * 0.02;
    this.content.x = this.paddingLeft

  }

  draw() {


    /* setup title for each panel meta data item
    *
    */
    this.chartTitle.x = 5;
    this.chartTitle.y = 2;
    this.chartTitle.text = `${this.dataName}`
    this.chartTitle.style = new PIXI.TextStyle({
      fill: 0x000000,
      fontSize: this.uiFontSize,
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: this.uiWidth * 0.95,

    });

    this.content.y = this.chartTitle.height * 1.5 /* here we setup y coordinate of this.content, the unit-sub y will against content */

    if (isPlainObject(this.data)) {
      // console.log(`object detected ${this.dataName} for ${this.nodeName}`)

      let offSet = 0;
      let oneNodePanelUnitSub = new NodePanelUnitSub(this.data, "object", offSet)
      this.content.addChild(oneNodePanelUnitSub);

    } else if (isArray(this.data)) {
      if (isPlainObject(this.data[0])) {
        // console.log(`arrayObject detected ${this.dataName} for ${this.nodeName}`)
        /* process data structure like:
           "Virus": [
                      {
                          "acc": "EPI_ISL_492486",
                          "date": "2020-04-24",
                          "loci": "United Kingdom",
                          "name": "hCoV-19/England/NORT-299653/2020"
                       }
                    ],
        */

        let offSet = 0;
        for (const onedata of this.data) {
          let oneNodePanelUnitSub = new NodePanelUnitSub(onedata, "object", offSet)
          offSet = oneNodePanelUnitSub.getNewOffset();
          this.content.addChild(oneNodePanelUnitSub);

        }


      } else if (isString(this.data[0])) {
        // console.log(`ArrayString detected ${this.dataName} for ${this.nodeName}`)
        /* process data structure like:
        "SNPs": [
          "3037(SNP:C->T)",
          "6350(Deletion:A->-)",
          "6351(Deletion:A->-)",
          "6352(Deletion:G->-)",
          "6353(Deletion:T->-)",
          "6354(Deletion:C->-)",
          "6355(Deletion:A->-)",
        ]
         */
        let offSet = 0;
        for (const onedata of this.data) {
          let oneNodePanelUnitSub = new NodePanelUnitSub(onedata, "string", offSet)
          offSet = oneNodePanelUnitSub.getNewOffset();
          this.content.addChild(oneNodePanelUnitSub);

        }


      }

    }
    this.chartBackGround.x = 0;
    this.chartBackGround.y = 0;
    this.chartBackGround.visible = true;
    this.zIndex = 2;

    // console.log(this.toolTipWidth, this.height)

    const currHeight = this.height + 10
    this.chartBackGround
      .beginFill(this.uiBackGroundColor, 1)
      .lineStyle(this.scaleBorderWidth * 0.5, this.uiBorderColor)
      .moveTo(0, 0)
      .lineTo(this.uiWidth, 0)
      .lineTo(this.uiWidth, currHeight)
      .lineTo(0, currHeight)
      .lineTo(0, 0)
      .endFill();
  }

  getNewOffset() {
    return this.offset + this.height + 10;
  }
}

export {UILinkPanelUnit}