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
import {conformsTo, defaultsDeep, isArray, isBoolean, isNull, isNumber, isObject} from 'lodash-es';
import store from '../../store'


/**
 *  Class Pie chart element
 */
class SINGLEPIE extends PIXI.Container {

  /**
   *
   * @param {Object} nodeOptions one node option
   * @param {Object} nodeStyles node style from store.runtimeGlobal.plotOption
   */
  constructor(nodeOptions, nodeStyles) {
    super();
    /* Validate inputs */
    const isValidate = conformsTo(nodeOptions, {
      id: id => !isNull(id),
      radius: radius => isNumber(radius),
      x: x => !isNull(x),
      y: y => !isNull(y),
      sectors: sectors => isArray(sectors),
      meta: meta => isObject(meta)
    }) && conformsTo(nodeStyles, {
      show: d => isBoolean(d),
      lineWidth: d => isNumber(d),
      lineColor: d => isNumber(d),
    })
    if (isValidate) {
      this.nodeOptions = nodeOptions;
      this.nodeStyles = nodeStyles;
    } else {
      this.nodeOptions = null;
      console.error("can not draw haplotype!")
    }

    this.x = this.nodeOptions.x;
    this.y = this.nodeOptions.y;

    this.name = this.nodeOptions.id; // set unique name for each node.
    if (this.nodeOptions != null) {

      /* init the graphic object and append it to container */
      this.chart = this.addChild(new PIXI.Graphics())
      this.interactive = true; // add event listener in this object, everything works well too.
      this.buttonMode = true;

      /* trigger tooltip when hover */
      this.on('mouseover', (event) => {
        // this.toolTip = store.runtimeGlobal.pixiApp.hapnetToolTip;
        // console.log(this.nodeOptions)
        // console.log(event)
        // console.log(store)
        const globalPost = this.toGlobal({x: 0, y: 0})
        const zoomPosX = globalPost.x;
        const zoomPosY = globalPost.y;
        console.log(this.localTransform)
        console.log(this.position)
        console.log(this.toGlobal(this.position))

        console.log(`zoomPosX${zoomPosX},zoomPosY${zoomPosY}`)
        store.runtimeGlobal.pixiApp.hapnetToolTip.setAndShow(this.nodeOptions, zoomPosX, zoomPosY);
        store.runtimeGlobal.pixiApp.hapnetToolTip.visible = true;
        store.runtimeGlobal.mouseStatus.onNode = true;

        /* show the color legend when hover one node */
        // this.uiNodeColorLegend = store.runtimeGlobal.pixiApp.hapnetNodeColorLegend;
        // this.uiNodeColorLegend.setAndShow(this.nodeOptions);


      });
      this.on('mouseout', (event) => {
        store.runtimeGlobal.mouseStatus.onNode = false;
        // store.runtimeGlobal.pixiApp.hapnetToolTip.visible = false;
      });

    }
    this._calculatePercent();
  }

  _calculatePercent() {

    this.total = 0;
    this.nodeOptions.sectors.forEach((a) => this.total += a.number);
    this.sectorsWithPercent = this.nodeOptions.sectors.map(item => {
      item.percent = item.number / this.total
      return item
    });

  }

  _angle2radian(angle) {
    return (angle - 90) * PIXI.DEG_TO_RAD;
  }

  _drawOneSector(startAngle, percent, color) {

    let endAngle = 360 * percent + startAngle;

    let center = {
      x: 0,
      y: 0
    }

    const radius = this.nodeOptions.radius;

    startAngle = this._angle2radian(startAngle);

    let circleStartPoint = {
      x: center.x + radius * Math.cos(startAngle),
      y: center.y + radius * Math.sin(startAngle),
    }


    this.chart.beginFill(color, 1)
      .lineStyle(this.nodeStyles.lineWidth, this.nodeStyles.lineColor)
      .moveTo(center.x, center.y)
      .lineTo(circleStartPoint.x, circleStartPoint.y)
      .arc(center.x, center.y, radius, startAngle, this._angle2radian(endAngle), false)
      .lineTo(center.x, center.y)
      .endFill();

    return endAngle;
  }


