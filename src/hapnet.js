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


import {cloneDeep, defaultsDeep, isNumber} from "lodash-es";
import {defaultInitOption, defaultPlotOption, predefinedPalettesList} from "./defaults";
import chroma from "chroma-js";
import * as PIXI from 'pixi.js'
import {LINK} from "./views/networkElements/Link";
import {SINGLEPIE} from "./views/networkElements/Node";
import {calculateCoarseGraph, calculateFullGraph} from "./layout";
import domui from './views/dom-ui/domUI'

/**
 * Main class of hapnet_deprecaed.js
 */
class HapNet {

    /**
     * create hapnet_deprecaed.js
     * validate init options
     * add initOption to instance
     * @param initOption
     * @returns {HapNet}
     */
    static init(initOption) {
        HapNet.validateInitOption(initOption);
        let hapnet = new HapNet();
        // assign default settings
        hapnet.initOption = defaultsDeep(initOption, defaultInitOption);
        ;
        return hapnet
    }

    /**
     *
     * @param initOption validate initOption
     */
    static validateInitOption(initOption) {
        if (!initOption instanceof Object) {
            throw TypeError("initOption MUST be an Object.");
        }
        if (!'el' in initOption) {
            throw Error("attr 'el' is required.");
        }
        try {
            document.getElementById(initOption.el)
        } catch (error) {
            throw Error(`can not get element ${initOption.el}`)
        }
        if (!initOption.hasOwnProperty("width")) {
            // initOption.width = window.innerWidth;
        } else {
            if (!isNumber(initOption.width)) {
                throw Error(`attr width is invalid ${initOption.width}`)
            }
        }
        if (!initOption.hasOwnProperty("height")) {
            // initOption.height = window.innerHeight;
        } else {
            if (!isNumber(initOption.height)) {
                throw Error(`attr height is invalid ${initOption.height}`);
            }
        }
    }

    /**
     * Main plot function of hapnet_deprecaed.js
     * @param plotOption
     */
    setOption(plotOption) {
        this.plotOption = defaultsDeep(plotOption, defaultPlotOption);
        this._validatePlotOption();
        this._translateColor();
        this._normalizeRadiusAndGetNodeColors();
        this._normalizeDistance();
        this._calculatePalette();
        this._createNetworkAndDomUI();
        this._calculateLayout();
        this._calculatePlotBorderAndSetInitScale();
        this._drawNetwork();
        this._addEventZoom();
        this._addEventClick();
    }

    /**
     * validate plot options
     * @private
     */
    _validatePlotOption() {
        if (!predefinedPalettesList[this.plotOption.palette]) {
            throw Error(`Palette is not valid, please select one from: ${Object.keys(predefinedPalettesList)}`);
        }
    }


    /**
     * Translate color values to hex format
     * @private
     */
    _translateColor() {
        this.plotOption.backgroundColor = chroma(this.plotOption.backgroundColor).num();
        this.plotOption.style.linkColor = chroma(this.plotOption.style.linkColor).num();
        this.plotOption.style.NodeOutline.lineColor = chroma(this.plotOption.style.NodeOutline.lineColor).num();
        this.plotOption.nodeColorLegend.backgroundColor = chroma(this.plotOption.nodeColorLegend.backgroundColor).num();
        this.plotOption.nodeColorLegend.borderColor = chroma(this.plotOption.nodeColorLegend.borderColor).num();
        this.plotOption.nodeMetaPanel.backgroundColor = chroma(this.plotOption.nodeMetaPanel.backgroundColor).num();
        this.plotOption.nodeMetaPanel.borderColor = chroma(this.plotOption.nodeMetaPanel.borderColor).num();
        this.plotOption.linkMetaPanel.backgroundColor = chroma(this.plotOption.linkMetaPanel.backgroundColor).num();
        this.plotOption.linkMetaPanel.borderColor = chroma(this.plotOption.linkMetaPanel.borderColor).num();
        this.plotOption.style.highlightColor = chroma(this.plotOption.style.highlightColor).num();
    }

