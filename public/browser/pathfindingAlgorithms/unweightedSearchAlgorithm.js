function unweightedSearchAlgorithm(nodes, start, target, nodesToAnimate, boardArray, name) {
  if (!start || !target || start === target) {
    return false;
  }
  let struct = [nodes[start]];
  let expn = {start: true};
  while (struct.length) {
    let cnn = name === "bfs" ? struct.shift() : struct.pop();
    nodesToAnimate.push(cnn);
    if (name === "dfs") expn[cnn.id] = true;
    cnn.status = "visited";
    if (cnn.id === target) {
      return "success";
    }
    let cnb = gn(cnn.id, nodes, boardArray, name);
    cnb.forEach(neighbor => {
      if (!expn[neighbor]) {
        if (name === "bfs") expn[neighbor] = true;
        nodes[neighbor].previousNode = cnn.id;
        struct.push(nodes[neighbor]);
      }
    });
  }
  return false;
}

//Function to Get Neighbors of a node.
function gn(id, nodes, boardArray, name) {
  let crd = id.split("-");
  let x = parseInt(crd[0]);
  let y = parseInt(crd[1]);
  let nb = [];
  let pn;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    pn = `${(x - 1).toString()}-${y.toString()}`
    if (nodes[pn].status !== "wall") {
      if (name === "bfs") {
        nb.push(pn);
      } else {
        nb.unshift(pn);
      }
    }
  }
  if (boardArray[x][y + 1]) {
    pn = `${x.toString()}-${(y + 1).toString()}`
    if (nodes[pn].status !== "wall") {
      if (name === "bfs") {
        nb.push(pn);
      } else {
        nb.unshift(pn);
      }
    }
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    pn = `${(x + 1).toString()}-${y.toString()}`
    if (nodes[pn].status !== "wall") {
      if (name === "bfs") {
        nb.push(pn);
      } else {
        nb.unshift(pn);
      }
    }
  }
  if (boardArray[x][y - 1]) {
    pn = `${x.toString()}-${(y - 1).toString()}`
    if (nodes[pn].status !== "wall") {
      if (name === "bfs") {
        nb.push(pn);
      } else {
        nb.unshift(pn);
      }
    }
  }
  return nb;
}

module.exports = unweightedSearchAlgorithm;
