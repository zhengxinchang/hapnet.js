
import { HapNet } from "../src/hapnet";

let start = Date.now();

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false 为同步请求
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

// let dat = JSON.parse(httpGet("B.1.1.10.mini.json"));

// let dat = JSON.parse(httpGet("tree_merge.json"));
let dat = JSON.parse(httpGet("phylo_data_H5N1_influenzaA.json"));

/* Processing data*/
const data = {
    el: "hapnet",
    nodes: dat.nodes.map(d => {
        return {
            id: d.id,
            radius: d.radius,
            meta: function (x){
              let meta = {
                hover:{},
                panel:{},
              }
              meta.panel['fake attr1'] = Math.floor(Math.random()*100)
              Object.keys(x.meta.hover).forEach(k=>{
                 meta.hover[k] = x.meta.hover[k]
              })
              Object.keys(x.meta.panel).forEach(k=>{
                meta.panel[k] = x.meta.panel[k]
              })
              return meta
            }(d),
            sectors: d.values.map(v => {
                return {
                    number: v.number,
                    category: v.category
                }
            })
        }
    }),
    links: dat.edges.map(d => {
        return {
            source: d.source,
            target: d.target,
            distance: d.distance,
            meta: function (d) {
              let meta = {}
              Object.keys(d).filter(x => {
                if (!["source", "target", "distance"].includes(x)) {
                  return true
                } else {
                  return false
                }
              }).forEach(k => {
                meta[k] =d[k]
              })
              meta.meta.panel['fake attr1'] = Math.floor(Math.random()*100)
              meta.meta.panel['fake attr2'] = ["subAttr1:"+Math.floor(Math.random()*100),"subAttr2:"+Math.floor(Math.random()*100)]
              meta.meta.panel['fake attr3'] = {
                a:1,
                b:2,
                c:3,
                d:4,
                e:5,
              }
              return meta.meta
            }(d)
        }
    }),
  palette: "jama",
  fullGraph: {
    tickIteration: 1500,
      forceLinkStrength: 2,
      chargeStrength: 800000,
      forceLinkDistance: 4,
      eachNodePadding: 1000,
      chargeTheta: 0.1,


  },
  coarseGraph: {
    tickIteration: 0,
  },

    radiusMax: 500,
}


// console.log(data.nodes);
// console.log(data.links);
const hapnet = HapNet.init({
    el: "hapnet",
    width:window.innerWidth *0.9,
    height:window.innerHeight *0.9
});

hapnet.setOption(data)

let end = Date.now();

console.log(`time consuming : ${(end - start) / 1000}`)