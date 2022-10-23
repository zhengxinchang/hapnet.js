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

import chroma from "chroma-js";

/**
 *
 * @param {Number} sourcex x position of the start point of the line
 * @param {Number} sourcey y position of the start point of the line
 * @param {Number} targetx x position of the end point of the line
 * @param {Number} targety y position of the end point of the line
 * @param {Number} lineWidth line width
 * @returns Array |
 * [
 *       pointAx, pointAy,
 *       pointBx, pointBy,
 *       pointCx, pointCy,
 *       pointDx, pointDy
 *   ]
 */
function calLineHitArea(sourcex, sourcey, targetx, targety, lineWidth) {

  const lineLen = Math.sqrt((sourcex - targetx) * (sourcex - targetx) + (sourcey - targety) * (sourcey - targety));
  const expandLineWdith = lineWidth;
  const sinTheta = Math.abs(sourcey - targety) / lineLen;
  const cosTheta = Math.abs(sourcex - targetx) / lineLen;
  const pointAx = sourcex - expandLineWdith * sinTheta;
  const pointAy = sourcey + expandLineWdith * cosTheta;
  const pointBx = sourcex + expandLineWdith * sinTheta;
  const pointBy = sourcey - expandLineWdith * cosTheta;
  const pointCx = targetx + expandLineWdith * sinTheta;
  const pointCy = targety - expandLineWdith * cosTheta;
  const pointDx = targetx - expandLineWdith * sinTheta;
  const pointDy = targety + expandLineWdith * cosTheta;

  return [
    pointAx, pointAy,
    pointBx, pointBy,
    pointCx, pointCy,
    pointDx, pointDy
  ]

}


/**
 * convert distance value to color
 * @param disNormalValue distance normalized value. range is (0,1)
 * @returns {*}
 */
function linkDistanceColorScale(disNormalValue) {
  const s = chroma.scale(['ff0c1b', 'f4f51f', '1c26f5']);
  return chroma(s(disNormalValue)).num()
}

/**
 * get link id based on the source and target id.
 * @param {object} linkOptions linkOptions
 * @returns {string} link id like Node12_Node23
 */
function getLinkName(linkOptions, sep = "->") {
  // console.log(linkOptions)
  return linkOptions.source.id + " " + sep + " " + linkOptions.target.id
}

export {calLineHitArea, linkDistanceColorScale, getLinkName}