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
import * as d3 from 'd3-force'
import { randomUniform } from "d3-random";

// function createSeededRandom(seed=12345) {
//     const randomLcg = d3.randomLcg(seed); // 创建带种子的随机数生成器
//     return () => randomLcg(); // 返回一个函数，模拟 Math.random()
// }

const random = randomUniform(0, 1);


/**
 * calculate layout for coarse graph
 * @param {Object} options plotOption
 */
function calculateCoarseGraph(options) {
    let nodes = options.nodes;
    let links = options.links;
    let hubNode = {};
    let hubLink = {};
    let nodeLinkedList = {};
    let hubNodeWithMeta = [];
    let hub = {};
    let nodesDict = {}; // 将nodes从Array转换为object

    const tickIteration = options.coarseGraph.tickIteration;
    const collideIteration = options.coarseGraph.collideIteration;
    const maxExpandSteps = options.coarseGraph.maxExpandSteps;
    const hubNodePadding = options.coarseGraph.hubNodePadding;
    const hubNumOFLinksThreshold = options.coarseGraph.hubNumOFLinksThreshold;
    const chargeStrength = options.coarseGraph.chargeStrength;
    const forceLinkDistance = options.coarseGraph.forceLinkDistance;
    const forceLinkStrength = options.coarseGraph.forceLinkStrength;


    nodes.forEach(d => { nodesDict[d.id] = d });

    /**
     * Generate a linked list to store nodes and their neighbors
     */
    links.forEach(d => {

        const s = d.source;
        const t = d.target;
        nodeLinkedList[s] && (nodeLinkedList[s].push(t)) || (nodeLinkedList[s] = [t]);
        nodeLinkedList[t] && (nodeLinkedList[t].push(s)) || (nodeLinkedList[t] = [s]);

        hub[d.source] && (hub[d.source].count += 1) || (hub[d.source] = {
            count: 1
        });
        hub[d.target] && (hub[d.target].count += 1) || (hub[d.target] = { count: 1 });

    });

    /**
     * Set the neighbor to emtpy when the node is a leaf node.
     */
    Object.keys(nodeLinkedList).forEach(d => {
        if (nodeLinkedList[d].length == 1) nodeLinkedList[d] = [];
    });


    /**
     * Find the hub node
     */
    Object.keys(hub).forEach(k => {
        hub[k].count > hubNumOFLinksThreshold ? (hubNode[k] = nodeLinkedList[k]) : false;
    });

    /**
     * Declare the function to find coarse graph based on one hub node
     */
    const recursiveFindHubLinks = (node_name) => {


        let historyNodeSet = new Set();
        let raidusSum = 0;
        let i = 0;

        while (true) {
            i++
            if (maxExpandSteps && i > maxExpandSteps && true || false) {
                // alert("aa")
                break;
            }
            // get neighbors of node_name
            let current_neighbor = nodeLinkedList[node_name]


            // debugger;
            let newNeighbor = [];
            let isAllHubNodeAsNeighbors = true
            for (let oneNodeName of current_neighbor) {

                if (historyNodeSet.has(oneNodeName)) {
                    continue
                } else {
                    historyNodeSet.add(oneNodeName);
                    raidusSum += nodesDict[oneNodeName].radius;
                }

                if (oneNodeName == node_name) continue;

                if (hubNode[oneNodeName]) {
                    const uniqKey = [node_name, oneNodeName].sort().join("||")
                    hubLink[uniqKey] || (hubLink[uniqKey] = {
                        source: node_name,
                        target: oneNodeName
                    });

                    continue
                } else {
                    // console.log(oneNodeName)
                    isAllHubNodeAsNeighbors = false
                }

                let nextNodeData = nodeLinkedList[oneNodeName] || []
                // if(node_name == "Node_61"){console.log(oneNodeName,nextNodeData)}
                if (nextNodeData.length == 0) {
                    delete nodeLinkedList[oneNodeName] // 删除这个节点
                }
                else {
                    // 判断一下这个节点是否被遍历过，如果是，则不放入newNeighbor
                    newNeighbor = Array.from(new Set(newNeighbor.concat(nextNodeData)))
                }

            }
            nodeLinkedList[node_name] = newNeighbor;
            if (isAllHubNodeAsNeighbors) { break }

        }


        /**
         * remove hub node from the historyNodeSet
         */
        Object.keys(hubNode).forEach(nodeName => {
            historyNodeSet.has(nodeName) && historyNodeSet.delete(nodeName)
        })

        /**
         * calculate psudo radius of the hub node.
         */

        hubNodeWithMeta.push({
            id: node_name,
            /**
             * Here I consider the radius of each node to calculate the radius of the hub node.
             */
            radius: Math.ceil(raidusSum + hubNodePadding) / 2,
            neighborList: Array.from(historyNodeSet)
        });

    }

    /**
     * construct coarse graph by find other hub node links for each hub node iteratively.
     */
    Object.keys(hubNode).forEach(hubNodeName => {
        recursiveFindHubLinks(hubNodeName)
        // alert("next recurser")
    });


    /**
     * Construct the coarse graph node list
     */
    // Object.keys(hubNode).forEach(node => {
    //     debugger;
    //     hubNodeWithMeta.push({
    //         id: node,
    //         /**
    //          * Here I consider the radius of each node to calculate the radius of the hub node.
    //          */
    //         radius:  Math.ceil(nodesDict[node].SumOfRadius*2/ nodesDict[node].NumOfNodesCovered)  + hubNodePadding
    //     }
    //     )
    // });


    const simulation = d3.forceSimulation(hubNodeWithMeta)
        .force("link", d3.forceLink(Object.values(hubLink)).id(d => d.id).distance(forceLinkDistance).strength(forceLinkStrength))
        .force("collide", d3.forceCollide().radius(d => d.radius).iterations(collideIteration))
        .force("charge", d3.forceManyBody().strength(chargeStrength ))
        .force("x", d3.forceX())
        .force("y", d3.forceY()).tick(tickIteration).stop();

    options.coarseNodes = simulation.nodes();
    options.coarseLinks = Object.values(hubLink);
};

