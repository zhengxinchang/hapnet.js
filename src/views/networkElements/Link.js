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
import {conformsTo, defaultsDeep, isNumber, isObject} from 'lodash-es';
import {calLineHitArea, linkDistanceColorScale} from '../../utils'
import store from '../../store'
import chroma from "chroma-js";


/**
 * Link object
 */
class LINK extends PIXI.Graphics {

  constructor(linkOptions, linkStyles, plotOption_style, drawCoarseGraph = false, debug = false) {
    super();

    this.plotOption_style = plotOption_style;

    const isValidate = conformsTo(linkOptions, {
      source: d => isObject(d),
      target: d => isObject(d),
      distance: d => isNumber(d),
      meta: d => isObject(d)
    }) && conformsTo(linkStyles, {
      linkWidth: d => isNumber(d),
      linkColor: d => isNumber(d)
    })

    if (isValidate) {
      this.linkOptions = linkOptions;
      this.linkStyles = linkStyles;
    } else {
      console.log("Can not draw link");
      console.log(linkOptions, linkStyles)
    }

    //
    this.name = [linkOptions.source.id, linkOptions.target.id].sort().join("_"); // set unique name for each link.
    // this.id = [linkOptions.source.id, linkOptions.target.id].sort().join("_");
    this.interactive = true;
    this.buttonMode = true;

    /*
     * calculate hit area of the link and register it
     */
    this.hitArea = new PIXI.Polygon(calLineHitArea(
      this.linkOptions.source.x,
      this.linkOptions.source.y,
      this.linkOptions.target.x,
      this.linkOptions.target.y,
      this.linkStyles.linkWidth
    ));

    /* trigger tooltip when hover */
    // this.on('mouseover', (event) => {
    //
    //   // console.log(event.data)
    //   // console.log(this)
    //   store.runtimeGlobal.mouseStatus.onLink = true;
    //   store.runtimeGlobal.pixiApp.hapnetToolTipLink.setAndShow(this.linkOptions, event.data.global.x, event.data.global.y);
    //   store.runtimeGlobal.pixiApp.hapnetToolTipLink.visible = true;
    //   /*turn off tooltip node*/
    //   store.runtimeGlobal.pixiApp.hapnetToolTipNode.visible = false;
    //   // console.log(store.runtimeGlobal.mouseStatus.onLink)
    //   // alert("link hover")
    // });
    // this.on('mouseout', (event) => {
    //   store.runtimeGlobal.mouseStatus.onLink = false;
    // });


  }

  draw(drawOptions) {
    if (drawOptions === undefined) {
      drawOptions = {}
    }
    const defaultDrawOptions = {
      heighLight: false
    }
    defaultsDeep(drawOptions, defaultDrawOptions);
    this.clear();

    const lineWidth = this.linkStyles.linkWidth

    // console.log(`distance:${this.linkOptions.distance}, transparency${this.linkOptions.distanceNormalizedValue}`)
    if (drawOptions.heighLight == false) {
      this
        .lineStyle(lineWidth, linkDistanceColorScale(this.linkOptions.distanceNormalizedValue), 1)
        .moveTo(this.linkOptions.source.x, this.linkOptions.source.y)
        .lineTo(this.linkOptions.target.x, this.linkOptions.target.y);
      // console.log(linkDistanceColorScale(this.linkOptions.distanceNormalizedValue))
    } else {
      this
        .lineStyle(lineWidth * 1.5, this.plotOption_style.highlightColor, 1)
        .moveTo(this.linkOptions.source.x, this.linkOptions.source.y)
        .lineTo(this.linkOptions.target.x, this.linkOptions.target.y);
    }

  }
}

export {LINK}