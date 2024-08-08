import Vue from 'vue/dist/vue.esm'
import chroma from "chroma-js";
import '../../../assets/ui.css'

Vue.component('colorCode', {
  template: `

    <expand-panel :show-expand="true"  >
    <template #title>
      Categories ({{data.length || 0}})
    </template>
    <div :style="{padding:'2px 0px 2px 4px',display:'flex',justifyContent:'space-between',alignItems:'center'}">
      <span  >Item</span> <span >[value|percent(%)]</span>
    </div>
    <div :style="{overflowY:'auto',maxHeight:maxHeight,borderRadius:'5px'}">
      <div v-for="(x,idx) in data" :key="idx+'x'">
        <div :style="{padding:'2px 0px 2px 4px',
                  backgroundColor:colorTrans(x.color),
                  position:'relative'
                  }">
          <span style="text-align: right;min-width: 20px;display: inline-block">{{ idx + 1 }}</span> {{ x.category }}
          <span style="position: absolute;right: 4px;margin-right: 6px">[{{ x.number.toFixed(2) }} |
            {{ (x.percent*100).toFixed(0) }}%]</span>
        </div>
      </div>
    </div>

    </expand-panel>
    
  `,
// {number: 78.4313725490196, category: 'Iceland', color: 7574168, percent: 0.7843137254901962}
  props: ['data'],
  data(){
    return{
      isExpand:true,
      backgroundColor: chroma(this.$root.uiStyleComputed.leftPanel.backgroundColor).darken().hex()
    }
  },
  computed: {
    maxHeight() {
      let m = this.$root.uiStyle.globalHeight * 0.3 + 'px'
      return m
    }
  },
  methods: {
    colorTrans(c) {
      return chroma(c).hex()
    },
    changeExpand(){
      this.isExpand=!this.isExpand
    }
  },

});
