import Vue from 'vue/dist/vue.esm'
import chroma from "chroma-js";
import '../../../assets/ui.css'
import {isArray, isObject, isString, toString} from "lodash-es";

Vue.component('oneMetaBlock', {
  template:`
    <div>
        <expand-panel :is-expand-prop="ifexpand" :show-expand="(dataType != 'str')">
          <template #title>{{title}}</template>
<!--          {{dataType}}-->
<!--       {{finalData[0]}}-->

            <template v-if="dataType =='str'"  #thevalue >{{finalData[0]}}</template>


          <div v-if="(dataType!='str')" >
            <div :style="{padding:'2px 0px 2px 4px',display:'flex',justifyContent:'space-between',alignItems:'center'}">
              <span>Item</span>
            </div>
            <div :style="{overflowY:'auto',maxHeight:maxHeight,borderRadius:'5px'}">
              <div v-for="(x,idx) in finalData" :key="idx+'x'">
                <div :style="{
                  padding:'2px 0px 2px 4px',
                  position:'relative',
                  display:'flex',
                  justifyContent:'flex-start'
                  }">
                  <span style="text-align: right;min-width: 20px;display: inline-block">{{ idx + 1 }}</span  > <span  style="padding-left: 4px; text-align: left;min-width: 20px;display: inline-block" v-html="x" ></span>
<!--                  <span style="text-align: right;min-width: 20px;display: inline-block">{{ idx + 1 }}</span> {{ x.category }}-->
<!--                  <span style="position: absolute;right: 4px;margin-right: 6px">[{{ x.number.toFixed(2) }}</span>-->
                </div>
              </div>
            </div>

          </div>

        </expand-panel>
    </div>

  `,
  props:{'data':{},'title':{},"cbfuns":{},"ifexpand":{default:true}},
  /*
  * data: array or string
  * */
  data(){
    return{
      middleData:null,
      isLoading:false,
      dataType:null,
      finalData:[],
      // isExpand:true,
      // backgroundColor: chroma(this.$root.uiStyleComputed.leftPanel.backgroundColor).darken().hex()
    }
  },
  computed:{
    maxHeight() {
      let m = this.$root.uiStyle.globalHeight * 0.3 + 'px'
      return m
    },
  },
  watch:{
    data:{
      handler:function(){
        this.calculateData();
      },
      deep:true,
      immediate:true
    }
  },
  mounted() {
    this.calculateData();
  },
  methods:{
    colorTransHex(c) {
      return chroma(c).hex()
    },
    calculateData(){
      if(this.cbfuns[this.title] || false) {
        this.isLoading = true;
        this.middleData = this.cbfuns[this.title](this.data)
      }else{
        this.middleData = this.data
      }

      if(isArray(this.middleData)){
        this.dataType= "array"
        this.finalData = []
        for(let item of this.middleData){

          if (!isObject(item)){
            this.finalData.push(
              JSON.stringify(item,null,1)
            )
          }else {
            let tmpOut = ""

            Object.entries(item).forEach(([k,v])=>{
              // tmpOut += "<b>"+k +"<b/> : " +v +"<br/>"
              tmpOut += `<b>${k}</b>: ${v} <br/>`
            })
            this.finalData.push(
              tmpOut
            )
          }

        }
        // console.log(this.finalData)
      }else if(isString(this.middleData)){
        this.finalData = [this.middleData]
        this.dataType= "str"
      }else if (isObject(this.middleData)) {
        this.finalData = []
        this.dataType= "obj"
        let tmpOut = ""
        Object.entries(this.middleData).forEach(([k,v])=>{
          // tmpOut += "<b>"+k +"<b/> : " +v +"<br/>"
          tmpOut += `<b>${k}</b>: ${v} <br/>`
        })
        this.finalData.push(
          tmpOut
        )
      }else{
        this.finalData = [ toString(this.middleData) ]
        this.dataType= "str"
      }

    }
  },

});
