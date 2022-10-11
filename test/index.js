
import { HapNet } from "../src/hapnet";

let start = Date.now();


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false 为同步请求
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

let dat = JSON.parse(httpGet("/A.2.mini.json"));
// let dat = JSON.parse(httpGet("/AY.3.mini.json")) ;
// let dat = JSON.parse(httpGet("/haplotype0508.mini.json")) ;
// console.log(dat);
// console.log(dat)

// let nodes= 



const customOptions = {
    el: "hapnet",
    // backgroundColor: '#223342',
    nodes: dat.nodes.map(d => {
        return {
            id: d.id,
            radius: d.radius,
            meta: d.meta,
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
                  meta[k] = d[k]
                })
              return meta
            }(d)
        }
    }),
  palette: "jama",
  fullGraph: {
    tickIteration: 60,
  },
  coarseGraph: {
    tickIteration: 1000,
  }

  // coarseGraph:{
  //     hubNumOFLinksThreshold:10,
  //     chargeStrength: 20000,
    // }
}


// console.log(customOptions);

const hapnet = HapNet.init({
    el: "hapnet",
});

hapnet.setOption(customOptions)

let end = Date.now();

console.log(`time consuming : ${(end - start) / 1000}`)