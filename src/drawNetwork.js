import { SINGLEPIE, LINK } from "./drawElement";
import * as PIXI from 'pixi.js';


class Network {

    constructor(options) {

        this.options = options;
        this.app = new PIXI.Application({ width: this.options.width, height: this.options.height, antialias: true, resolution: this.options.zoom });
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


    // setOption(options){
    //     this.options = options;
    //     this.app = new PIXI.Application({ width: this.options.width, height: this.options.height, antialias: true, resolution: this.options.zoom });
    //     this.app.renderer.backgroundColor = this.options.backgroundColor;
    //     this.hapcanvas = document.getElementById(this.options.el);


    //     this.nodeStyle =  this.options.style.NodeOutline;
    //     this.linkStyle = {
    //         linkWidth:this.options.style.linkWidth,
    //         linkColor:this.options.style.linkColor,
    //     }
    //     console.log(this.linkStyle)
    //     /** 
    //      * Add zoom and span function
    //      */
    //      const  zoom = (s, x, y) => {

    //         s = s < 0 ? 1.1 : 0.9;
    //         // document.getElementById("oldScale").innerHTML = stage.scale.x.toFixed(4);
    //         // document.getElementById("oldXY").innerHTML = '('+stage.x.toFixed(4)+','+stage.y.toFixed(4)+')';

    //         let worldPos = { x: (x - this.app.stage.x) / this.app.stage.scale.x, y: (y - this.app.stage.y) / this.app.stage.scale.y };
    //         let newScale = { x: this.app.stage.scale.x * s, y: this.app.stage.scale.y * s };

    //         let newScreenPos = { x: (worldPos.x) * newScale.x + this.app.stage.x, y: (worldPos.y) * newScale.y + this.app.stage.y };

    //         this.app.stage.x -= (newScreenPos.x - x);
    //         this.app.stage.y -= (newScreenPos.y - y);
    //         this.app.stage.scale.x = newScale.x;
    //         this.app.stage.scale.y = newScale.y;
    //         // console.log(app.stage);
    //         // document.getElementById("scale").innerHTML = newScale.x.toFixed(4);
    //         // document.getElementById("xy").innerHTML = '('+stage.x.toFixed(4)+','+stage.y.toFixed(4)+')';

    //         // document.getElementById("c").innerHTML=c;
    //     };

    //     this.hapcanvas.onwheel = function (e) {
    //         zoom(e.deltaY, e.offsetX, e.offsetY);
    //     }
    //     var lastPos = null
    //     this.hapcanvas.onmousedown = (e) =>{
    //         lastPos = { x: e.offsetX, y: e.offsetY };
    //     }
    //     this.hapcanvas.onmouseup =  (e)=> {
    //         lastPos = null;
    //     }
    //     this.hapcanvas.onmousemove =  (e) =>{
    //         if (lastPos) {
    //             this.app.stage.x += (e.offsetX - lastPos.x); // stage的x和y 根据鼠标的x和y移动相同的像素，这样就实现了stage跟随鼠标移动
    //             this.app.stage.y += (e.offsetY - lastPos.y);
    //             lastPos = { x: e.offsetX, y: e.offsetY }; //然后更新lastPos


    //         }

    //     }
    // }






    draw() {

        this.nodeStyle = this.options.style.NodeOutline;
        this.linkStyle = {
            linkWidth: this.options.style.linkWidth,
            linkColor: this.options.style.linkColor,
        }

        this.options.links.forEach(link => {
            // console.log(this.linkStyle)
            const sedge = new LINK(link, this.linkStyle);
            this.app.stage.addChild(sedge);
            sedge.draw(); //string2hex(string: string) → {number}

        })

        this.options.nodes.forEach(node => {
            // console.log(node.x,node.y)
            // console.log("before input to PIE",node);


            const spie = new SINGLEPIE(node, this.nodeStyle);

            this.app.stage.addChild(spie);
            spie.draw();
        });






    }

}


export { Network }