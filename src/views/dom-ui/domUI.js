import Vue from 'vue/dist/vue.esm'
import chroma from "chroma-js";
import '../../../assets/ui.css'
import  './expandPanel'
import './oneMetaBlock'
import './colorCode'
import {defaultsDeep} from "lodash-es";


export default function createDomUI(el) {

  return new Vue({
    el: el,
    methods: {
      show() {
        this.isShowNodePanel = true
        this.isShowLinkPanel = true
      },
      hide() {
        this.isShowNodePanel = false
        this.isShowLinkPanel = false
      },

      hideHover(){
        this.isShowNodeHover = false
        this.isShowLinkHover = false
      },
      // hideNodePanel() {
      //   this.isShowNodePanel = false
      // },
      showNodePanel() {
        this.isShowNodePanel = true
      },
      showLinkPanel() {
        this.isShowLinkPanel = true
      },
      showNodeHover() {
        this.isShowNodeHover = true
      },
      showLinkHover() {
        this.isShowLinkHover = true
      },

      init(width, height, numNode, numLink,uiStyle) {
        this.uiStyle.globalWidth = width;
        this.uiStyle.globalHeight = height;
        this.numNode = numNode;
        this.numLink = numLink;
        this.uiStyle = defaultsDeep(uiStyle,this.uiStyle)

      },
      setNode(node) {
        this.node.name = node.name
        this.node.sectors = node.nodeOptions.sectors;
        this.node.meta = node.nodeOptions.meta;

      },
      setLink(link) {
        console.log(link)
        this.link.name = link.name
        this.link.distance = link.linkOptions.distance
        this.link.meta = link.linkOptions.meta;
        console.log(this.link)
      },
      setNodeHover(node,x,y){

        this.nodeHover.name = node.name
        this.nodeHover.meta = node.nodeOptions.meta;
        this.nodeHover.x = x +'px';
        this.nodeHover.y = y +'px';
      },
      setLinkHover(link,x,y){

        this.linkHover.name = link.name
        this.linkHover.meta = link.linkOptions.meta;
        this.linkHover.x = x +'px';
        this.linkHover.y = y +'px';
      }

    },
    data(){
      return {
        numNode: 0,
        numLink: 0,
        uiIcon: {
          expand: require('../../../assets/expand.svg'),
          collapse: require('../../../assets/collapse.svg')
        },
        node: {
          name: null,
          sectors: [],
          meta:{}
        },
        nodeHover: {
          name: null,
          meta:{},
          x:0,
          y:0,
        },
        linkHover: {
          name: null,
          meta:{},
          x:0,
          y:0,
        },
        link:{
          distance:null,
          name:null,
          meta:[]
        },
        isShowNodePanel: false,
        isExpandNodePanelAll:true,
        isShowLinkPanel: false,
        isExpandLinkPanelAll:true,
        isShowNodeHover: false,
        isExpandNodeHoverAll:true,
        isShowLinkHover: false,
        isExpandLinkHoverAll:true,
        uiStyle: {
          globalWidth: 0,
          globalHeight: 0,
          topBarBackgroundColor:'#f5871f',
          leftPanelBackgroundColor: '#3e999f', //"#3e999f"d
          rightPanelBackgroundColor: '#3e999f' //"#3e999f"d
        },
      }

    },

    computed: {
      uiStyleComputed() {
        return {
          topBar: {

            width: this.uiStyle.globalWidth + 'px',
            height: this.uiStyle.globalHeight * 0.05 + 'px',
            top: "0px",
            left: "0px",
            opacity: 0.9,
            backgroundColor: chroma(this.uiStyle.topBarBackgroundColor).hex()
          },
          bottomBar: {

            width: this.uiStyle.globalWidth + 'px',
            height: this.uiStyle.globalHeight * 0.05 + 'px',
            bottom: "0px",
            left: "0px",
            opacity: 0.9,
            backgroundColor: chroma(this.uiStyle.topBarBackgroundColor).hex()
          },
          leftPanel: {
            top: this.uiStyle.globalHeight * 0.05 + 'px',
            left: "0px",
            width: this.uiStyle.globalWidth * 0.2 + 'px',
            height: this.uiStyle.globalHeight * 0.8 + 'px',
            titleHeight: this.uiStyle.globalHeight * 0.1 + 'px',
            overflowHeight: this.uiStyle.globalHeight * 0.7 + 'px',
            backgroundColor: chroma(this.uiStyle.leftPanelBackgroundColor).hex()
          },
          rightPanel: {
            top: this.uiStyle.globalHeight * 0.05 + 'px',
            // left:  (this.uiStyle.globalWidth - this.uiStyle.globalWidth * 0.2) +'px'  ,
            left:  '0px'  ,
            width: this.uiStyle.globalWidth * 0.2 + 'px',
            height: this.uiStyle.globalHeight * 0.8 + 'px',
            titleHeight: this.uiStyle.globalHeight * 0.1 + 'px',
            overflowHeight: this.uiStyle.globalHeight * 0.7 + 'px',
            backgroundColor: chroma(this.uiStyle.leftPanelBackgroundColor).hex()
          },
          nodeHover: {
            // left:  (this.uiStyle.globalWidth - this.uiStyle.globalWidth * 0.2) +'px'  ,
            width: this.uiStyle.globalWidth * 0.15 + 'px',
            height: this.uiStyle.globalHeight * 0.3 + 'px',
            titleHeight: this.uiStyle.globalHeight * 0.05 + 'px',
            overflowHeight: this.uiStyle.globalHeight * 0.20 + 'px',
            backgroundColor: chroma(this.uiStyle.leftPanelBackgroundColor).hex()
          },
          linkHover: {
            // left:  (this.uiStyle.globalWidth - this.uiStyle.globalWidth * 0.2) +'px'  ,
            width: this.uiStyle.globalWidth * 0.15 + 'px',
            height: this.uiStyle.globalHeight * 0.3 + 'px',
            titleHeight: this.uiStyle.globalHeight * 0.05 + 'px',
            overflowHeight: this.uiStyle.globalHeight * 0.20 + 'px',
            backgroundColor: chroma(this.uiStyle.leftPanelBackgroundColor).hex()
          },
        }


      }

    },
    template: `
      <div style="color: white;
      display: flex;
      ">
      
        <!--Top Bar-->
        <div :style="{
              width:uiStyleComputed.topBar.width,
              height:uiStyleComputed.topBar.height,
              backgroundColor:uiStyleComputed.topBar.backgroundColor,
              position:'absolute',
              top:uiStyleComputed.topBar.top,
              left:uiStyleComputed.topBar.left,
              opacity:uiStyleComputed.topBar.opacity,
              display:'flex',
              alignItems:'center',
              // gridArea:'header'
            }">
          <span style="color: white;font-weight: bold;text-align: center;margin-left: 40px">HapNet.js</span>
<!--          <span style="position: absolute;right: 0px;margin-right: 10px">-->
<!--            <span style="color: white;text-align: right;margin-left: 40px">Haplotypes: {{ this.numNode }}</span>-->
<!--            <span style="color: white;text-align: right;margin-left: 40px">Links: {{ this.numLink }}</span>-->
<!--          </span>-->
        </div>

        <!--bottom Bar-->
        <div :style="{
              width:uiStyleComputed.bottomBar.width,
              height:uiStyleComputed.bottomBar.height,
              backgroundColor:uiStyleComputed.bottomBar.backgroundColor,
              position:'absolute',
              bottom:uiStyleComputed.bottomBar.bottom,
                // gridArea:'footer',
              opacity:uiStyleComputed.bottomBar.opacity,
              display:'flex',
              alignItems:'center',
              
            }">
          <span style="color: white;font-weight: bold;text-align: center;margin-left: 40px">Status</span>
          <span style="position: absolute;right: 0px;margin-right: 10px">
            <span style="color: white;text-align: right;margin-left: 40px">Haplotypes: {{ this.numNode }}</span>
            <span style="color: white;text-align: right;margin-left: 40px">Links: {{ this.numLink }}</span>
          </span>
        </div>
        
        <!--Left Panel Node-->
        <div v-if="isShowNodePanel"
             :style="{borderRadius: '5px',
             backgroundColor: uiStyleComputed.leftPanel.backgroundColor,
             
             width:uiStyleComputed.leftPanel.width,
              top:uiStyleComputed.leftPanel.top,
              left: uiStyleComputed.leftPanel.left,
              position: 'absolute',
             // gridArea:'left',
            margin:'4px',

        }">
          <!--left panel-->
          <div :style="{margin:'5px', paddingBottom:'4px',
            }" >
            <div :style="{marginTop: '4px',marginBottom: '16px',fontWeight: 'bold',fontSize: '18px'}">
              Haplotype: {{ node.name }}
            </div>

            <div :style="{
              height:uiStyleComputed.leftPanel.height,
                          paddingTop:'4px',
                          paddingBottom:'4px',
                          overflowY:'auto'
            }" >
              <color-code :data="node.sectors"></color-code>
<!--              {{node.meta.panel}}-->
              <div style="margin-top:16px">
                <button style="border-radius: 4px;border-color:white" @click="()=>{isExpandNodePanelAll = true}" >Expand all</button>
                <button style="border-radius: 4px;border-color:white" @click="()=>{isExpandNodePanelAll = false}" >Collapse all</button>
              </div>
              <div >
                <one-meta-block  v-for="(v,k) in node.meta.panel" :key="k" :title="k" :data="v" :ifexpand="isExpandNodePanelAll" :cbfuns="{}" ></one-meta-block>
              </div>
            </div>
          </div>
        </div>

        <!--right panel-->
          <div v-if="isShowLinkPanel"
               :style="{borderRadius: '5px',
               backgroundColor: uiStyleComputed.rightPanel.backgroundColor,
               width:uiStyleComputed.rightPanel.width,
                top:uiStyleComputed.rightPanel.top,
                left: uiStyleComputed.rightPanel.left,
                position: 'absolute',
              marginTop:'4px',
          }">
            <div :style="{margin:'5px', paddingBottom:'4px',
            }" >
            <div :style="{marginTop: '4px',marginBottom: '16px',fontWeight: 'bold',fontSize: '18px'}">
              Link: {{ link.name }}
            </div>

              <div :style="{
              height:uiStyleComputed.rightPanel.height,
                          paddingTop:'4px',
                          paddingBottom:'4px',
                          overflowY:'auto'
            }" >
                <div style="margin-top:16px">
                  <button style="border-radius: 4px;border-color:white" @click="()=>{isExpandLinkPanelAll = true}" >Expand all</button>
                  <button style="border-radius: 4px;border-color:white" @click="()=>{isExpandLinkPanelAll = false}" >Collapse all</button>
                </div>
                <div >
                  <one-meta-block  v-for="(v,k) in link.meta.panel" :key="k" :title="k" :data="v" :ifexpand="isExpandLinkPanelAll" :cbfuns="{}" ></one-meta-block>
                </div>
                
              </div>
            </div>
          </div>


          <!--node hover-->
          <div v-if="isShowNodeHover"
               :style="{
                  borderRadius: '5px',
                  backgroundColor: uiStyleComputed.nodeHover.backgroundColor,
                  top:nodeHover.y,
                  left:nodeHover.x,
                  // height:uiStyleComputed.nodeHover.height,
                  position: 'absolute',
                  marginTop:'4px',
            }">
            <div :style="{margin:'5px', paddingBottom:'4px',
              }" >
              <div :style="{marginTop: '4px',fontWeight: 'bold',fontSize: '18px'}">
                Haplotype: {{ nodeHover.name }}
              </div>
              <div style="">
                <button style="border-radius: 4px;border-color:white;" @click="()=>{isExpandNodeHoverAll = true}" >Expand all</button>
                <button style="border-radius: 4px;border-color:white" @click="()=>{isExpandNodeHoverAll = false}" >Collapse all</button>
              </div>
              <div :style="{
                height:uiStyleComputed.nodeHover.overflowHeight,
                            overflowY:'auto'
              }" >

                <div >
                  <one-meta-block  v-for="(v,k) in nodeHover.meta.hover" :key="k" :title="k" :data="v" :ifexpand="isExpandNodeHoverAll" :cbfuns="{}" ></one-meta-block>
                </div>
  
              </div>
            </div>
          </div>



        <!--link hover-->
        <div v-if="isShowLinkHover"
             :style="{
                  borderRadius: '5px',
                  backgroundColor: uiStyleComputed.linkHover.backgroundColor,
                  top:linkHover.y,
                  left:linkHover.x,
                  // height:uiStyleComputed.nodeHover.height,
                  position: 'absolute',
                  marginTop:'4px',
            }">
          <div :style="{margin:'5px', paddingBottom:'4px',
              }" >
            <div :style="{marginTop: '4px',fontWeight: 'bold',fontSize: '18px'}">
              Link: {{ linkHover.name }}
            </div>
            <div style="">
              <button style="border-radius: 4px;border-color:white;" @click="()=>{isExpandLinkHoverAll = true}" >Expand all</button>
              <button style="border-radius: 4px;border-color:white" @click="()=>{isExpandLinkHoverAll = false}" >Collapse all</button>
            </div>
            <div :style="{
                height:uiStyleComputed.linkHover.overflowHeight,
                overflowY:'auto'
              }" >

              <div >
                <one-meta-block  v-for="(v,k) in linkHover.meta.hover" :key="k" :title="k" :data="v" :ifexpand="isExpandLinkHoverAll" :cbfuns="{}" ></one-meta-block>
              </div>

            </div>
          </div>
        </div>




      </div>
      

    `,
  })
}