import Vue from 'vue/dist/vue.esm'
import chroma from "chroma-js";
import '../../../assets/ui.css'

Vue.component('expandPanel',{
  template:`
    <div :style="{backgroundColor:backgroundColor,padding:'6px',borderRadius:'5px',marginTop:'4px'}">
        <div style="margin-top: 4px;margin-bottom: 4px; font-weight: bold;display:flex;align-items:center; justify-content: flex-end">
          <slot name="title"></slot>
          <span style="margin-left: auto;" >
            <slot name="thevalue" ></slot>
            <span v-show="showExpand &&  !isExpand " @click="changeExpand" > 
              <img   style="" width="16px" :src="$root.uiIcon.expand"/>
            </span>
            <span v-show="showExpand &&  isExpand" @click="changeExpand" >
              <img   style="" width="16px" :src="$root.uiIcon.collapse"/>
            </span>
          </span>

        </div>
        
        <div v-show="isExpand" >
          <slot></slot>
        </div>
      
    </div>`,
  props:{
    showExpand:{
      default:false
    },
    isExpandProp:{default:true},
  },
  data(){
    return {
      isExpand:true,
      backgroundColor: chroma(this.$root.uiStyleComputed.leftPanel.backgroundColor).darken().hex()
    }
  },
  watch:{
    isExpandProp(newval){
      this.isExpand = this.isExpandProp
    }
  },
  methods:{
    changeExpand(){
      this.isExpand=!this.isExpand
    }
  },

});