/**
 * calculate layout for full graph
 * @param {Object} options plotOption
 */
function calculateFullGraph(options) {

    const tickIteration = options.fullGraph.tickIteration;
    const collideIteration = options.fullGraph.collideIteration;
    const eachNodePadding = options.fullGraph.eachNodePadding;
    const chargeStrength = options.fullGraph.chargeStrength;
    const forceLinkDistance = options.fullGraph.forceLinkDistance;
    const forceLinkStrength = options.fullGraph.forceLinkStrength;
    const chargeTheta  = options.fullGraph.chargeTheta;

    let nodesDict = {};
    options.nodes.forEach(node => {
        nodesDict[node.id] = node;
    });
    
    /**
     * assign position of hub-node and non-hub node
     */
    options.coarseNodes.forEach(cnode => {
        nodesDict[cnode.id].x = cnode.x
        nodesDict[cnode.id].y = cnode.y
        nodesDict[cnode.id].isHub = true;

        // assign non-hub-node position
        cnode.neighborList.forEach(neighbor => {
            nodesDict[neighbor].isHub = false;
            // nodesDict[neighbor].x = cnode.x + cnode.radius * Math.sin(Math.random() * Math.PI * 2);
            // nodesDict[neighbor].y = cnode.y + cnode.radius * Math.cos(Math.random() * Math.PI * 2);
            nodesDict[neighbor].x = cnode.x + cnode.radius * Math.sin(random * Math.PI * 2);
            nodesDict[neighbor].y = cnode.y + cnode.radius * Math.cos(random * Math.PI * 2);
        });
    });

    let nodesWithPosition = Object.values(nodesDict);

    const simulation = d3.forceSimulation(nodesWithPosition)
      // .force("link", d3.forceLink(Object.values(options.links)).id(d => d.id).distance(forceLinkDistance).strength(forceLinkStrength))
      .force("link", d3.forceLink(Object.values(options.links)).id(d => d.id).distance(d => d.distanceNormalizedValue).strength(forceLinkStrength))
        .force("collide", d3.forceCollide().radius(d => d.radius +eachNodePadding ).iterations(collideIteration))
        .force("charge", d3.forceManyBody().strength(chargeStrength ).theta(chargeTheta)) // charge 决定full graph的点的距离
        // .force("x", d3.forceX().strength(0.01))
        // .force("y", d3.forceY().strength(0.01))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .stop()
        .tick(tickIteration);

    /**
     * reset new nodes and links to original options object.
     * Please note that the d3-force will modify the option.links directly!
     */
    options.nodes = simulation.nodes();

};


export { calculateCoarseGraph, calculateFullGraph }