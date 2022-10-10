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

import { SINGLEPIE, LINK } from "./drawElement";
import * as PIXI from 'pixi.js';
// import {store.runtimeGlobal} from './envs'
import {toolTip} from './drawToolTip'
import store from './store'

/**
 * Netowrk
 */
class Network {

    static init() {

        /* setup main pixi application */
        store.runtimeGlobal.pixiApp.app = new PIXI.Application({ 
            width: store.runtimeGlobal.initOption.width, 
            height: store.runtimeGlobal.initOption.height, 
            antialias: true, 
            resolution: store.runtimeGlobal.plotOption.resolution });

        /* setup canvas */
        store.runtimeGlobal.pixiApp.canvas = document
        .getElementById(store.runtimeGlobal.initOption.el)
        .appendChild(store.runtimeGlobal.pixiApp.app.view);

        /* setup network container(layer) */
        store.runtimeGlobal.pixiApp.networkContainer = store.runtimeGlobal.pixiApp.app.stage.addChild(new PIXI.Container())
        store.runtimeGlobal.pixiApp.networkContainer.interactive = true;
        store.runtimeGlobal.pixiApp.networkContainer.buttonMode = true;
        
        /* setup ui contianer(layer)*/
        store.runtimeGlobal.pixiApp.ui = store.runtimeGlobal.pixiApp.app.stage.addChild(new PIXI.Container());
        store.runtimeGlobal.pixiApp.ui.interactive = true;
        store.runtimeGlobal.pixiApp.ui.buttonMode = true;

        store.runtimeGlobal.pixiApp.app.renderer.backgroundColor = store.runtimeGlobal.plotOption.backgroundColor;

        
        /* Add zoom and span function  */
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

            // console.log("zooming")
            // console.log(store.runtimeGlobal)
            // store.runtimeGlobal.appView = store.runtimeGlobal.pixiApp.app.view;
            // store.runtimeGlobal.appStage = store.runtimeGlobal.pixiApp.app.stage;

        };


        // 这里的事件不应该是canvas的事件，而应该是stage的事件。一切都放到pixi.js中去

        store.runtimeGlobal.pixiApp.canvas.onwheel = function (e) {
            zoom(e.deltaY, e.offsetX, e.offsetY);
        }
        var lastPos = null
        store.runtimeGlobal.pixiApp.canvas.onmousedown = (e) => {
            console.log("outclicked")
            store.runtimeGlobal.toolTipObj.visible = false;
            lastPos = { x: e.offsetX, y: e.offsetY };
        }
        store.runtimeGlobal.pixiApp.canvas.onmouseup = (e) => {
            lastPos = null;
        }
        store.runtimeGlobal.pixiApp.canvas.onmousemove = (e) => {
            if (lastPos) {
                // store.runtimeGlobal.toolTipObj.clear();
                store.runtimeGlobal.pixiApp.networkContainer.x += (e.offsetX - lastPos.x); // stage的x和y 根据鼠标的x和y移动相同的像素，这样就实现了stage跟随鼠标移动
                store.runtimeGlobal.pixiApp.networkContainer.y += (e.offsetY - lastPos.y);
                lastPos = { x: e.offsetX, y: e.offsetY }; //然后更新lastPos
            }
        }



