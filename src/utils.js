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
  const halfLineWdith = lineWidth / 2;
    const sinTheta = Math.abs(sourcey - targety) / lineLen;
    const cosTheta = Math.abs(sourcex - targetx) / lineLen;
    const pointAx = sourcex - halfLineWdith * sinTheta;
    const pointAy = sourcey + halfLineWdith * cosTheta;
    const pointBx = sourcex + halfLineWdith * sinTheta;
    const pointBy = sourcey - halfLineWdith * cosTheta;
    const pointCx = targetx + halfLineWdith * sinTheta;
    const pointCy = targety - halfLineWdith * cosTheta;
    const pointDx = targetx - halfLineWdith * sinTheta;
    const pointDy = targety + halfLineWdith * cosTheta;

    return [
        pointAx, pointAy,
        pointBx, pointBy,
        pointCx, pointCy,
        pointDx, pointDy
    ]

}






// console.log(calLineHitArea(2,2,1,1,0.5))

export { calLineHitArea }