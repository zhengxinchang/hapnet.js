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

import * as PIXI from 'pixi.js';
import {LINK, SINGLEPIE} from "./views/networkElements/Element";
import {UIToolTipNode} from './views/ui/UIToolTipNode';
import {UIToolTipLink} from "./views/ui/UIToolTipLink";
import {UINodeColorLegend} from "./views/ui/UINodeColorLegend";
import {UINodeColorLegendUnit} from './views/ui/UINodeColorLegendUnit';
import {UINodePanel} from './views/ui/UINodePanel';
import {UINodePanelUnit} from "./views/ui/UINodePanelUnit";
import {NodePanelUnitSub} from "./views/ui/UINodePanelUnitSub";
import store from './store';

/**
 * class to draw Netowrk
 */
class Network {
  /**
   * @static
   */
  static create() {
    /* setup main pixi application */
    store.runtimeGlobal.pixiApp.app = new PIXI.Application({
      width: store.runtimeGlobal.initOption.width,
      height: store.runtimeGlobal.initOption.height,
      antialias: true,
      resolution: store.runtimeGlobal.plotOption.resolution
    });
    /* setup canvas */
    store.runtimeGlobal.pixiApp.canvas = document
      .getElementById(store.runtimeGlobal.initOption.el)
      .appendChild(store.runtimeGlobal.pixiApp.app.view);
    /* setup networkElements container(layer) */
    store.runtimeGlobal.pixiApp.networkContainer = store.runtimeGlobal.pixiApp.app.stage.addChild(new PIXI.Container())
    store.runtimeGlobal.pixiApp.networkContainer.interactive = true;
    store.runtimeGlobal.pixiApp.networkContainer.buttonMode = true;
    /* setup mouse status for the networkContainer */
    store.runtimeGlobal.pixiApp.networkContainer.on("mouseover", event => {
      store.runtimeGlobal.mouseStatus.onNetworkContainer = true;
      // console.log(`store.runtimeGlobal.mouseStatus.networkContainer ${store.runtimeGlobal.mouseStatus.onNetworkContainer}`)
    });
    store.runtimeGlobal.pixiApp.networkContainer.on("mouseout", event => {
      store.runtimeGlobal.mouseStatus.onNetworkContainer = false;
      // console.log(`store.runtimeGlobal.mouseStatus.networkContainer ${store.runtimeGlobal.mouseStatus.onNetworkContainer}`)
    });
    /* setup ui contianer(layer)*/
    store.runtimeGlobal.pixiApp.ui = store.runtimeGlobal.pixiApp.app.stage.addChild(new PIXI.Container());
    store.runtimeGlobal.pixiApp.ui.interactive = true;
    store.runtimeGlobal.pixiApp.ui.buttonMode = true;
    /* setup mouse status for the ui */
    store.runtimeGlobal.pixiApp.ui.on("mouseover", event => {
      // alert("aa")
      store.runtimeGlobal.mouseStatus.onUI = true;
      // console.log(`store.runtimeGlobal.mouseStatus.onUI ${store.runtimeGlobal.mouseStatus.onUI}`)
    });
    store.runtimeGlobal.pixiApp.ui.on("mouseout", event => {
      store.runtimeGlobal.mouseStatus.onUI = false;
      // console.log(`store.runtimeGlobal.mouseStatus.onUI ${store.runtimeGlobal.mouseStatus.onUI}`)
    });
    /* setup background color */
    store.runtimeGlobal.pixiApp.app.renderer.backgroundColor = store.runtimeGlobal.plotOption.backgroundColor;
    /* define zoom function  */
    const zoom = (s, x, y) => {
      s = s < 0 ? 1.1 : 0.9;
      let worldPos = {
        x: (x - store.runtimeGlobal.pixiApp.networkContainer.x) / store.runtimeGlobal.pixiApp.networkContainer.scale.x,
        y: (y - store.runtimeGlobal.pixiApp.networkContainer.y) / store.runtimeGlobal.pixiApp.networkContainer.scale.y
      };
      let newScale = {
        x: store.runtimeGlobal.pixiApp.networkContainer.scale.x * s,
        y: store.runtimeGlobal.pixiApp.networkContainer.scale.y * s
      };
      let newScreenPos = {
        x: (worldPos.x) * newScale.x + store.runtimeGlobal.pixiApp.networkContainer.x,
        y: (worldPos.y) * newScale.y + store.runtimeGlobal.pixiApp.networkContainer.y
      };
      store.runtimeGlobal.pixiApp.networkContainer.x -= (newScreenPos.x - x);
      store.runtimeGlobal.pixiApp.networkContainer.y -= (newScreenPos.y - y);
      store.runtimeGlobal.pixiApp.networkContainer.scale.x = newScale.x;
      store.runtimeGlobal.pixiApp.networkContainer.scale.y = newScale.y;
      store.runtimeGlobal.currentZoomScale = newScale;
      store.runtimeGlobal.currentStageWidth = store.runtimeGlobal.pixiApp.networkContainer.width;
      store.runtimeGlobal.currentStageHeight = store.runtimeGlobal.pixiApp.networkContainer.height;
    };
    /* handle wheel event */
    store.runtimeGlobal.pixiApp.canvas.onwheel = function (e) {

      // console.log(store.runtimeGlobal.mouseStatus)
      e.preventDefault();
      if (store.runtimeGlobal.mouseStatus.onUI === false) {
        store.runtimeGlobal.pixiApp.hapnetToolTipNode.visible = false;
        store.runtimeGlobal.pixiApp.hapnetToolTipLink.visible = false;
        zoom(e.deltaY, e.offsetX, e.offsetY);
      } else if (store.runtimeGlobal.mouseStatus.onUI === true) {
        /*
        handle wheel event that fired from the UI layer
        code is inspired by this repo: https://github.com/Mwni/pixi-mousewheel
        */
        const hit = store.runtimeGlobal.pixiApp.app.renderer.plugins.interaction.hitTest({x: e.offsetX, y: e.offsetY})
        // console.log(hit)

        // console.log("mouse on ui detected...")
        // if (hit instanceof UIToolTipNode) {
        //   console.log("mouse on UIToolTipNode detected...")
        //   const deltaFixed = e.deltaY < 0 ? 1 : -1; // s = s < 0 ? 1.1 : 0.9;
        //   hit.scroll(deltaFixed);
        // } else
        /* hitTest 检测不到toolTip的对象，而是可以检测到下层的PIE或者LINK，这是有问题的，还好可以在toolTip对象内部检测到是否有mouseover的状态*/
        if (store.runtimeGlobal.mouseStatus.onToolTipNode == true) {
          const deltaFixed = e.deltaY < 0 ? 1 : -1; // s = s < 0 ? 1.1 : 0.9;
          store.runtimeGlobal.pixiApp.hapnetToolTipNode.scroll(deltaFixed);
        }
        if (store.runtimeGlobal.mouseStatus.onToolTipLink == true) {
          const deltaFixed = e.deltaY < 0 ? 1 : -1;
          store.runtimeGlobal.pixiApp.hapnetToolTipLink.scroll(deltaFixed);
        }

        if (hit instanceof UINodeColorLegend || hit instanceof UINodeColorLegendUnit) {
          const deltaFixed = e.deltaY < 0 ? 1 : -1;
          store.runtimeGlobal.pixiApp.hapnetNodeColorLegend.scroll(deltaFixed);
        } else if (hit instanceof UINodePanel || hit instanceof UINodePanelUnit || hit instanceof NodePanelUnitSub) {
          const deltaFixed = e.deltaY < 0 ? 1 : -1;
          store.runtimeGlobal.pixiApp.hapnetNodeMetadatPanel.scroll(deltaFixed);
        }
      }
    }
    /* handle mousedown event */
    var lastPos = null;
    store.runtimeGlobal.pixiApp.canvas.onmousedown = (e) => {
      e.preventDefault();
      if (store.runtimeGlobal.mouseStatus.onUI === false) {
        store.runtimeGlobal.pixiApp.hapnetToolTipNode.visible = false;
        store.runtimeGlobal.pixiApp.hapnetToolTipLink.visible = false;

        lastPos = {x: e.offsetX, y: e.offsetY};
      }
    }
    /* handle mouseup event */
    store.runtimeGlobal.pixiApp.canvas.onmouseup = (e) => {
      lastPos = null;
    }
    /* handle mousemove event*/
    store.runtimeGlobal.pixiApp.canvas.onmousemove = (e) => {
      if (lastPos) {
        store.runtimeGlobal.pixiApp.networkContainer.x += (e.offsetX - lastPos.x); // stage的x和y 根据鼠标的x和y移动相同的像素，这样就实现了stage跟随鼠标移动
        store.runtimeGlobal.pixiApp.networkContainer.y += (e.offsetY - lastPos.y);
        lastPos = {x: e.offsetX, y: e.offsetY}; //然后更新lastPos
      }
      // store.runtimeGlobal.pixiApp.hapnetToolTip.visible = false;
    }

    // store.runtimeGlobal.pixiApp.canvas.onmouseover = (e) => {
    //
    //   const hit = store.runtimeGlobal.pixiApp.app.renderer.plugins.interaction.hitTest({x: e.offsetX, y: e.offsetY})
    //   console.log(hit)
    //   if (hit instanceof SINGLEPIE) {
    //     alert("moseouver")
    //     console.log("mouse over single pie")
    //   }
    //
    //
    // }
  }

