import { SINGLEPIE, LINK } from "./drawElement";
import * as PIXI from 'pixi.js';
// import "@pixi/events"
// import { EventSystem } from "@pixi/events";
import {hapnetConfig} from './envs'
import {toolTip} from './drawToolTip'

class Network {

    constructor(options) {
        this.options = options;
        this.app = new PIXI.Application({ 
            width: this.options.width, 
            height: this.options.height, 
            antialias: true, 
            resolution: this.options.zoom });
        this.app.renderer.backgroundColor = this.options.backgroundColor;
        this.hapcanvas = document.getElementById(this.options.el);
        this.hapcanvas.appendChild(this.app.view);
        

        /** 
         * Add zoom and span function
         */
        const zoom = (s, x, y) => {

            s = s < 0 ? 1.1 : 0.9;
            let worldPos = { x: (x - this.app.stage.x) / this.app.stage.scale.x, y: (y - this.app.stage.y) / this.app.stage.scale.y };
            let newScale = { x: this.app.stage.scale.x * s, y: this.app.stage.scale.y * s };

            let newScreenPos = { x: (worldPos.x) * newScale.x + this.app.stage.x, y: (worldPos.y) * newScale.y + this.app.stage.y };

            this.app.stage.x -= (newScreenPos.x - x);
            this.app.stage.y -= (newScreenPos.y - y);
            this.app.stage.scale.x = newScale.x;
            this.app.stage.scale.y = newScale.y;
            hapnetConfig.currentZoomScale = newScale;
            hapnetConfig.currentStageWidth = this.app.stage.width;
            hapnetConfig.currentStageHeight = this.app.stage.height;
            // console.log("zooming")
            // console.log(hapnetConfig)
            // hapnetConfig.appView = this.app.view;
            // hapnetConfig.appStage = this.app.stage;

        };

        this.hapcanvas.onwheel = function (e) {
            zoom(e.deltaY, e.offsetX, e.offsetY);
        }
        var lastPos = null
        this.hapcanvas.onmousedown = (e) => {
            lastPos = { x: e.offsetX, y: e.offsetY };
        }
        this.hapcanvas.onmouseup = (e) => {
            lastPos = null;
        }
        this.hapcanvas.onmousemove = (e) => {
            if (lastPos) {
                this.app.stage.x += (e.offsetX - lastPos.x); // stage的x和y 根据鼠标的x和y移动相同的像素，这样就实现了stage跟随鼠标移动
                this.app.stage.y += (e.offsetY - lastPos.y);
                lastPos = { x: e.offsetX, y: e.offsetY }; //然后更新lastPos
            }

        }
    }

