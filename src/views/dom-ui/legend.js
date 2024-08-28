
import Vue from 'vue/dist/vue.esm'
import chroma from "chroma-js";
import '../../../assets/ui.css'
import './expandPanel'
Vue.component("legendUI",{
    template: `
        <div >
          <div >
            <button @click="isShow=!isShow" style="text-decoration: none">Legends</button>

          </div>
     
          <div style=" position: absolute;top: 20px; right: 0px;" v-show="isShow">
            <expand-panel style="min-width: 200px">
              <template #title > Color codes </template>
          
        

              <div :style="{overflowY:'auto',maxHeight:'200px',borderRadius:'5px'}">
                <div v-for="(item,idx) in Object.entries(nodeColors) " :key=idx>
                  <div :style="{padding:'2px 0px 2px 4px',
                      position:'relative',
                      backgroundColor:colorTrans(item[1]),
                      }">
                    <span :style="{textAlign: 'right',minWidth: '20px',display: 'inline-block'}">{{ item[0] }}</span>
                  </div>
                </div>
              </div>
            </expand-panel>
          </div>
          
        </div>


    `,
    props:['nodeColors'],
    data(){
        return {
            isShow:false,
        }
    },
    methods:{
        colorTrans(c) {
            return chroma(c).hex()
        },
    }
})