  /**
   * @static
   */
  static init() {
    store.runtimeGlobal.plotOption.nodes.forEach(node => {
      // console.log(store.runtimeGlobal.plotBorders.x.max)
      // console.log(node)
      if (store.runtimeGlobal.plotBorders.x.max < node.x) store.runtimeGlobal.plotBorders.x.max = node.x;
      if (store.runtimeGlobal.plotBorders.x.min > node.x) store.runtimeGlobal.plotBorders.x.min = node.x;
      if (store.runtimeGlobal.plotBorders.y.max < node.y) store.runtimeGlobal.plotBorders.y.max = node.y;
      if (store.runtimeGlobal.plotBorders.y.min > node.y) store.runtimeGlobal.plotBorders.y.min = node.y;
    });
    const scaleNumberX = store.runtimeGlobal.pixiApp.canvas.width / (store.runtimeGlobal.plotBorders.x.max - store.runtimeGlobal.plotBorders.x.min)
    const scaleNumberY = store.runtimeGlobal.pixiApp.canvas.height / (store.runtimeGlobal.plotBorders.y.max - store.runtimeGlobal.plotBorders.y.min)
    const scaleNumberFinal = scaleNumberX > scaleNumberY ? scaleNumberY : scaleNumberX
    const initStageApproxWidth = (store.runtimeGlobal.plotBorders.x.max - store.runtimeGlobal.plotBorders.x.min) * scaleNumberFinal
    const initStageApproxHeight = (store.runtimeGlobal.plotBorders.y.max - store.runtimeGlobal.plotBorders.y.min) * scaleNumberFinal
    store.runtimeGlobal.initScale = scaleNumberFinal
    store.runtimeGlobal.initStageWidth = initStageApproxWidth;
    store.runtimeGlobal.initStageHeight = initStageApproxHeight;
    store.runtimeGlobal.currentStageWidth = initStageApproxWidth;
    store.runtimeGlobal.currentStageHeight = initStageApproxHeight;
    /*
     * enable zindex layer.
     */
    store.runtimeGlobal.pixiApp.app.stage.sortableChildren = true
    store.runtimeGlobal.pixiApp.hapnetToolTipNode = store.runtimeGlobal.pixiApp.ui.addChild(new UIToolTipNode());
    store.runtimeGlobal.pixiApp.hapnetToolTipLink = store.runtimeGlobal.pixiApp.ui.addChild(new UIToolTipLink());
    store.runtimeGlobal.pixiApp.hapnetNodeColorLegend = store.runtimeGlobal.pixiApp.ui.addChild(new UINodeColorLegend());
    store.runtimeGlobal.pixiApp.hapnetNodeMetadatPanel = store.runtimeGlobal.pixiApp.ui.addChild(new UINodePanel());
    // console.log(store)
  }
  static draw() {
    const nodeStyle = store.runtimeGlobal.plotOption.style.NodeOutline;
    const lineStyle = {
      linkWidth: store.runtimeGlobal.plotOption.style.linkWidth,
      linkColor: store.runtimeGlobal.plotOption.style.linkColor,
    }
    store.runtimeGlobal.plotOption.links.forEach(link => {
      const linkID = [link.source.id, link.target.id].sort().join("_");
      if (!store.runtimeGlobal.nodeFirstLevel[link.source.id]) {
        store.runtimeGlobal.nodeFirstLevel[link.source.id] = [];
        store.runtimeGlobal.nodeFirstLevel[link.source.id].push({
          linkID: linkID,
          anotherNodeID: link.target.id
        })
      } else {
        store.runtimeGlobal.nodeFirstLevel[link.source.id].push({
          linkID: linkID,
          anotherNodeID: link.target.id
        })
      }
      if (!store.runtimeGlobal.nodeFirstLevel[link.target.id]) {
        store.runtimeGlobal.nodeFirstLevel[link.target.id] = [];
        store.runtimeGlobal.nodeFirstLevel[link.target.id].push({
          linkID: linkID,
          anotherNodeID: link.source.id
        })
      } else {
        store.runtimeGlobal.nodeFirstLevel[link.target.id].push({
          linkID: linkID,
          anotherNodeID: link.source.id
        })
      }
      const sedge = new LINK(link, lineStyle);
      store.runtimeGlobal.pixiApp.networkContainer.addChild(sedge);
      sedge.draw(); //string2hex(string: string) → {number}
    });
    store.runtimeGlobal.plotOption.nodes.forEach(node => {
      const spie = new SINGLEPIE(node, nodeStyle);
      store.runtimeGlobal.pixiApp.networkContainer.addChild(spie);
      spie.draw();
    });
    store.runtimeGlobal.pixiApp.networkContainer.scale.x = store.runtimeGlobal.initScale;
    store.runtimeGlobal.pixiApp.networkContainer.scale.y = store.runtimeGlobal.initScale;
    store.runtimeGlobal.pixiApp.networkContainer.x = store.runtimeGlobal.pixiApp.networkContainer.x + (store.runtimeGlobal.pixiApp.app.view.width / 2);
    store.runtimeGlobal.pixiApp.networkContainer.y = store.runtimeGlobal.pixiApp.networkContainer.y + (store.runtimeGlobal.pixiApp.app.view.height / 2);
    /*
    Add event listener function for pointer down event
    The steps are:
    if one node is clicked,
    1. set style to normal for objects in highlightedObjList.
    2. the related links and level-1 nodes will be highlight.
    3. the highlighted links and nodes will be addded to an array in hapnetConf named highlightedObjList.
     */
    store.runtimeGlobal.pixiApp.app.stage.interactive = true;
    store.runtimeGlobal.pixiApp.app.stage.buttonMode = true;
    store.runtimeGlobal.pixiApp.app.stage.on("mousedown", (e) => {
      // set all highlighted nodes to normal
      store.runtimeGlobal.highlightedObjList.nodes.forEach(d => {
        const highlightedNode = store.runtimeGlobal.pixiApp.networkContainer.getChildByName(d);
        highlightedNode.draw({heighLight: false});
      });

      // set all highlighted links to normal


      store.runtimeGlobal.highlightedObjList.links.forEach(d => {
        const highlightedLink = store.runtimeGlobal.pixiApp.networkContainer.getChildByName(d);
        highlightedLink.draw({heighLight: false});
      });
      /*
       * handle the click event in the pie
       */
      if (e.target instanceof SINGLEPIE) {
        /* highlight node self */
        e.target.draw({heighLight: true}) // Named parameters are not permitted. Probably due to the way to call draw().
        store.runtimeGlobal.highlightedObjList.nodes.push(e.target.name)
        /* highlight related links and related nodes */
        const relatedNodesAndLinks = store.runtimeGlobal.nodeFirstLevel[e.target.name];
        relatedNodesAndLinks.forEach(d => {
          store.runtimeGlobal.pixiApp.networkContainer.getChildByName(d.anotherNodeID).draw({heighLight: true})
          store.runtimeGlobal.pixiApp.networkContainer.getChildByName(d.linkID).draw({heighLight: true})
          store.runtimeGlobal.highlightedObjList.nodes.push(d.anotherNodeID)
          store.runtimeGlobal.highlightedObjList.links.push(d.linkID)
        });
        /* trigger node color legend */
        this.uiNodeColorLegend = store.runtimeGlobal.pixiApp.hapnetNodeColorLegend;
        this.uiNodeColorLegend.setAndShow(e.target.nodeOptions);
        /* trigger node metadata panel */
        this.hapnetNodeMetadatPanel = store.runtimeGlobal.pixiApp.hapnetNodeMetadatPanel;
        this.hapnetNodeMetadatPanel.setAndShow(e.target.nodeOptions);
      }
      if (e.target instanceof LINK) {

        console.log(e.target)

        /*
         * highlight link self
         */
        e.target.draw({heighLight: true});
        store.runtimeGlobal.highlightedObjList.links.push(e.target.name)
        /*
         * highlight link related source node and target node
         */
        store.runtimeGlobal.pixiApp.networkContainer.getChildByName(e.target.linkOptions.source.id).draw({heighLight: true})
        store.runtimeGlobal.pixiApp.networkContainer.getChildByName(e.target.linkOptions.target.id).draw({heighLight: true})
      }
    })
  }
}
export {Network}