  _drawPie() {

    this.startAngle = 0;
    this.sectorsWithPercent.forEach(sector => {
      this.startAngle = this._drawOneSector(this.startAngle, sector.percent, sector.color);
    })

    // console.log(this.total,this.sectorsWithPercent)

    // if (this.debug == true) {
    //   const thisPosX = this.nodeOptions.x < 0 ? -1 * this.width : this.width;
    //   const thisPosY = this.nodeOptions.y < 0 ? -1 * this.height : this.height;
    //   this.chart.beginFill(0x000000, 0.1)
    //     .lineStyle(4, 0xFFFFFF)
    //     .drawRect(this.x - this.nodeOptions.radius, this.y - this.nodeOptions.radius, thisPosX, thisPosY)
    //     .endFill();
    // }

    return {
      x: this.x,
      y: this.y
    }
  }

  _drawCircle() {


    this.chart.beginFill(this.nodeOptions.sectors[0].color, 1)
      .lineStyle(this.nodeStyles.lineWidth, this.nodeStyles.lineColor)
      .drawCircle(0, 0, this.nodeOptions.radius)
      .endFill();

  }


  _drawHeighLightOneSector(startAngle, percent, color) {

    let endAngle = 360 * percent + startAngle;

    let center = {
      x: 0,
      y: 0
    }

    const radius = this.nodeOptions.radius;

    startAngle = this._angle2radian(startAngle);

    let circleStartPoint = {
      x: center.x + radius * Math.cos(startAngle),
      y: center.y + radius * Math.sin(startAngle),
    }

    const convertedHighLightWidth = radius * 0.05 * Math.log1p(radius) / 10

    this.chart.beginFill(color, 1)
      .lineStyle(convertedHighLightWidth * 0.5, store.runtimeGlobal.plotOption.style.highlightColor)
      .moveTo(center.x, center.y)
      .lineTo(circleStartPoint.x, circleStartPoint.y)
      .arc(center.x, center.y, radius, startAngle, this._angle2radian(endAngle), false)
      .lineTo(center.x, center.y)
      .endFill();
    return endAngle;
  }


  _drawHeightLightPie() {

    this.startAngle = 0;

    this.sectorsWithPercent.forEach(sector => {
      this.startAngle = this._drawHeighLightOneSector(this.startAngle, sector.percent, sector.color);
    })


    // console.log(this.total,this.sectorsWithPercent)

    // if (this.debug == true) {
    //   const thisPosX = this.nodeOptions.x < 0 ? -1 * this.width : this.width;
    //   const thisPosY = this.nodeOptions.y < 0 ? -1 * this.height : this.height;
    //   this.chart.beginFill(0x000000, 0.1)
    //     .lineStyle(8, 0xFFFFFF)
    //     .drawRect(this.x - this.nodeOptions.radius, this.y - this.nodeOptions.radius, thisPosX, thisPosY)
    //     .endFill();
    // }

    return {
      x: this.x,
      y: this.y
    }
  }


  _drawHeighLightCircle() {

    this.chart.beginFill(this.nodeOptions.sectors[0].color, 1)
      .lineStyle(this.nodeOptions.radius * 0.05, store.runtimeGlobal.plotOption.style.highlightColor)
      .drawCircle(0, 0, this.nodeOptions.radius)
      .endFill();
  }

  draw(drawOptions) {

    if (drawOptions === undefined) {
      drawOptions = {}
    }
    this.chart.clear();
    /**
     * TODO:
     * To optimize performance, the defaultDrawOptions should be move to class level.
     */
    const defaultDrawOptions = {
      heighLight: false
    }
    defaultsDeep(drawOptions, defaultDrawOptions);

    // console.log(drawOptions)

    if (this.drawCoarseGraph == true) {
      /**
       * draw coarse graph
       */
    } else {
      /**
       * draw normal graph
       */
      // console.log(this.nodeOptions)

      if (drawOptions.heighLight == false) {
        if (this.nodeOptions.sectors.length == 1) {
          // draw a circle with outline
          // this._drawCircle();
          this._drawCircle();

        } else {
          // draw a pie with outline
          this._drawPie();
        }
      } else {

        this.chart.clear();
        if (this.nodeOptions.sectors.length == 1) {
          // draw a circle with outline
          // this._drawCircle();
          this._drawHeighLightCircle();

        } else {
          // draw a pie with outline
          this._drawHeightLightPie();
        }
      }
    }
  }

}

export {SINGLEPIE}