
/**
 * 
 * @param {x position of the start point of the line} sourcex 
 * @param {y position of the start point of the line} sourcey 
 * @param {x position of the end point of the line} targetx 
 * @param {y position of the end point of the line} targety 
 * @param {line width} lineWidth 
 * @returns Array | 
 *  [
 *       pointAx, pointAy, 
 *       pointBx, pointBy, 
 *       pointCx, pointCy, 
 *       pointDx, pointDy
 *   ]
 */
function calLineHitArea(sourcex, sourcey, targetx, targety, lineWidth) {

    const lineLen = Math.sqrt((sourcex - targetx) * (sourcex - targetx), (sourcey - targety) * (sourcey - targety));
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