    /**
     * calculate max and min radius and normalize them.
     * the number of distinct category are also calculated in this function.
     * @private
     */
    _normalizeRadiusAndGetNodeColors() {
        /**
         * TODO:
         * if paletteArray is not null and  like [{category:A, color:'#FFFFFF'}],
         * this Array will be applied to draw pie chart. If the length of the
         * Array is less than real category in all nodes. it will be filled by
         * palette which is specified in the 'palette' option.
         *
         * if paletteArray is null. Hapnet.js will assingn all category accroding
         * to the 'palette' option.
         *
         */
        let nodeColors = new Set();
        let maxRadius = 0;
        let minRadius = 0;
        this.plotOption.nodes.forEach(d => {
            d.sectors && d.sectors.forEach(x => {
                nodeColors.add(x.category);
            });
            if (d.radius > maxRadius) maxRadius = d.radius;
            if (d.radius < minRadius) minRadius = d.radius;
            /* sort sectors by number, larger rank to top */
            d.sectors && d.sectors.sort((a, b) => {
                if (a.number > b.number) {
                    return -1;
                } else {
                    return 1;
                }
            });

        });

        nodeColors = Array.from(nodeColors);
        const radiusInterval = this.plotOption.radiusMax - this.plotOption.radiusMin;
        this.plotOption.nodes.forEach(d => {
            d.size = cloneDeep(d.radius);
            d.radius = this.plotOption.radiusMin + radiusInterval / (maxRadius - minRadius) * (d.radius - minRadius);
        });

        this.plotOption.nodeColors = nodeColors
        // console.log(nodeColors);
    }

    /**
     * normalize the distance between the link between two nodes.
     * @private
     */
    _normalizeDistance() {
        let minDistance = 0;
        let maxDistance = 0;
        const distanceTransparencyInterval = this.plotOption.distanceNormalizedMax - this.plotOption.distanceNormalizedMin;
        this.plotOption.links.forEach(d => {
            const log1pDistance = Math.log1p(d.distance)
            if (log1pDistance > maxDistance) maxDistance = log1pDistance;
            if (log1pDistance < minDistance) minDistance = log1pDistance;

        });

        this.plotOption.links.forEach(d => {
            const log1pDistance = Math.log1p(d.distance)
            d.distanceNormalizedValue = this.plotOption.distanceNormalizedMax - distanceTransparencyInterval / (maxDistance - minDistance) * (log1pDistance - minDistance);
        });

    }

    /**
     * generate palette based on the total categories
     * @private
     */
    _calculatePalette() {
        const nodeColorsPalette = chroma.scale(predefinedPalettesList[this.plotOption.palette]).colors(this.plotOption.nodeColors.length).map(d => chroma(d).num());
        let tmpPalette = {}
        this.plotOption.nodeColors.forEach((d, idx) => {
            tmpPalette[d] = nodeColorsPalette[idx]
        })
        this.plotOption.nodeColors = tmpPalette
        this.plotOption.nodes.forEach(node => {
            node.sectors.forEach(sector => {
                sector.color = this.plotOption.nodeColors[sector.category];
                return sector;
            });
            return node;
        });
        // console.log()
    }

    /**
     * create network
     * @private
     */
    _createNetworkAndDomUI() {
        this.network = {}
        this.network.app = new PIXI.Application({
            width: this.initOption.width,
            height: this.initOption.height,
            antialias: true,
            resolution: this.initOption.resolution
        });

        /*
         * Create hook element.
         */
        let main_el = document.getElementById(this.initOption.el)

        main_el.style.position = "relative"
        let plot_el = document.createElement("div")
        plot_el.setAttribute("id", "plot_el")
        main_el.appendChild(plot_el)

        let ui_el = document.createElement("div")
        ui_el.setAttribute("id", "ui_el")

        plot_el.appendChild(ui_el)

        this.network.canvas = plot_el
            .appendChild(this.network.app.view);
        this.network.app.renderer.backgroundColor = this.plotOption.backgroundColor;
        this.domui = new domui(ui_el);
        // alert(this.network.app.view.width)
        this.domui.init(
            this.initOption.width,
            this.initOption.height,
            this.plotOption.nodes.length,
            this.plotOption.links.length,
            this.plotOption.uiStyle,
            this.plotOption.nodeColors,
            // {
            //   topBarBackgroundColor:'#3e999f',
            //   // leftPanelBackgroundColor: '#3e999f', //"#3e999f"d
            //   leftPanelBackgroundColor: '#6f619f', //"#3e999f"d
            //   rightPanelBackgroundColor: '#6f619f' //"#3e999f"d
            // }
        )
        this.domui.hide();
    }


    /**
     * Calculate layouts
     * @private
     */
    _calculateLayout() {
        calculateCoarseGraph(this.plotOption)
        calculateFullGraph(this.plotOption)
    }