    init(){
        this.options.nodes.forEach(node => {

            if (hapnetConfig.plotBorders.x.max < node.x) hapnetConfig.plotBorders.x.max = node.x;
            if (hapnetConfig.plotBorders.x.min > node.x) hapnetConfig.plotBorders.x.min = node.x;
            if (hapnetConfig.plotBorders.y.max < node.y) hapnetConfig.plotBorders.y.max = node.y;
            if (hapnetConfig.plotBorders.y.min > node.y) hapnetConfig.plotBorders.y.min = node.y;
            
        });

        const scaleNumberX = this.app.view.width/ (hapnetConfig.plotBorders.x.max - hapnetConfig.plotBorders.x.min)
        const scaleNumberY = this.app.view.height/ (hapnetConfig.plotBorders.y.max - hapnetConfig.plotBorders.y.min)
        const scaleNumberFinal =  scaleNumberX > scaleNumberY ? scaleNumberY : scaleNumberX
        
        const initStageApproxWidth = (hapnetConfig.plotBorders.x.max - hapnetConfig.plotBorders.x.min) * scaleNumberFinal
        const initStageApproxHeight = (hapnetConfig.plotBorders.y.max - hapnetConfig.plotBorders.y.min) * scaleNumberFinal
        hapnetConfig.initScale = scaleNumberFinal
        hapnetConfig.initStageWidth = initStageApproxWidth;
        hapnetConfig.initStageHeight =initStageApproxHeight;
        hapnetConfig.currentStageWidth = initStageApproxWidth;
        hapnetConfig.currentStageHeight =initStageApproxHeight;
        /**
         * enable zindex layer.
         */
        this.app.stage.sortableChildren = true
        const hapnetToolTop = new toolTip(this.options);
        this.app.stage.addChild(hapnetToolTop);

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
            if(! hapnetConfig.nodeFirstLevel[link.source.id] ){
                hapnetConfig.nodeFirstLevel[link.source.id] = [];
                hapnetConfig.nodeFirstLevel[link.source.id].push({
                    linkID  : linkID,
                    anotherNodeID: link.target.id
                })
            }else{
                hapnetConfig.nodeFirstLevel[link.source.id].push({
                    linkID  : linkID,
                    anotherNodeID: link.target.id
                })
            }
            if(! hapnetConfig.nodeFirstLevel[link.target.id] ){
                hapnetConfig.nodeFirstLevel[link.target.id] = [];
                hapnetConfig.nodeFirstLevel[link.target.id].push({
                    linkID  : linkID,
                    anotherNodeID: link.source.id
                })
            }else{
                hapnetConfig.nodeFirstLevel[link.target.id].push({
                    linkID  : linkID,
                    anotherNodeID: link.source.id
                })
            }
            const sedge = new LINK(link, this.linkStyle);
            this.app.stage.addChild(sedge);
            sedge.draw(); //string2hex(string: string) → {number}

        });

        this.options.nodes.forEach(node => {
            const spie = new SINGLEPIE(node, this.nodeStyle);
            this.app.stage.addChild(spie);
            spie.draw();
        });



        this.app.stage.scale.x = hapnetConfig.initScale;
        this.app.stage.scale.y = hapnetConfig.initScale;
        this.app.stage.x = this.app.stage.x + (this.app.view.width/2);
        this.app.stage.y = this.app.stage.y + (this.app.view.height/2 );



        /**
         * Add event listener function for pointer down event
         * The steps are:
         * if one node is clicked, 
         * 1. set style to normal for objects in highlightedObjList.
         * 2. the related links and level-1 nodes will be highlight.
         * 3. the highlighted links and nodes will be addded to an array in hapnetConf named highlightedObjList.
         */
        this.app.stage.interactive=true;
        this.app.stage.buttonMode = true;
        this.app.stage.on("mousedown",(e)=>{

            // set all highlighted nodes to normal
            hapnetConfig.highlightedObjList.nodes.forEach(d=>{
                const highlightedNode = this.app.stage.getChildByName(d);
                highlightedNode.draw({heighLight:false});
            });

            // set all highlighted links to normal
            hapnetConfig.highlightedObjList.links.forEach(d=>{
                const highlightedLink = this.app.stage.getChildByName(d);
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
                hapnetConfig.highlightedObjList.nodes.push(e.target.name)

                /**
                 * highlight related links and related nodes
                 */
                const relatedNodesAndLinks = hapnetConfig.nodeFirstLevel[e.target.name];
                relatedNodesAndLinks.forEach(d=>{
                    this.app.stage.getChildByName(d.anotherNodeID).draw({heighLight:true})
                    this.app.stage.getChildByName(d.linkID).draw({heighLight:true})
                    hapnetConfig.highlightedObjList.nodes.push(d.anotherNodeID)
                    hapnetConfig.highlightedObjList.links.push(d.linkID)
                });

                // console.log(e.target)
            }

            if (e.target.parent instanceof LINK){
                
                /**
                 * highlight link self
                 */
                e.target.parent.draw({heighLight:true});
                hapnetConfig.highlightedObjList.links.push(e.target.parent.name)
                /**
                 * highlight link related source node and target node
                 */
                this.app.stage.getChildByName(e.target.parent.linkOptions.source.id).draw({heighLight:true})
                this.app.stage.getChildByName(e.target.parent.linkOptions.target.id).draw({heighLight:true})
            }
            // console.log("app stage is clicked")
            // console.log(hapnetConfig.highlightedObjList)
            // console.log(hapnetConfig.nodeFirstLevel)
            // console.log(this.app)
        })





    }


}


export { Network }