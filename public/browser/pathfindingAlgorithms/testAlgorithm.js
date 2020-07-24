function test(nodes, start, target, ntanimate, boardArray, name, heuristic) {
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = "up";
  let unv = Object.keys(nodes);
  while (unv.length) {
    let cnn = cn(nodes, unv);
    while (cnn.status === "wall" && unv.length) {
      cnn = cn(nodes, unv)
    }
    if (cnn.distance === Infinity) return false;
    cnn.status = "visited";
    if (cnn.id === target) {
      while (cnn.id !== start) {
        ntanimate.unshift(cnn);
        cnn = nodes[cnn.previousNode];
      }
      return "success!";
    }
    if (name === "astar" || name === "greedy") {
      unb(nodes, cnn, boardArray, target, name, start, heuristic);
    } else if (name === "dijkstra") {
      unb(nodes, cnn, boardArray);
    }
  }
}

//Function to return Closest Node
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

//Function to Update Neighbors of a node.
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
//Returns no. of Average nodes in between.
function anonb(cnn) {
  let num = 0;
  while (cnn.previousNode) {
    num++;
    cnn = cnn.previousNode;
  }
  return num;
}

//Function to Update a node.
function un(cnn, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = gd(cnn, targetNode);
  let dtc;
  if (actualTargetNode && name === "astar") {
    if (heuristic === "manhattanDist") {
      dtc = cnn.distance + targetNode.weight + distance[0] + manhattanDist(targetNode, actualTargetNode);
    } else if (heuristic === "poweredManhattanDistance") {
      dtc = cnn.distance + targetNode.weight + distance[0] + Math.pow(manhattanDist(targetNode, actualTargetNode), 3);
    } else if (heuristic === "extraPoweredManhattanDistance") {
      dtc = cnn.distance + targetNode.weight + distance[0] + Math.pow(manhattanDist(targetNode, actualTargetNode), 5);
    }
    let snmd = manhattanDist(actualStartNode, actualTargetNode);
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

//Function to Get Neighbors of a node.
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

//Gets Distance betweeen two nodes.
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

//Returns Manhattan Distance between two nodes.
function manhattanDist(nodeOne, nodeTwo) {
  let noc = nodeOne.id.split("-").map(ele => parseInt(ele));
  let ntc = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xChange = Math.abs(noc[0] - ntc[0]);
  let yChange = Math.abs(noc[1] - ntc[1]);
  return (xChange + yChange);
}

module.exports = test;