        // store.runtimeGlobal.pixiApp.app.view.on('mousedown',(event)=>{
        //     console.log("networkContainer clicked")
        // })
    }

    drawBackGround(){
        /*
        find borders of the plot
        */
        this.options.nodes.forEach(node => {

            if (store.runtimeGlobal.plotBorders.x.max < node.x) store.runtimeGlobal.plotBorders.x.max = node.x;
            if (store.runtimeGlobal.plotBorders.x.min > node.x) store.runtimeGlobal.plotBorders.x.min = node.x;
            if (store.runtimeGlobal.plotBorders.y.max < node.y) store.runtimeGlobal.plotBorders.y.max = node.y;
            if (store.runtimeGlobal.plotBorders.y.min > node.y) store.runtimeGlobal.plotBorders.y.min = node.y;
            
        });

        const scaleNumberX = store.runtimeGlobal.pixiApp.app.view.width/ (store.runtimeGlobal.plotBorders.x.max - store.runtimeGlobal.plotBorders.x.min)
        const scaleNumberY = store.runtimeGlobal.pixiApp.app.view.height/ (store.runtimeGlobal.plotBorders.y.max - store.runtimeGlobal.plotBorders.y.min)
        const scaleNumberFinal =  scaleNumberX > scaleNumberY ? scaleNumberY : scaleNumberX
        
        const initStageApproxWidth = (store.runtimeGlobal.plotBorders.x.max - store.runtimeGlobal.plotBorders.x.min) * scaleNumberFinal
        const initStageApproxHeight = (store.runtimeGlobal.plotBorders.y.max - store.runtimeGlobal.plotBorders.y.min) * scaleNumberFinal
        store.runtimeGlobal.initScale = scaleNumberFinal
        store.runtimeGlobal.initStageWidth = initStageApproxWidth;
        store.runtimeGlobal.initStageHeight =initStageApproxHeight;
        store.runtimeGlobal.currentStageWidth = initStageApproxWidth;
        store.runtimeGlobal.currentStageHeight =initStageApproxHeight;
        /**
         * enable zindex layer.
         */
        store.runtimeGlobal.pixiApp.app.stage.sortableChildren = true
        
        
        store.runtimeGlobal.pixiApp.hapnetToolTop = store.runtimeGlobal.pixiApp.ui.addChild(new toolTip(this.options));
        store.runtimeGlobal.toolTipObj = this.hapnetToolTop;
        store.runtimeGlobal.pixiApp.hapnetToolTop.name = "hapnet_menu"
        store.runtimeGlobal.pixiApp.hapnetToolTop.x = 0;
        store.runtimeGlobal.pixiApp.hapnetToolTop.y = 0;
        store.runtimeGlobal.pixiApp.hapnetToolTop.visible= true;
        // store.runtimeGlobal.pixiApp.app.stage.addChild(hapnetToolTop);

    }


    draw() {


        this.nodeStyle = this.options.style.NodeOutline;
        this.linkStyle = {
            linkWidth: this.options.style.linkWidth,
            linkColor: this.options.style.linkColor,
        }
        this.options.links.forEach(link => {
            // console.log(link)
            const linkID = [link.source.id,link.target.id].sort().join("_");
            if(! store.runtimeGlobal.nodeFirstLevel[link.source.id] ){
                store.runtimeGlobal.nodeFirstLevel[link.source.id] = [];
                store.runtimeGlobal.nodeFirstLevel[link.source.id].push({
                    linkID  : linkID,
                    anotherNodeID: link.target.id
                })
            }else{
                store.runtimeGlobal.nodeFirstLevel[link.source.id].push({
                    linkID  : linkID,
                    anotherNodeID: link.target.id
                })
            }
            if(! store.runtimeGlobal.nodeFirstLevel[link.target.id] ){
                store.runtimeGlobal.nodeFirstLevel[link.target.id] = [];
                store.runtimeGlobal.nodeFirstLevel[link.target.id].push({
                    linkID  : linkID,
                    anotherNodeID: link.source.id
                })
            }else{
                store.runtimeGlobal.nodeFirstLevel[link.target.id].push({
                    linkID  : linkID,
                    anotherNodeID: link.source.id
                })
            }
            const sedge = new LINK(link, this.linkStyle);
            store.runtimeGlobal.pixiApp.networkContainer.addChild(sedge);
            sedge.draw(); //string2hex(string: string) → {number}

        });

        this.options.nodes.forEach(node => {
            const spie = new SINGLEPIE(node, this.nodeStyle);
            store.runtimeGlobal.pixiApp.networkContainer.addChild(spie);
            spie.draw();
        });



        store.runtimeGlobal.pixiApp.networkContainer.scale.x = store.runtimeGlobal.initScale;
        store.runtimeGlobal.pixiApp.networkContainer.scale.y = store.runtimeGlobal.initScale;
        store.runtimeGlobal.pixiApp.networkContainer.x = store.runtimeGlobal.pixiApp.networkContainer.x + (store.runtimeGlobal.pixiApp.app.view.width/2);
        store.runtimeGlobal.pixiApp.networkContainer.y = store.runtimeGlobal.pixiApp.networkContainer.y + (store.runtimeGlobal.pixiApp.app.view.height/2 );



        /**
         * Add event listener function for pointer down event
         * The steps are:
         * if one node is clicked, 
         * 1. set style to normal for objects in highlightedObjList.
         * 2. the related links and level-1 nodes will be highlight.
         * 3. the highlighted links and nodes will be addded to an array in hapnetConf named highlightedObjList.
         */
        store.runtimeGlobal.pixiApp.app.stage.interactive=true;
        store.runtimeGlobal.pixiApp.app.stage.buttonMode = true;
        store.runtimeGlobal.pixiApp.app.stage.on("mousedown",(e)=>{

            // set all highlighted nodes to normal
            store.runtimeGlobal.highlightedObjList.nodes.forEach(d=>{
                const highlightedNode = store.runtimeGlobal.pixiApp.networkContainer.getChildByName(d);
                highlightedNode.draw({heighLight:false});
            });

            // set all highlighted links to normal
            store.runtimeGlobal.highlightedObjList.links.forEach(d=>{
                const highlightedLink = store.runtimeGlobal.pixiApp.networkContainer.getChildByName(d);
                highlightedLink.draw({heighLight:false});
            });            

            /**
             * handle the click event in the pie
             */
            if (e.target instanceof SINGLEPIE){

                /**
                 * highlight node self
                 */
                e.target.draw({heighLight:true}) // Named parameters are not permitted. Probably due to the way to call draw().
                store.runtimeGlobal.highlightedObjList.nodes.push(e.target.name)

                /**
                 * highlight related links and related nodes
                 */
                const relatedNodesAndLinks = store.runtimeGlobal.nodeFirstLevel[e.target.name];
                relatedNodesAndLinks.forEach(d=>{
                    store.runtimeGlobal.pixiApp.networkContainer.getChildByName(d.anotherNodeID).draw({heighLight:true})
                    store.runtimeGlobal.pixiApp.networkContainer.getChildByName(d.linkID).draw({heighLight:true})
                    store.runtimeGlobal.highlightedObjList.nodes.push(d.anotherNodeID)
                    store.runtimeGlobal.highlightedObjList.links.push(d.linkID)
                });

                // console.log(e.target)
            }

            if (e.target.parent instanceof LINK){
                
                /**
                 * highlight link self
                 */
                e.target.parent.draw({heighLight:true});
                store.runtimeGlobal.highlightedObjList.links.push(e.target.parent.name)
                /**
                 * highlight link related source node and target node
                 */
                store.runtimeGlobal.pixiApp.networkContainer.getChildByName(e.target.parent.linkOptions.source.id).draw({heighLight:true})
                store.runtimeGlobal.pixiApp.networkContainer.getChildByName(e.target.parent.linkOptions.target.id).draw({heighLight:true})
            }
        })

        // /**
        //  * Add global event capture to handel tooltip
        //  */
        // store.runtimeGlobal.pixiApp.app.stage.on("mouseover",(e)=>{
        //     if (e.target instanceof SINGLEPIE){

        //         this.hapnetToolTop.setAndShow(e.target.nodeOptions);
        //         console.log()
        //     }
        // });

        // /**
        //  * clear tooltip
        //  */

        // store.runtimeGlobal.pixiApp.app.stage.on("mouseleave",(e)=>{
        //     if (e.target instanceof SINGLEPIE){

        //         this.hapnetToolTop.clear();
        
        //     }
        // });



    }


}


export { Network }