    /**
     * calculate plot's border and setup init scale.
     * @private
     */
    _calculatePlotBorderAndSetInitScale() {

        this.plotOption.plotBorders = {
            x: {
                max: 0,
                min: 0,
            },
            y: {
                max: 0,
                min: 0
            }
        }

        this.plotOption.nodes.forEach(node => {
            // console.log(store.runtimeGlobal.plotBorders.x.max)
            // console.log(node)
            if (this.plotOption.plotBorders.x.max < node.x) this.plotOption.plotBorders.x.max = node.x;
            if (this.plotOption.plotBorders.x.min > node.x) this.plotOption.plotBorders.x.min = node.x;
            if (this.plotOption.plotBorders.y.max < node.y) this.plotOption.plotBorders.y.max = node.y;
            if (this.plotOption.plotBorders.y.min > node.y) this.plotOption.plotBorders.y.min = node.y;
        });
        const scaleNumberX = this.network.canvas.width / (this.plotOption.plotBorders.x.max - this.plotOption.plotBorders.x.min)
        const scaleNumberY = this.network.canvas.height / (this.plotOption.plotBorders.y.max - this.plotOption.plotBorders.y.min)
        const scaleNumberFinal = scaleNumberX > scaleNumberY ? scaleNumberY : scaleNumberX
        const initStageApproxWidth = (this.plotOption.plotBorders.x.max - this.plotOption.plotBorders.x.min) * scaleNumberFinal
        const initStageApproxHeight = (this.plotOption.plotBorders.y.max - this.plotOption.plotBorders.y.min) * scaleNumberFinal
        this.plotOption.initScale = scaleNumberFinal

        /* set init scale*/
        this.network.app.stage.scale.x = this.plotOption.initScale;
        this.network.app.stage.scale.y = this.plotOption.initScale;
        this.network.app.stage.x = this.network.app.stage.x + (this.network.app.view.width / 2);
        this.network.app.stage.y = this.network.app.stage.y + (this.network.app.view.height / 2);
    }

    _drawNetwork() {
        const nodeStyle = this.plotOption.style.NodeOutline;
        const lineStyle = {
            linkWidth: this.plotOption.style.linkWidth,
            linkColor: this.plotOption.style.linkColor,
        }

        /* init node neighbors */
        this.nodeNeighbors = {};


        this.plotOption.links.forEach(link => {

            const linkID = [link.source.id, link.target.id].sort().join("_");

            if (!this.nodeNeighbors[link.source.id]) {
                this.nodeNeighbors[link.source.id] = {};
            }
            this.nodeNeighbors[link.source.id][link.target.id] = linkID


            if (!this.nodeNeighbors[link.target.id]) {
                this.nodeNeighbors[link.target.id] = {};
            }
            this.nodeNeighbors[link.target.id][link.source.id] = linkID


            const sedge = new LINK(link, lineStyle, this.plotOption.style);


            // register event for each node.
            sedge.on('mouseover', (ev) => {
                // console.log(ev)
                // console.log(ev.data.global.x)
                this.domui.hideHover();
                this.domui.setLinkHover(ev.target, ev.data.global.x, ev.data.global.y);
                this.domui.showLinkHover();
            })

            this.network.app.stage.addChild(sedge);
            sedge.draw(); //string2hex(string: string) → {number}
        });


        this.plotOption.nodes.forEach(node => {
            const spie = new SINGLEPIE(node, nodeStyle, this.plotOption.style);

            // register event for each node.
            spie.on('mouseover', (ev) => {
                // console.log(ev)
                // console.log(ev.data.global.x)
                this.domui.hideHover();
                this.domui.setNodeHover(ev.target, ev.data.global.x, ev.data.global.y);
                this.domui.showNodeHover();
            })
            // spie.on('mouseout',()=>{
            //   // alert("bout")
            //   // this.domui.hideHover();
            // })

            this.network.app.stage.addChild(spie);
            spie.draw();
        });

    }

