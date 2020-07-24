const astar = require("./astar");
function bidir(nodes, start, target, ntanimate, boardArray, name, heuristic, board) {
  if (name === "astar") return astar(nodes, start, target, ntanimate, boardArray, name)
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = "right";
  nodes[target].otherdistance = 0;
  nodes[target].otherdirection = "left";
  let vn = {};
  let uno = Object.keys(nodes);
  let unt = Object.keys(nodes);
  while (uno.length && unt.length) {
    let cnn = cn(nodes, uno);
    let scn = cnt(nodes, unt);
    while ((cnn.status === "wall" || scn.status === "wall") && uno.length && unt.length) {
      if (cnn.status === "wall") cnn = cn(nodes, uno);
      if (scn.status === "wall") scn = cnt(nodes, unt);
    }
    if (cnn.distance === Infinity || scn.otherdistance === Infinity) {
      return false;
    }
    ntanimate.push(cnn);
    ntanimate.push(scn);
    cnn.status = "visited";
    scn.status = "visited";
    if (vn[cnn.id]) {
      board.middleNode = cnn.id;
      return "success";
    } else if (vn[scn.id]) {
      board.middleNode = scn.id;
      return "success";
    } else if (cnn === scn) {
      board.middleNode = scn.id;
      return "success";
    }
    vn[cnn.id] = true;
    vn[scn.id] = true;
    unb(nodes, cnn, boardArray, target, name, start, heuristic);
    unbt(nodes, scn, boardArray, start, name, target, heuristic);
  }
}
//Function to return the Closest Node to a Given Node.
function cn(nodes, unvisitedNodes) {
  let cc, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!cc || cc.distance > nodes[unvisitedNodes[i]].distance) {
      cc = nodes[unvisitedNodes[i]];
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return cc;
}
function cnt(nodes, unvisitedNodes) {
  let cc, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!cc || cc.otherdistance > nodes[unvisitedNodes[i]].otherdistance) {
      cc = nodes[unvisitedNodes[i]];
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return cc;
}
//Function to Update Neighbors
function unb(nodes, node, boardArray, target, name, start, heuristic) {
  let nb = gn(node.id, nodes, boardArray);
  for (let neighbor of nb) {
    un(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
  }
}
//Updates neighbors
function unbt(nodes, node, boardArray, target, name, start, heuristic) {
  let nb = gn(node.id, nodes, boardArray);
  for (let neighbor of nb) {
    untwo(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
  }
}
//Function to Update Node.
function un(cnn, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = gd(cnn, targetNode);
  let weight = targetNode.weight === 15 ? 15 : 1;
  let dtc = cnn.distance + (weight + distance[0]) * manhattanDist(targetNode, actualTargetNode);
  if (dtc < targetNode.distance) {
    targetNode.distance = dtc;
    targetNode.previousNode = cnn.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
}

function untwo(cnn, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = gdt(cnn, targetNode);
  let weight = targetNode.weight === 15 ? 15 : 1;
  let dtc = cnn.otherdistance + (weight + distance[0]) * manhattanDist(targetNode, actualTargetNode);
  if (dtc < targetNode.otherdistance) {
    targetNode.otherdistance = dtc;
    targetNode.otherpreviousNode = cnn.id;
    targetNode.path = distance[1];
    targetNode.otherdirection = distance[2];
  }
}

//Function to Get Neighbors of a Node.
function gn(id, nodes, boardArray) {
  let coordinates = id.split("-");
  let x = parseInt(coordinates[0]);
  let y = parseInt(coordinates[1]);
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

//Gets distance between two nodes.
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

//Gets distance between two nodes.
function gdt(nodeOne, nodeTwo) {
  let ccrd = nodeOne.id.split("-");
  let tcrd = nodeTwo.id.split("-");
  let x1 = parseInt(ccrd[0]);
  let y1 = parseInt(ccrd[1]);
  let x2 = parseInt(tcrd[0]);
  let y2 = parseInt(tcrd[1]);
  if (x2 < x1) {
    if (nodeOne.otherdirection === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.otherdirection === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.otherdirection === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.otherdirection === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (nodeOne.otherdirection === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.otherdirection === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.otherdirection === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.otherdirection === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (nodeOne.otherdirection === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.otherdirection === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.otherdirection === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.otherdirection === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (nodeOne.otherdirection === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.otherdirection === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.otherdirection === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.otherdirection === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

//Function to return Manhattan Distance between two nodes.
function manhattanDist(nodeOne, nodeTwo) {
  let noc = nodeOne.id.split("-").map(ele => parseInt(ele));
  let ntc = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xChange = Math.abs(noc[0] - ntc[0]);
  let yChange = Math.abs(noc[1] - ntc[1]);
  return (xChange + yChange);
}

//Function to return Weighted Manhattan Distance.
function weightedManhattanDistance(nodeOne, nodeTwo, nodes) {
  let noc = nodeOne.id.split("-").map(ele => parseInt(ele));
  let ntc = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xChange = Math.abs(noc[0] - ntc[0]);
  let yChange = Math.abs(noc[1] - ntc[1]);

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
      xChange += axc;
      yChange += ayc;
    } else {
      xChange += oaxc;
      yChange += oayc;
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
      xChange += axc;
      yChange += ayc;
    } else {
      xChange += oaxc;
      yChange += oayc;
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
      xChange += axc;
      yChange += ayc;
    } else {
      xChange += oaxc;
      yChange += oayc;
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
        xChange += axc;
        yChange += ayc;
      } else {
        xChange += oaxc;
        yChange += oayc;
      }
    }


  return xChange + yChange;


}

module.exports = bidir;
