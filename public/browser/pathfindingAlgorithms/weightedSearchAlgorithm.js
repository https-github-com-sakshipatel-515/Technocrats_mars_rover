const astar = require("./astar");
function weightedSearchAlgorithm(nodes, start, target, atanimate, boardArray, name, heuristic) {
  if (name === "astar") return astar(nodes, start, target, atanimate, boardArray, name)
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = "right";
  let unv = Object.keys(nodes);
  while (unv.length) {
    let cnn = cn(nodes, unv);
    while (cnn.status === "wall" && unv.length) {
      cnn = cn(nodes, unv)
    }
    if (cnn.distance === Infinity) {
      return false;
    }
    atanimate.push(cnn);
    cnn.status = "visited";
    if (cnn.id === target) return "success!";
    if (name === "CLA" || name === "greedy") {
      unb(nodes, cnn, boardArray, target, name, start, heuristic);
    } else if (name === "dijkstra") {
      unb(nodes, cnn, boardArray);
    }
  }
}

//Function to return Closest Node to a node.
function cn(nodes, unv) {
  let cc, index;
  for (let i = 0; i < unv.length; i++) {
    if (!cc || cc.distance > nodes[unv[i]].distance) {
      cc = nodes[unv[i]];
      index = i;
    }
  }
  unv.splice(index, 1);
  return cc;
}

