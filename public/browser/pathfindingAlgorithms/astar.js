//Astar Algorithm
function astar(nodes, start, target, ntanimate, boardArray, name, heuristic) {
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].totalDistance = 0;
  nodes[start].direction = "up";
  let uvn = Object.keys(nodes);
  while (uvn.length) {
    let cnn = cn(nodes, uvn);
    while (cnn.status === "wall" && uvn.length) {
      cnn = cn(nodes, uvn)
    }
    if (cnn.distance === Infinity) return false;
    ntanimate.push(cnn);
    cnn.status = "visited";
    if (cnn.id === target) {
      return "success!";
    }
    unb(nodes, cnn, boardArray, target, name, start, heuristic);
  }
}
//Function to return the Closest Node.
function cn(nodes, uvn) {
  let cc, index;
  for (let i = 0; i < uvn.length; i++) {
    if (!cc || cc.totalDistance > nodes[uvn[i]].totalDistance) {
      cc = nodes[uvn[i]];
      index = i;
    } else if (cc.totalDistance === nodes[uvn[i]].totalDistance) {
      if (cc.heuristicDistance > nodes[uvn[i]].heuristicDistance) {
        cc = nodes[uvn[i]];
        index = i;
      }
    }
  }
  uvn.splice(index, 1);
  return cc;
}
//Function to Update the Neighbors
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
//Function to Update the Node.
function un(cnn, tn, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = gd(cnn, tn);
  if (!tn.heuristicDistance) tn.heuristicDistance = manhattanDist(tn, actualTargetNode);
  let distanceToCompare = cnn.distance + tn.weight + distance[0];
  if (distanceToCompare < tn.distance) {
    tn.distance = distanceToCompare;
    tn.totalDistance = tn.distance + tn.heuristicDistance;
    tn.previousNode = cnn.id;
    tn.path = distance[1];
    tn.direction = distance[2];
  }
}
//Function to Get Neighbors of a node.
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

//Function to Get Distance between Two Nodes.
function gd(nodeOne, nodeTwo) {
  let ccrd = nodeOne.id.split("-");
  let tcrd = nodeTwo.id.split("-");
  let x1 = parseInt(ccrd[0]);
  let y1 = parseInt(ccrd[1]);
  let x2 = parseInt(tcrd[0]);
  let y2 = parseInt(tcrd[1]);
  if (x2 < x1 && y1 === y2) {
    if (nodeOne.direction === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    } else if (nodeOne.direction === "up-right") {
      return [1.5, null, "up"];
    } else if (nodeOne.direction === "down-right") {
      return [2.5, null, "up"];
    } else if (nodeOne.direction === "up-left") {
      return [1.5, null, "up"];
    } else if (nodeOne.direction === "down-left") {
      return [2.5, null, "up"];
    }
  } else if (x2 > x1 && y1 === y2) {
    if (nodeOne.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.direction === "down") {
      return [1, ["f"], "down"];
    } else if (nodeOne.direction === "up-right") {
      return [2.5, null, "down"];
    } else if (nodeOne.direction === "down-right") {
      return [1.5, null, "down"];
    } else if (nodeOne.direction === "up-left") {
      return [2.5, null, "down"];
    } else if (nodeOne.direction === "down-left") {
      return [1.5, null, "down"];
    }
  }
  if (y2 < y1 && x1 === x2) {
    if (nodeOne.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.direction === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.direction === "down") {
      return [2, ["r", "f"], "left"];
    } else if (nodeOne.direction === "up-right") {
      return [2.5, null, "left"];
    } else if (nodeOne.direction === "down-right") {
      return [2.5, null, "left"];
    } else if (nodeOne.direction === "up-left") {
      return [1.5, null, "left"];
    } else if (nodeOne.direction === "down-left") {
      return [1.5, null, "left"];
    }
  } else if (y2 > y1 && x1 === x2) {
    if (nodeOne.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.direction === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.direction === "down") {
      return [2, ["l", "f"], "right"];
    } else if (nodeOne.direction === "up-right") {
      return [1.5, null, "right"];
    } else if (nodeOne.direction === "down-right") {
      return [1.5, null, "right"];
    } else if (nodeOne.direction === "up-left") {
      return [2.5, null, "right"];
    } else if (nodeOne.direction === "down-left") {
      return [2.5, null, "right"];
    }
  }
}
//Function to return Manhattan Distance between Two Nodes.
function manhattanDist(nodeOne, nodeTwo) {
  let noc = nodeOne.id.split("-").map(ele => parseInt(ele));
  let ntc = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xOne =noc[0];
  let xTwo = ntc[0];
  let yOne =noc[1];
  let yTwo = ntc[1];

  let xChange = Math.abs(xOne - xTwo);
  let yChange = Math.abs(yOne - yTwo);

  return (xChange + yChange);
}



module.exports = astar;
