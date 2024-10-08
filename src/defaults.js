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
 * Build in palettes
 * Currently, there are **6** palettes which are derived from the [ggsci](https://cran.r-project.org/web/packages/ggsci/vignettes/ggsci.html) package.
 */
const predefinedPalettesList = {
  npg: [
    "#E64B35FF", "#4DBBD5FF", "#00A087FF", "#3C5488FF", "#F39B7FFF", "#8491B4FF", "#91D1C2FF", "#DC0000FF", "#7E6148FF", "#B09C85FF"
  ],
  jco: [
    "#0073C2FF", "#EFC000FF", "#868686FF", "#CD534CFF", "#7AA6DCFF", "#003C67FF", "#8F7700FF", "#3B3B3BFF", "#A73030FF", "#4A6990FF"
  ],
  aaas: [
    "#3B4992FF", "#EE0000FF", "#008B45FF", "#631879FF", "#008280FF", "#BB0021FF", "#5F559BFF", "#A20056FF", "#808180FF", "#1B1919FF"
  ],
  nejm: [
    "#BC3C29FF", "#0072B5FF", "#E18727FF", "#20854EFF", "#7876B1FF", "#6F99ADFF", "#FFDC91FF", "#EE4C97FF"
  ],
  lancet: [
    "#00468BFF", "#ED0000FF", "#42B540FF", "#0099B4FF", "#925E9FFF", "#FDAF91FF", "#AD002AFF", "#ADB6B6FF", "#19FF12"
  ],
  jama: [
    "#374E55FF", "#DF8F44FF", "#00A1D5FF", "#B24745FF", "#79AF97FF", "#6A6599FF", "#80796BFF"
  ],

}

/**
 *  Default init options. default value of width and height is 'auto', if set, hapnet_deprecaed.js will use the width and height of dom element.
 */
const defaultInitOption = {
  el: null,
  width: document.documentElement.clientWidth ,
  height: document.documentElement.clientHeight,


}

/**
 * Default plot options
 */
const defaultPlotOption = {
  debug: false,
  nodes: [],
  links: [],
  asyncMetaFunctions: { // can be used as formatter or can be used load data async
    nodes: {
      hover: {},
      panel: {},
    },
    links: {
      hover: {},
      panel: {},
    }
  },
  radiusMax: 3500,
  radiusMin: 250,
  distanceNormalizedMin: 0.1,
  distanceNormalizedMax: 0.9,
  backgroundColor: '#e4e5ec',
  palette: "jco",
  paletteArray: null,
  nodeColorLegend: {
    fontSize: 20,
    fontColor: '#FFFFFF',
    backgroundColor: "#e3ecea",
    borderColor: "#616161",
    borderWidth: 10,
    width: window.innerWidth * 0.2,
    height: window.innerHeight * 0.4,
    formatter: null,
  },
  nodeMetaPanel: {
    fontSize: 20,
    fontColor: '#FFFFFF',
    backgroundColor: "#e3ecea",
    borderColor: "#616161",
    borderWidth: 10,
    width: window.innerWidth * 0.2,
    height: window.innerHeight * 0.4,
    formatter: null,
  },
  linkMetaPanel: {
    fontSize: 20,
    fontColor: '#FFFFFF',
    backgroundColor: "#e3ecea",
    borderColor: "#616161",
    borderWidth: 10,
    width: window.innerWidth * 0.2,
    height: window.innerHeight * 0.4,
    formatter: null,
  },
  resolution: devicePixelRatio || 1,
  coarseGraph: {
    tickIteration: 1000,
    collideIteration: 2,
    hubNumOFLinksThreshold: 20, // 定义hub Node的最小边的数量
    maxExpandSteps: 50, // 最大的迭代步数
    hubNodePadding: 100,
    chargeStrength: 10000,
    forceLinkDistance: 5,
    forceLinkStrength: 2,
  },
  fullGraph: {
    tickIteration: 150,
    collideIteration: 2,
    forceLinkDistance: 1,
    forceLinkStrength: 1,
    eachNodePadding: 100,
    chargeStrength: 800000,
    chargeTheta: 0.99,
  },
  style: {
    linkWidth: 60,
    linkColor: "#312e2e", //white
    NodeOutline: {
      show: true,
      lineWidth: 1,
      lineColor: "#FFFFFF"
    },
    highlightColor: "#f30606"
  },
  uiStyle:{

      topBarBackgroundColor:'#3e999f',
      leftPanelBackgroundColor: '#6f619f', //"#3e999f"d
      rightPanelBackgroundColor: '#6f619f' //"#3e999f"d

  }
}


export {
  defaultInitOption,
  defaultPlotOption,
  predefinedPalettesList,
}