//Function to Update Neighbors.
function unb(nodes, node, boardArray, target, name, start, heuristic) {
  let nb = gn(node.id, nodes, boardArray);
  for (let neighbor of nb) {
    if (target) {
      un(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
    } else {
      un(node, nodes[neighbor]);
    }
  }
}

//Function to Return Average number of Nodes in between.
function anonb(cnn) {
  let num = 0;
  while (cnn.previousNode) {
    num++;
    cnn = cnn.previousNode;
  }
  return num;
}

//Function to Update node.
function un(cnn, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = gd(cnn, targetNode);
  let dtc;
  if (actualTargetNode && name === "CLA") {
    let weight = targetNode.weight === 15 ? 15 : 1;
    if (heuristic === "manhattanDist") {
      dtc = cnn.distance + (distance[0] + weight) * manhattanDist(targetNode, actualTargetNode);
    } else if (heuristic === "poweredManhattanDistance") {
      dtc = cnn.distance + targetNode.weight + distance[0] + Math.pow(manhattanDist(targetNode, actualTargetNode), 2);
    } else if (heuristic === "extraPoweredManhattanDistance") {
      dtc = cnn.distance + (distance[0] + weight) * Math.pow(manhattanDist(targetNode, actualTargetNode), 7);
    }
    let startNodeManhattanDistance = manhattanDist(actualStartNode, actualTargetNode);
  } else if (actualTargetNode && name === "greedy") {
    dtc = targetNode.weight + distance[0] + manhattanDist(targetNode, actualTargetNode);
  } else {
    dtc = cnn.distance + targetNode.weight + distance[0];
  }
  if (dtc < targetNode.distance) {
    targetNode.distance = dtc;
    targetNode.previousNode = cnn.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
}

//Function to Update neighbors.
function gn(id, nodes, boardArray) {
  let crd = id.split("-");
  let x = parseInt(crd[0]);
  let y = parseInt(crd[1]);
  let nb = [];
  let pn;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    pn = `${(x - 1).toString()}-${y.toString()}`
    if (nodes[pn].status !== "wall") nb.push(pn);
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    pn = `${(x + 1).toString()}-${y.toString()}`
    if (nodes[pn].status !== "wall") nb.push(pn);
  }
  if (boardArray[x][y - 1]) {
    pn = `${x.toString()}-${(y - 1).toString()}`
    if (nodes[pn].status !== "wall") nb.push(pn);
  }
  if (boardArray[x][y + 1]) {
    pn = `${x.toString()}-${(y + 1).toString()}`
    if (nodes[pn].status !== "wall") nb.push(pn);
  }
  return nb;
}

//Function to Get Distance between two nodes.
function gd(nodeOne, nodeTwo) {
  let ccrd = nodeOne.id.split("-");
  let tcrd = nodeTwo.id.split("-");
  let x1 = parseInt(ccrd[0]);
  let y1 = parseInt(ccrd[1]);
  let x2 = parseInt(tcrd[0]);
  let y2 = parseInt(tcrd[1]);
  if (x2 < x1) {
    if (nodeOne.direction === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (nodeOne.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.direction === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (nodeOne.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.direction === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (nodeOne.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.direction === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

//Function to return Manhattan Distance Between Two Nodes.
function manhattanDist(nodeOne, nodeTwo) {
  let noc = nodeOne.id.split("-").map(ele => parseInt(ele));
  let ntc = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xc = Math.abs(noc[0] - ntc[0]);
  let yc = Math.abs(noc[1] - ntc[1]);
  return (xc + yc);
}

//Function to return Weighted Manhattan Distance Between Two Nodes.
function weightedManhattanDistance(nodeOne, nodeTwo, nodes) {
  let noc = nodeOne.id.split("-").map(ele => parseInt(ele));
  let ntc = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xc = Math.abs(noc[0] - ntc[0]);
  let yc = Math.abs(noc[1] - ntc[1]);

  if (noc[0] < ntc[0] && noc[1] < ntc[1]) {
    let axc = 0,
        ayc = 0;
    for (let cx = noc[0]; cx <= ntc[0]; cx++) {
      let cId = `${cx}-${nodeOne.id.split("-")[1]}`;
      let cnn = nodes[cId];
      axc += cnn.weight;
    }
    for (let cy = noc[1]; cy <= ntc[1]; cy++) {
      let cId = `${ntc[0]}-${cy}`;
      let cnn = nodes[cId];
      ayc += cnn.weight;
    }

    let oaxc = 0,
        oayc = 0;
    for (let cy = noc[1]; cy <= ntc[1]; cy++) {
      let cId = `${nodeOne.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cId];
      ayc += cnn.weight;
    }
    for (let cx = noc[0]; cx <= ntc[0]; cx++) {
      let cId = `${cx}-${ntc[1]}`;
      let cnn = nodes[cId];
      axc += cnn.weight;
    }

    if (axc + ayc < oaxc + oayc) {
      xc += axc;
      yc += ayc;
    } else {
      xc += oaxc;
      yc += oayc;
    }
  } else if (noc[0] < ntc[0] && noc[1] >= ntc[1]) {
    let axc = 0,
        ayc = 0;
    for (let cx = noc[0]; cx <= ntc[0]; cx++) {
      let cId = `${cx}-${nodeOne.id.split("-")[1]}`;
      let cnn = nodes[cId];
      axc += cnn.weight;
    }
    for (let cy = noc[1]; cy >= ntc[1]; cy--) {
      let cId = `${ntc[0]}-${cy}`;
      let cnn = nodes[cId];
      ayc += cnn.weight;
    }

    let oaxc = 0,
        oayc = 0;
    for (let cy = noc[1]; cy >= ntc[1]; cy--) {
      let cId = `${nodeOne.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cId];
      ayc += cnn.weight;
    }
    for (let cx = noc[0]; cx <= ntc[0]; cx++) {
      let cId = `${cx}-${ntc[1]}`;
      let cnn = nodes[cId];
      axc += cnn.weight;
    }

    if (axc + ayc < oaxc + oayc) {
      xc += axc;
      yc += ayc;
    } else {
      xc += oaxc;
      yc += oayc;
    }
  } else if (noc[0] >= ntc[0] && noc[1] < ntc[1]) {
    let axc = 0,
        ayc = 0;
    for (let cx = noc[0]; cx >= ntc[0]; cx--) {
      let cId = `${cx}-${nodeOne.id.split("-")[1]}`;
      let cnn = nodes[cId];
      axc += cnn.weight;
    }
    for (let cy = noc[1]; cy <= ntc[1]; cy++) {
      let cId = `${ntc[0]}-${cy}`;
      let cnn = nodes[cId];
      ayc += cnn.weight;
    }

    let oaxc = 0,
        oayc = 0;
    for (let cy = noc[1]; cy <= ntc[1]; cy++) {
      let cId = `${nodeOne.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cId];
      ayc += cnn.weight;
    }
    for (let cx = noc[0]; cx >= ntc[0]; cx--) {
      let cId = `${cx}-${ntc[1]}`;
      let cnn = nodes[cId];
      axc += cnn.weight;
    }

    if (axc + ayc < oaxc + oayc) {
      xc += axc;
      yc += ayc;
    } else {
      xc += oaxc;
      yc += oayc;
    }
  } else if (noc[0] >= ntc[0] && noc[1] >= ntc[1]) {
      let axc = 0,
          ayc = 0;
      for (let cx = noc[0]; cx >= ntc[0]; cx--) {
        let cId = `${cx}-${nodeOne.id.split("-")[1]}`;
        let cnn = nodes[cId];
        axc += cnn.weight;
      }
      for (let cy = noc[1]; cy >= ntc[1]; cy--) {
        let cId = `${ntc[0]}-${cy}`;
        let cnn = nodes[cId];
        ayc += cnn.weight;
      }

      let oaxc = 0,
          oayc = 0;
      for (let cy = noc[1]; cy >= ntc[1]; cy--) {
        let cId = `${nodeOne.id.split("-")[0]}-${cy}`;
        let cnn = nodes[cId];
        ayc += cnn.weight;
      }
      for (let cx = noc[0]; cx >= ntc[0]; cx--) {
        let cId = `${cx}-${ntc[1]}`;
        let cnn = nodes[cId];
        axc += cnn.weight;
      }

      if (axc + ayc < oaxc + oayc) {
        xc += axc;
        yc += ayc;
      } else {
        xc += oaxc;
        yc += oayc;
      }
    }

  return xc + yc;


}

module.exports = weightedSearchAlgorithm;