    _addEventZoom() {

        // let hit = this.network.app.renderer.plugins.interaction.hitTest({x: e.offsetX, y: e.offsetY})
        const zoom = (s, x, y) => {
            // console.log(this.network.app)
            s = s < 0 ? 1.1 : 0.9;
            let worldPos = {
                x: (x - this.network.app.stage.x) / this.network.app.stage.scale.x,
                y: (y - this.network.app.stage.y) / this.network.app.stage.scale.y
            };
            let newScale = {
                x: this.network.app.stage.scale.x * s,
                y: this.network.app.stage.scale.y * s
            };
            let newScreenPos = {
                x: (worldPos.x) * newScale.x + this.network.app.stage.x,
                y: (worldPos.y) * newScale.y + this.network.app.stage.y
            };
            this.network.app.stage.x -= (newScreenPos.x - x);
            this.network.app.stage.y -= (newScreenPos.y - y);
            this.network.app.stage.scale.x = newScale.x;
            this.network.app.stage.scale.y = newScale.y;
            // store.runtimeGlobal.currentZoomScale = newScale;
            // store.runtimeGlobal.currentStageWidth = store.runtimeGlobal.pixiApp.networkContainer.width;
            // store.runtimeGlobal.currentStageHeight = store.runtimeGlobal.pixiApp.networkContainer.height;
        };

        /* handel onwheel event from canvas */
        this.network.canvas.onwheel = (e) => {
            e.preventDefault();
            this.domui.hideHover();
            zoom(e.deltaY, e.offsetX, e.offsetY);
        }


    }

    _addEventClick() {
        /* handle mousedown event */
        var lastPos = null;

        /* init highlight list*/
        this.plotOption.highlightList = {
            nodes: [],
            links: []
        }


        this.network.canvas.onmousedown = (e) => {
            e.preventDefault();

            lastPos = {x: e.offsetX, y: e.offsetY};
            let hit = this.network.app.renderer.plugins.interaction.hitTest({x: e.offsetX, y: e.offsetY})

            if (hit instanceof SINGLEPIE) {
                // alert("1")
                this.domui.hide();
                this.domui.showNodePanel();
                // alert("2")
                this.domui.setNode(hit)
                // alert("3")
                this._clearHighLightList();
                // alert("4")
                hit.draw({heighLight: true})
                // alert("5")
                this.plotOption.highlightList.nodes.push(hit.name)
                // alert("6")
                /* highlight related links and related nodes */
                const relatedNodesAndLinks = this.nodeNeighbors[hit.name];
                for (let neighborNode in relatedNodesAndLinks) {
                    let link = relatedNodesAndLinks[neighborNode];
                    this.network.app.stage.getChildByName(neighborNode).draw({heighLight: true})
                    this.network.app.stage.getChildByName(link).draw({heighLight: true})
                    this.plotOption.highlightList.nodes.push(neighborNode)
                    this.plotOption.highlightList.links.push(link)
                }
                // alert("7")

            } else if (hit instanceof LINK) {
                this._clearHighLightList();
                hit.draw({heighLight: true});
                console.log(hit)
                this.plotOption.highlightList.links.push(hit.name)
                this.domui.hide();
                this.domui.showLinkPanel();
                this.domui.setLink(hit);
                /*
                 * highlight link related source node and target node
                 */
                this.network.app.stage.getChildByName(hit.linkOptions.source.id).draw({heighLight: true})
                this.network.app.stage.getChildByName(hit.linkOptions.target.id).draw({heighLight: true})

                /*
                push link related node to highlighted node list
                 */
                this.plotOption.highlightList.nodes.push(hit.linkOptions.source.id)
                this.plotOption.highlightList.nodes.push(hit.linkOptions.target.id)
            } else {
                this.domui.hide();
                this.domui.hideHover();
                this._clearHighLightList();
            }

        }
        /* handle mouseup event */
        this.network.canvas.onmouseup = (e) => {
            e.preventDefault();
            lastPos = null;
        }
        /* handle mousemove event*/
        this.network.canvas.onmousemove = (e) => {
            e.preventDefault();
            if (lastPos) {
                this.domui.hideHover();
                this.network.app.stage.x += (e.offsetX - lastPos.x); // stage的x和y 根据鼠标的x和y移动相同的像素，这样就实现了stage跟随鼠标移动
                this.network.app.stage.y += (e.offsetY - lastPos.y);
                lastPos = {x: e.offsetX, y: e.offsetY}; //然后更新lastPos
            }
        }
    }

    _addEventHover() {
        // defined in network construction, for each node and link creation, envet handlers are added.
    }

    _clearHighLightList() {
        this.plotOption.highlightList.nodes.forEach(d => {
            // console.log(d)
            const highlightedNode = this.network.app.stage.getChildByName(d);
            highlightedNode && highlightedNode.draw({heighLight: false});
        });

        // set all highlighted links to normal
        this.plotOption.highlightList.links.forEach(d => {

            const highlightedLink = this.network.app.stage.getChildByName(d);
            highlightedLink && highlightedLink.draw({heighLight: false});
        });
        this.plotOption.highlightList.nodes = [];
        this.plotOption.highlightList.links = [];
    }

}

export {HapNet}