const Node = require("./node");
const launchAnimations = require("./animations/launchAnimations");
const launchInstantAnimations = require("./animations/launchInstantAnimations");
const mazeGenerationAnimations = require("./animations/mazeGenerationAnimations");
const weightedSearchAlgorithm = require("./pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("./pathfindingAlgorithms/unweightedSearchAlgorithm");
const recursiveDivisionMaze = require("./mazeAlgorithms/recursiveDivisionMaze");
const otherMaze = require("./mazeAlgorithms/otherMaze");
const otherOtherMaze = require("./mazeAlgorithms/otherOtherMaze");
const astar = require("./pathfindingAlgorithms/astar");
const stairDemonstration = require("./mazeAlgorithms/stairDemonstration");
const weightsDemonstration = require("./mazeAlgorithms/weightsDemonstration");
const simpleDemonstration = require("./mazeAlgorithms/simpleDemonstration");
const bidirectional = require("./pathfindingAlgorithms/bidirectional");
const getDistance = require("./getDistance");

function Board(height, width) {
  this.height = height;
  this.width = width;
  this.start = null;
  this.target = null;
  this.object = null;
  this.boardArray = [];
  this.nodes = {};
  this.nodesToAnimate = [];
  this.objectNodesToAnimate = [];
  this.shortestPathNodesToAnimate = [];
  this.objectShortestPathNodesToAnimate = [];
  this.wallsToAnimate = [];
  this.mouseDown = false;
  this.pressedNodeStatus = "normal";
  this.previouslyPressedNodeStatus = null;
  this.previouslySwitchedNode = null;
  this.previouslySwitchedNodeWeight = 0;
  this.keyDown = false;
  this.algoDone = false;
  this.currentAlgorithm = null;
  this.currentHeuristic = null;
  this.numberOfObjects = 0;
  this.isObject = false;
  this.buttonsOn = false;
  this.speed = "fastar";
}

Board.prototype.initialise = function() {
  this.createGrid();
  this.addEventListeners();
  this.toggleTutorialButtons();
};

Board.prototype.createGrid = function() {
  let tht = "";
  for (let r = 0; r < this.height; r++) {
    let car = [];
    let chr = `<tr id="row ${r}">`;
    for (let c = 0; c < this.width; c++) {
      let nni = `${r}-${c}`, newNodeClass, newNode;
      if (r === Math.floor(this.height / 7) && c === Math.floor(this.width / 9)) {
        newNodeClass = "start";
        this.start = `${nni}`;
      } else if (r === Math.floor(this.height / 7) && c === Math.floor(3 * this.width / 9) {
        newNodeClass = "target";
        this.target = `${nni}`;
      } else {
        newNodeClass = "unvisited";
      }
      newNode = new Node(nni, newNodeClass);
      car.push(newNode);
      chr += `<td id="${nni}" class="${newNodeClass}"></td>`;
      this.nodes[`${nni}`] = newNode;
    }
    this.boardArray.push(car);
    tht += `${chr}</tr>`;
  }
  let board = document.getElementById("board");
  board.innerHTML = tht;
};

Board.prototype.addEventListeners = function() {
  let board = this;
  for (let r = 0; r < board.height; r++) {
    for (let c = 0; c < board.width; c++) {
      let cii = `${r}-${c}`;
      let cnn = board.getNode(cii);
      let cel = document.getElementById(cii);
      cel.onmousedown = (e) => {
        e.preventDefault();
        if (this.buttonsOn) {
          board.mouseDown = true;
          if (cnn.status === "start" || cnn.status === "target" || cnn.status === "object") {
            board.pressedNodeStatus = cnn.status;
          } else {
            board.pressedNodeStatus = "normal";
            board.changeNormalNode(cnn);
          }
        }
      }
      cel.onmouseup = () => {
        if (this.buttonsOn) {
          board.mouseDown = false;
          if (board.pressedNodeStatus === "target") {
            board.target = cii;
          } else if (board.pressedNodeStatus === "start") {
            board.start = cii;
          } else if (board.pressedNodeStatus === "object") {
            board.object = cii;
          }
          board.pressedNodeStatus = "normal";
        }
      }
      cel.onmouseenter = () => {
        if (this.buttonsOn) {
          if (board.mouseDown && board.pressedNodeStatus !== "normal") {
            board.changeSpecialNode(cnn);
            if (board.pressedNodeStatus === "target") {
              board.target = cii;
              if (board.algoDone) {
                board.redoAlgorithm();
              }
            } else if (board.pressedNodeStatus === "start") {
              board.start = cii;
              if (board.algoDone) {
                board.redoAlgorithm();
              }
            } else if (board.pressedNodeStatus === "object") {
              board.object = cii;
              if (board.algoDone) {
                board.redoAlgorithm();
              }
            }
          } else if (board.mouseDown) {
            board.changeNormalNode(cnn);
          }
        }
      }
      cel.onmouseleave = () => {
        if (this.buttonsOn) {
          if (board.mouseDown && board.pressedNodeStatus !== "normal") {
            board.changeSpecialNode(cnn);
          }
        }
      }
    }
  }
};

Board.prototype.getNode = function(id) {
  let crd = id.split("-");
  let r = parseInt(crd[0]);
  let c = parseInt(crd[1]);
  return this.boardArray[r][c];
};

Board.prototype.changeSpecialNode = function(cnn) {
  let element = document.getElementById(cnn.id), previousElement;
  if (this.previouslySwitchedNode) previousElement = document.getElementById(this.previouslySwitchedNode.id);
  if (cnn.status !== "target" && cnn.status !== "start" && cnn.status !== "object") {
    if (this.previouslySwitchedNode) {
      this.previouslySwitchedNode.status = this.previouslyPressedNodeStatus;
      previousElement.className = this.previouslySwitchedNodeWeight === 15 ?
      "unvisited weight" : this.previouslyPressedNodeStatus;
      this.previouslySwitchedNode.weight = this.previouslySwitchedNodeWeight === 15 ?
      15 : 0;
      this.previouslySwitchedNode = null;
      this.previouslySwitchedNodeWeight = cnn.weight;

      this.previouslyPressedNodeStatus = cnn.status;
      element.className = this.pressedNodeStatus;
      cnn.status = this.pressedNodeStatus;

      cnn.weight = 0;
    }
  } else if (cnn.status !== this.pressedNodeStatus && !this.algoDone) {
    this.previouslySwitchedNode.status = this.pressedNodeStatus;
    previousElement.className = this.pressedNodeStatus;
  } else if (cnn.status === this.pressedNodeStatus) {
    this.previouslySwitchedNode = cnn;
    element.className = this.previouslyPressedNodeStatus;
    cnn.status = this.previouslyPressedNodeStatus;
  }
};

Board.prototype.changeNormalNode = function(cnn) {
  let element = document.getElementById(cnn.id);
  let rss = ["start", "target", "object"];
  let uwa = ["dfs", "bfs"]
  if (!this.keyDown) {
    if (!rss.includes(cnn.status)) {
      element.className = cnn.status !== "wall" ?
        "wall" : "unvisited";
      cnn.status = element.className !== "wall" ?
        "unvisited" : "wall";
      cnn.weight = 0;
    }
  } else if (this.keyDown === 87 && !uwa.includes(this.currentAlgorithm)) {
    if (!rss.includes(cnn.status)) {
      element.className = cnn.weight !== 15 ?
        "unvisited weight" : "unvisited";
      cnn.weight = element.className !== "unvisited weight" ?
        0 : 15;
      cnn.status = "unvisited";
    }
  }
};

Board.prototype.drawShortestPath = function(tni, startNodeId, object) {
  let cnn;
  if (this.currentAlgorithm !== "bidirectional") {
    cnn = this.nodes[this.nodes[tni].previousNode];
    if (object) {
      while (cnn.id !== startNodeId) {
        this.objectShortestPathNodesToAnimate.unshift(cnn);
        cnn = this.nodes[cnn.previousNode];
      }
    } else {
      while (cnn.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(cnn);
        document.getElementById(cnn.id).className = `shortest-path`;
        cnn = this.nodes[cnn.previousNode];
      }
    }
  } else {
    if (this.middleNode !== this.target && this.middleNode !== this.start) {
      cnn = this.nodes[this.nodes[this.middleNode].previousNode];
      scn = this.nodes[this.nodes[this.middleNode].otherpreviousNode];
      if (scn.id === this.target) {
        this.nodes[this.target].direction = getDistance(this.nodes[this.middleNode], this.nodes[this.target])[2];
      }
      if (this.nodes[this.middleNode].weight === 0) {
        document.getElementById(this.middleNode).className = `shortest-path`;
      } else {
        document.getElementById(this.middleNode).className = `shortest-path weight`;
      }
      while (cnn.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(cnn);
        document.getElementById(cnn.id).className = `shortest-path`;
        cnn = this.nodes[cnn.previousNode];
      }
      while (scn.id !== tni) {
        this.shortestPathNodesToAnimate.unshift(scn);
        document.getElementById(scn.id).className = `shortest-path`;
        if (scn.otherpreviousNode === tni) {
          if (scn.otherdirection === "left") {
            scn.direction = "right";
          } else if (scn.otherdirection === "right") {
            scn.direction = "left";
          } else if (scn.otherdirection === "up") {
            scn.direction = "down";
          } else if (scn.otherdirection === "down") {
            scn.direction = "up";
          }
          this.nodes[this.target].direction = getDistance(scn, this.nodes[this.target])[2];
        }
        scn = this.nodes[scn.otherpreviousNode]
      }
    } else {
      document.getElementById(this.nodes[this.target].previousNode).className = `shortest-path`;
    }
  }
};

Board.prototype.addShortestPath = function(tni, startNodeId, object) {
  let cnn = this.nodes[this.nodes[tni].previousNode];
  if (object) {
    while (cnn.id !== startNodeId) {
      this.objectShortestPathNodesToAnimate.unshift(cnn);
      cnn.relatesToObject = true;
      cnn = this.nodes[cnn.previousNode];
    }
  } else {
    while (cnn.id !== startNodeId) {
      this.shortestPathNodesToAnimate.unshift(cnn);
      cnn = this.nodes[cnn.previousNode];
    }
  }
};

Board.prototype.drawShortestPathTimeout = function(tni, startNodeId, type, object) {
  let board = this;
  let cnn;
  let scn;
  let cnnsToAnimate;

  if (board.currentAlgorithm !== "bidirectional") {
    cnn = board.nodes[board.nodes[tni].previousNode];
    if (object) {
      board.objectShortestPathNodesToAnimate.push("object");
      cnnsToAnimate = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      cnnsToAnimate = [];
      while (cnn.id !== startNodeId) {
        cnnsToAnimate.unshift(cnn);
        cnn = board.nodes[cnn.previousNode];
      }
    }
  } else {
    if (board.middleNode !== board.target && board.middleNode !== board.start) {
      cnn = board.nodes[board.nodes[board.middleNode].previousNode];
      scn = board.nodes[board.nodes[board.middleNode].otherpreviousNode];
      if (scn.id === board.target) {
        board.nodes[board.target].direction = getDistance(board.nodes[board.middleNode], board.nodes[board.target])[2];
      }
      if (object) {

      } else {
        cnnsToAnimate = [];
        board.nodes[board.middleNode].direction = getDistance(cnn, board.nodes[board.middleNode])[2];
        while (cnn.id !== startNodeId) {
          cnnsToAnimate.unshift(cnn);
          cnn = board.nodes[cnn.previousNode];
        }
        cnnsToAnimate.push(board.nodes[board.middleNode]);
        while (scn.id !== tni) {
          if (scn.otherdirection === "left") {
            scn.direction = "right";
          } else if (scn.otherdirection === "right") {
            scn.direction = "left";
          } else if (scn.otherdirection === "up") {
            scn.direction = "down";
          } else if (scn.otherdirection === "down") {
            scn.direction = "up";
          }
          cnnsToAnimate.push(scn);
          if (scn.otherpreviousNode === tni) {
            board.nodes[board.target].direction = getDistance(scn, board.nodes[board.target])[2];
          }
          scn = board.nodes[scn.otherpreviousNode]
        }
    }
  } else {
    cnnsToAnimate = [];
    let target = board.nodes[board.target];
    cnnsToAnimate.push(board.nodes[target.previousNode], target);
  }

}


  tot(0);

  function tot(index) {
    if (!cnnsToAnimate.length) cnnsToAnimate.push(board.nodes[board.start]);
    setTimeout(function () {
      if (index === 0) {
        spc(cnnsToAnimate[index]);
      } else if (index < cnnsToAnimate.length) {
        spc(cnnsToAnimate[index], cnnsToAnimate[index - 1]);
      } else if (index === cnnsToAnimate.length) {
        spc(board.nodes[board.target], cnnsToAnimate[index - 1], "isActualTarget");
      }
      if (index > cnnsToAnimate.length) {
        board.toggleButtons();
        return;
      }
      tot(index + 1);
    }, 40)
  }


  function spc(cnn, previousNode, isActualTarget) {
    if (cnn === "object") {
      let element = document.getElementById(board.object);
      element.className = "objectTransparent";
    } else if (cnn.id !== board.start) {
      if (cnn.id !== board.target || cnn.id === board.target && isActualTarget) {
        let chn = document.getElementById(cnn.id);
        if (type === "unweighted") {
          chn.className = "shortest-path-unweighted";
        } else {
          let direction;
          if (cnn.relatesToObject && !cnn.overwriteObjectRelation && cnn.id !== board.target) {
            direction = "storedDirection";
            cnn.overwriteObjectRelation = true;
          } else {
            direction = "direction";
          }
          if (cnn[direction] === "up") {
            chn.className = "shortest-path-up";
          } else if (cnn[direction] === "down") {
            chn.className = "shortest-path-down";
          } else if (cnn[direction] === "right") {
            chn.className = "shortest-path-right";
          } else if (cnn[direction] === "left") {
            chn.className = "shortest-path-left";
          } else {
            chn.className = "shortest-path";
          }
        }
      }
    }
    if (previousNode) {
      if (previousNode !== "object" && previousNode.id !== board.target && previousNode.id !== board.start) {
        let previousHTMLNode = document.getElementById(previousNode.id);
        previousHTMLNode.className = previousNode.weight === 15 ? "shortest-path weight" : "shortest-path";
      }
    } else {
      let element = document.getElementById(board.start);
      element.className = "startTransparent";
    }
  }





};

Board.prototype.createMazeOne = function(type) {
  Object.keys(this.nodes).forEach(node => {
    let random = Math.random();
    let chn = document.getElementById(node);
    let rcn = ["start", "target", "object"]
    let randomTwo = type === "wall" ? 0.25 : 0.35;
    if (random < randomTwo && !rcn.includes(chn.className)) {
      if (type === "wall") {
        chn.className = "wall";
        this.nodes[node].status = "wall";
        this.nodes[node].weight = 0;
      } else if (type === "weight") {
        chn.className = "unvisited weight";
        this.nodes[node].status = "unvisited";
        this.nodes[node].weight = 15;
      }
    }
  });
};

Board.prototype.clearPath = function(clickedButton) {
  if (clickedButton) {
    let start = this.nodes[this.start];
    let target = this.nodes[this.target];
    let object = this.numberOfObjects ? this.nodes[this.object] : null;
    start.status = "start";
    document.getElementById(start.id).className = "start";
    target.status = "target";
    document.getElementById(target.id).className = "target";
    if (object) {
      object.status = "object";
      document.getElementById(object.id).className = "object";
    }
  }

  document.getElementById("startButtonStart").onclick = () => {
    if (!this.currentAlgorithm) {
      document.getElementById("startButtonStart").innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>'
    } else {
      this.clearPath("clickedButton");
      this.toggleButtons();
      let wa = ["dijkstra", "CLA", "greedy"];
      let uwa = ["dfs", "bfs"];
      let scc;
      if (this.currentAlgorithm === "bidirectional") {
        if (!this.numberOfObjects) {
          scc = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
          launchAnimations(this, scc, "weighted");
        } else {
          this.isObject = true;
        }
        this.algoDone = true;
      } else if (this.currentAlgorithm === "astar") {
        if (!this.numberOfObjects) {
          scc = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
          launchAnimations(this, scc, "weighted");
        } else {
          this.isObject = true;
          scc = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
          launchAnimations(this, scc, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
        }
        this.algoDone = true;
      } else if (wa.includes(this.currentAlgorithm)) {
        if (!this.numberOfObjects) {
          scc = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
          launchAnimations(this, scc, "weighted");
        } else {
          this.isObject = true;
          scc = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
          launchAnimations(this, scc, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
        }
        this.algoDone = true;
      } else if (uwa.includes(this.currentAlgorithm)) {
        if (!this.numberOfObjects) {
          scc = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
          launchAnimations(this, scc, "unweighted");
        } else {
          this.isObject = true;
          scc = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
          launchAnimations(this, scc, "unweighted", "object", this.currentAlgorithm);
        }
        this.algoDone = true;
      }
    }
  }

  this.algoDone = false;
  Object.keys(this.nodes).forEach(id => {
    let cnn = this.nodes[id];
    cnn.previousNode = null;
    cnn.distance = Infinity;
    cnn.totalDistance = Infinity;
    cnn.heuristicDistance = null;
    cnn.direction = null;
    cnn.storedDirection = null;
    cnn.relatesToObject = false;
    cnn.overwriteObjectRelation = false;
    cnn.otherpreviousNode = null;
    cnn.otherdistance = Infinity;
    cnn.otherdirection = null;
    let chn = document.getElementById(id);
    let rss = ["wall", "start", "target", "object"];
    if ((!rss.includes(cnn.status) || chn.className === "visitedobject") && cnn.weight !== 15) {
      cnn.status = "unvisited";
      chn.className = "unvisited";
    } else if (cnn.weight === 15) {
      cnn.status = "unvisited";
      chn.className = "unvisited weight";
    }
  });
};

Board.prototype.clearWalls = function() {
  this.clearPath("clickedButton");
  Object.keys(this.nodes).forEach(id => {
    let cnn = this.nodes[id];
    let chn = document.getElementById(id);
    if (cnn.status === "wall" || cnn.weight === 15) {
      cnn.status = "unvisited";
      cnn.weight = 0;
      chn.className = "unvisited";
    }
  });
}

Board.prototype.clearWeights = function() {
  Object.keys(this.nodes).forEach(id => {
    let cnn = this.nodes[id];
    let chn = document.getElementById(id);
    if (cnn.weight === 15) {
      cnn.status = "unvisited";
      cnn.weight = 0;
      chn.className = "unvisited";
    }
  });
}

Board.prototype.clearNodeStatuses = function() {
  Object.keys(this.nodes).forEach(id => {
    let cnn = this.nodes[id];
    cnn.previousNode = null;
    cnn.distance = Infinity;
    cnn.totalDistance = Infinity;
    cnn.heuristicDistance = null;
    cnn.storedDirection = cnn.direction;
    cnn.direction = null;
    let rss = ["wall", "start", "target", "object"];
    if (!rss.includes(cnn.status)) {
      cnn.status = "unvisited";
    }
  })
};

Board.prototype.instantAlgorithm = function() {
  let wa = ["dijkstra", "CLA", "greedy"];
  let uwa = ["dfs", "bfs"];
  let scc;
  if (this.currentAlgorithm === "bidirectional") {
    if (!this.numberOfObjects) {
      scc = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
      launchInstantAnimations(this, scc, "weighted");
    } else {
      this.isObject = true;
    }
    this.algoDone = true;
  } else if (this.currentAlgorithm === "astar") {
    if (!this.numberOfObjects) {
      scc = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
      launchInstantAnimations(this, scc, "weighted");
    } else {
      this.isObject = true;
      scc = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
      launchInstantAnimations(this, scc, "weighted", "object", this.currentAlgorithm);
    }
    this.algoDone = true;
  }
  if (wa.includes(this.currentAlgorithm)) {
    if (!this.numberOfObjects) {
      scc = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
      launchInstantAnimations(this, scc, "weighted");
    } else {
      this.isObject = true;
      scc = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
      launchInstantAnimations(this, scc, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
    }
    this.algoDone = true;
  } else if (uwa.includes(this.currentAlgorithm)) {
    if (!this.numberOfObjects) {
      scc = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
      launchInstantAnimations(this, scc, "unweighted");
    } else {
      this.isObject = true;
      scc = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
      launchInstantAnimations(this, scc, "unweighted", "object", this.currentAlgorithm);
    }
    this.algoDone = true;
  }
};

Board.prototype.redoAlgorithm = function() {
  this.clearPath();
  this.instantAlgorithm();
};

Board.prototype.reset = function(objectNotTransparent) {
  this.nodes[this.start].status = "start";
  document.getElementById(this.start).className = "startTransparent";
  this.nodes[this.target].status = "target";
  if (this.object) {
    this.nodes[this.object].status = "object";
    if (objectNotTransparent) {
      document.getElementById(this.object).className = "visitedObjectNode";
    } else {
      document.getElementById(this.object).className = "objectTransparent";
    }
  }
};

Board.prototype.resetHTMLNodes = function() {
  let start = document.getElementById(this.start);
  let target = document.getElementById(this.target);
  start.className = "start";
  target.className = "target";
};

Board.prototype.changeStartNodeImages = function() {
  let unweighted = ["bfs", "dfs"];
  let strikethrough = ["bfs", "dfs"];
  let guaranteed = ["dijkstra", "astar"];
  let name = "";
  if (this.currentAlgorithm === "bfs") {
    name = "Breath-first Search";
  } else if (this.currentAlgorithm === "dfs") {
    name = "Depth-first Search";
  } else if (this.currentAlgorithm === "dijkstra") {
    name = "Dijkstra's Algorithm";
  } else if (this.currentAlgorithm === "astar") {
    name = "A* Search";
  } else if (this.currentAlgorithm === "greedy") {
    name = "Greedy Best-first Search";
  } else if (this.currentAlgorithm === "CLA" && this.currentHeuristic !== "extraPoweredManhattanDistance") {
    name = "CDA Algorithm";
  } else if (this.currentAlgorithm === "CLA" && this.currentHeuristic === "extraPoweredManhattanDistance") {
    name = "Convergent CDA Algorithm";
  } else if (this.currentAlgorithm === "bidirectional") {
    name = "Bidirectional CDA Algorithm";
  }
  if (unweighted.includes(this.currentAlgorithm)) {
    if (this.currentAlgorithm === "dfs") {
      document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>unweighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
    } else {
      document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>unweighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
    }
    document.getElementById("weightLegend").className = "strikethrough";
    for (let i = 0; i < 14; i++) {
      let j = i.toString();
      let bgi = document.styleSheets["1"].rules[j].style.bgi;
      document.styleSheets["1"].rules[j].style.bgi = bgi.replace("triangle", "spaceship");
    }
  } else {
    if (this.currentAlgorithm === "greedy" || this.currentAlgorithm === "CLA") {
      document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
    }
    document.getElementById("weightLegend").className = "";
    for (let i = 0; i < 14; i++) {
      let j = i.toString();
      let bgi = document.styleSheets["1"].rules[j].style.bgi;
      document.styleSheets["1"].rules[j].style.bgi = bgi.replace("spaceship", "triangle");
    }
  }
  if (this.currentAlgorithm === "bidirectional") {

    document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
    document.getElementById("bombLegend").className = "strikethrough";
    document.getElementById("startButtonAddObject").className = "navbar-inverse navbar-nav disabledA";
  } else {
    document.getElementById("bombLegend").className = "";
    document.getElementById("startButtonAddObject").className = "navbar-inverse navbar-nav";
  }
  if (guaranteed.includes(this.currentAlgorithm)) {
    document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
  }
};

let counter = 1;
Board.prototype.toggleTutorialButtons = function() {

  document.getElementById("skipButton").onclick = () => {
    document.getElementById("tutorial").style.display = "none";
    this.toggleButtons();
  }

  if (document.getElementById("nextButton")) {
    document.getElementById("nextButton").onclick = () => {
      if (counter < 9) counter++;
      nextPreviousClick();
      this.toggleTutorialButtons();
    }
  }

  document.getElementById("previousButton").onclick = () => {
    if (counter > 1) counter--;
    nextPreviousClick();
    this.toggleTutorialButtons()
  }

  let board = this;
  function nextPreviousClick() {
    if (counter === 1) {
      document.getElementById("tutorial").innerHTML = `<h3>WELCOME TO MARS!</h3><h6>This short tutorial will familiarize you how to navigate on the surface of Mars through all of the features of this Web Application.</h6><p>If you want to dive right in, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"!</p><div id="tutorialCounter">1/9</div><img id="mainTutorialImage" src="public/styling/c_icon.png"><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 2) {
      document.getElementById("tutorial").innerHTML = `<h3>PATHFINDING ALGORITHM</h3><h6> A pathfinding algorithm seeks to find the "Shortest Path" between two points. This Web Application visualizes various pathfinding algorithms in action and more!</h6><p>All of the algorithms on this Web Application are adapted for a 2D grid, where 90 degree turns and movements from a node to another have a "cost" of 1.</p><div id="tutorialCounter">${counter}/9</div><img id="mainTutorialImage" src="public/styling/path.PNG"><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 3) {
      document.getElementById("tutorial").innerHTML = `<h3>HOW TO PICK AN ALGORITHM?</h3><h6>Choose an algorithm from the "Algorithms" drop-down menu.</h6><p>Note that some Algorithms are <i><b>Unweighted</b></i>, while others are <i><b>Weighted</b></i>. Unweighted Algorithms do not take turns or weight nodes into account, whereas Weighted ones do. </p><img id="secondTutorialImage" src="public/styling/algorithms.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 4) {
      document.getElementById("tutorial").innerHTML = `<h3>LET'S HAVE A LOOK OVER THE ALGORITHMS!</h3><h6>Not all algorithms are created equal.</h6><ul><li><b>Dijkstra's Algorithm</b> (weighted): The father of PathFinding Algorithms; guarantees the Shortest Path</li><li><b>A* Search</b> (weighted): Arguably the best PathFinding Algorithm; uses Heuristics to guarantee the Shortest Path much fastarer than Dijkstra's Algorithm</li><li><b>Greedy Best-first Search</b> (weighted): A fastarer, more Heuristic-Heavy Version of A*</li><li><b>CDA Algorithm</b> (weighted): a combination of Dijkstra's Algorithm and A*</li><li><b>Convergent CDA Algorithm</b> (weighted): The fastarer, more Heuristic-Heavy version of CDA</li><li><b>Bidirectional CDA Algorithm</b> (weighted): CDA(Combination of Dijkstra's and A*) from both sides</li><li><b>Breath-first Search</b> (unweighted): A great Algorithm; guarantees the Shortest path</li><li><b>Depth-first Search</b> (unweighted): An algorithm for pathfinding; which is leastar taken into consideration</li></ul><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 5) {
      document.getElementById("tutorial").innerHTML = `<h3>CREATING OBSTACLES AND CRATERS</h3><h6>Click on the grid to add an Obstacle. Right Click on the grid while pressing W(on the keyboard) to add a Crater. Generate Mazes and Patterns from the "Mazes & Patterns" drop-down menu.</h6><p>Obstacles are Impenetrable, meaning that a path cannot cross through them. Craters, however, are not impassable. They are simply more "costly" to move through. In this Web Application, Moving through a Crater node will result in the decrement in the amount of Energy of the Rover at the rate of 20%.</p><img id="secondTutorialImage" src="public/styling/walls.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 6) {
      document.getElementById("tutorial").innerHTML = `<h3>RESEARCH SITE</h3><h6>Click the "ADD ADDITIONAL STATION NODE" button.</h6><p>Adding a 'Additional Station Node' will change the course of the chosen algorithm. In other words, the algorithm will first look for the 'Additional Station Node' in an effort to collect the Soil Samples and to Survey the Mars' Surface. While Collecting and Surveying, the Rover's High Resolution Camera will capture the Snaps which will be sent back to the Earth and then it will look for the Target Node(Destination). Note that the Bidirectional CDA Algorithm does not support adding an Additional station Node.</p><img id="secondTutorialImage" src="public/styling/bomb.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 7) {
      document.getElementById("tutorial").innerHTML = `<h3>DRAGGING NODES</h3><h6>Click and drag the Start Node(Source), Target node(Destination) and Additional Station Node to move them.</h6><p>Note that you can drag nodes even after an Algorithm has finished running. This will allow you to instantly see Different Paths.</p><img src="public/styling/dragging.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 8) {
      document.getElementById("tutorial").innerHTML = `<h3>VISUALIZING AND MORE!</h3><h6>You can use the Navigation Bar buttons to visualize Algorithms and to do other stuff!</h6><p>You can clear the Current Path, clear Obstacles and Craters, clear the complete Environment, and adjust the Visualization Speed, all from the Navigation bar. If you want to access this tutorial again, click on "TECHNOCRATS ON MARS" in the top left corner of your screen.</p><img id="secondTutorialImage" src="public/styling/navbar.PNG"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 9) {
      document.getElementById("tutorial").innerHTML = `<h3>GET SET GO!</h3><h6>We hope you enjoy finding the Shortest Paths while Navigating your Rover on the Mars' Surface </h6><p>Project Hosted on <a href="https://github.com/https-github-com-sakshipatel-515/Technocrats_mars_rover">github</a>.</p><div id="tutorialCounter">${counter}/9</div><button id="finishButton" class="btn btn-default navbar-btn" type="button">Finish</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      document.getElementById("finishButton").onclick = () => {
        document.getElementById("tutorial").style.display = "none";
        board.toggleButtons();
      }
    }
  }

};

Board.prototype.toggleButtons = function() {
  document.getElementById("refreshButton").onclick = () => {
    window.location.reload(true);
  }

  if (!this.buttonsOn) {
    this.buttonsOn = true;

    document.getElementById("startButtonStart").onclick = () => {
      if (!this.currentAlgorithm) {
        document.getElementById("startButtonStart").innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>'
      } else {
        this.clearPath("clickedButton");
        this.toggleButtons();
        let wa = ["dijkstra", "CLA", "CLA", "greedy"];
        let uwa = ["dfs", "bfs"];
        let scc;
        if (this.currentAlgorithm === "bidirectional") {
          if (!this.numberOfObjects) {
            scc = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
            launchAnimations(this, scc, "weighted");
          } else {
            this.isObject = true;
            scc = bidirectional(this.nodes, this.start, this.object, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
            launchAnimations(this, scc, "weighted");
          }
          this.algoDone = true;
        } else if (this.currentAlgorithm === "astar") {
          if (!this.numberOfObjects) {
            scc = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, scc, "weighted");
          } else {
            this.isObject = true;
            scc = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, scc, "weighted", "object", this.currentAlgorithm);
          }
          this.algoDone = true;
        } else if (wa.includes(this.currentAlgorithm)) {
          if (!this.numberOfObjects) {
            scc = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, scc, "weighted");
          } else {
            this.isObject = true;
            scc = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, scc, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
          }
          this.algoDone = true;
        } else if (uwa.includes(this.currentAlgorithm)) {
          if (!this.numberOfObjects) {
            scc = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
            launchAnimations(this, scc, "unweighted");
          } else {
            this.isObject = true;
            scc = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
            launchAnimations(this, scc, "unweighted", "object", this.currentAlgorithm);
          }
          this.algoDone = true;
        }
      }
    }

    document.getElementById("adjustFastar").onclick = () => {
      this.speed = "fastar";
      document.getElementById("adjustSpeed").innerHTML = 'Speed: Fastar<span class="caret"></span>';
    }

    document.getElementById("adjustAverage").onclick = () => {
      this.speed = "average";
      document.getElementById("adjustSpeed").innerHTML = 'Speed: Average<span class="caret"></span>';
    }

    document.getElementById("adjustSlow").onclick = () => {
      this.speed = "slow";
      document.getElementById("adjustSpeed").innerHTML = 'Speed: Slow<span class="caret"></span>';
    }

    document.getElementById("startStairDemonstration").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.toggleButtons();
      stairDemonstration(this);
      mazeGenerationAnimations(this);
    }


    document.getElementById("startButtonBidirectional").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Bidirectional CDA!</button>'
      this.currentAlgorithm = "bidirectional";
      this.currentHeuristic = "manhattanDistance";
      if (this.numberOfObjects) {
        let oni = this.object;
        document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add Additional Station Node</a></li>';
        document.getElementById(oni).className = "unvisited";
        this.object = null;
        this.numberOfObjects = 0;
        this.nodes[oni].status = "unvisited";
        this.isObject = false;
      }
      this.clearPath("clickedButton");
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonDijkstra").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Dijkstra\'s!</button>'
      this.currentAlgorithm = "dijkstra";
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonAStar").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize CDA!</button>'
      this.currentAlgorithm = "CLA";
      this.currentHeuristic = "manhattanDistance"
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonAStar2").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize A*!</button>'
      this.currentAlgorithm = "astar";
      this.currentHeuristic = "poweredManhattanDistance"
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonAStar3").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Convergent CDA!</button>'
      this.currentAlgorithm = "CLA";
      this.currentHeuristic = "extraPoweredManhattanDistance"
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonGreedy").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Greedy!</button>'
      this.currentAlgorithm = "greedy";
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonBFS").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize BFS!</button>'
      this.currentAlgorithm = "bfs";
      this.clearWeights();
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonDFS").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize DFS!</button>'
      this.currentAlgorithm = "dfs";
      this.clearWeights();
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonCreateMazeOne").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.createMazeOne("wall");
    }

    document.getElementById("startButtonCreateMazeTwo").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.toggleButtons();
      recursiveDivisionMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false, "wall");
      mazeGenerationAnimations(this);
    }

    document.getElementById("startButtonCreateMazeWeights").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.createMazeOne("weight");
    }

    document.getElementById("startButtonClearBoard").onclick = () => {
      document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add Additional Station Node</a></li>';



      let nbh = document.getElementById("navbarDiv").clientHeight;
      let th = document.getElementById("mainText").clientHeight + document.getElementById("algorithmDescriptor").clientHeight;
      let height = Math.floor((document.documentElement.clientHeight - nbh - th) / 28);
      let width = Math.floor(document.documentElement.clientWidth / 25);
      let start = Math.floor(height / 2).toString() + "-" + Math.floor(width / 4).toString();
      let target = Math.floor(height / 2).toString() + "-" + Math.floor(3 * width / 4).toString();

        Object.keys(this.nodes).forEach(id => {
          let cnn = this.nodes[id];
          let chn = document.getElementById(id);
          if (id === start) {
            chn.className = "start";
            cnn.status = "start";
          } else if (id === target) {
            chn.className = "target";
            cnn.status = "target"
          } else {
            chn.className = "unvisited";
            cnn.status = "unvisited";
          }
          cnn.previousNode = null;
          cnn.path = null;
          cnn.direction = null;
          cnn.storedDirection = null;
          cnn.distance = Infinity;
          cnn.totalDistance = Infinity;
          cnn.heuristicDistance = null;
          cnn.weight = 0;
          cnn.relatesToObject = false;
          cnn.overwriteObjectRelation = false;

        });
      this.start = start;
      this.target = target;
      this.object = null;
      this.nodesToAnimate = [];
      this.objectNodesToAnimate = [];
      this.shortestPathNodesToAnimate = [];
      this.objectShortestPathNodesToAnimate = [];
      this.wallsToAnimate = [];
      this.mouseDown = false;
      this.pressedNodeStatus = "normal";
      this.previouslyPressedNodeStatus = null;
      this.previouslySwitchedNode = null;
      this.previouslySwitchedNodeWeight = 0;
      this.keyDown = false;
      this.algoDone = false;
      this.numberOfObjects = 0;
      this.isObject = false;
    }

    document.getElementById("startButtonClearWalls").onclick = () => {
      this.clearWalls();
    }

    document.getElementById("startButtonClearPath").onclick = () => {
      this.clearPath("clickedButton");
    }

    document.getElementById("startButtonCreateMazeThree").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.toggleButtons();
      otherMaze(this, 2, this.height - 3, 2, this.width - 3, "vertical", false);
      mazeGenerationAnimations(this);
    }

    document.getElementById("startButtonCreateMazeFour").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.toggleButtons();
      otherOtherMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false);
      mazeGenerationAnimations(this);
    }

    document.getElementById("startButtonAddObject").onclick = () => {
      let innerHTML = document.getElementById("startButtonAddObject").innerHTML;
      if (this.currentAlgorithm !== "bidirectional") {
        if (innerHTML.includes("Add")) {
          let r = Math.floor(this.height / 2);
          let c = Math.floor(2 * this.width / 4);
          let oni = `${r}-${c}`;
          if (this.target === oni || this.start === oni || this.numberOfObjects === 1) {
            console.log("Failure to place object.");
          } else {
            document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Remove Additional Station Node</a></li>';
            this.clearPath("clickedButton");
            this.object = oni;
            this.numberOfObjects = 1;
            this.nodes[oni].status = "object";
            document.getElementById(oni).className = "object";
          }
        } else {
          let oni = this.object;
          document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add Additional Station Node</a></li>';
          document.getElementById(oni).className = "unvisited";
          this.object = null;
          this.numberOfObjects = 0;
          this.nodes[oni].status = "unvisited";
          this.isObject = false;
          this.clearPath("clickedButton");
        }
      }

    }

    document.getElementById("startButtonClearPath").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonClearWalls").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonClearBoard").className = "navbar-inverse navbar-nav";
    if (this.currentAlgorithm !== "bidirectional") {
      document.getElementById("startButtonAddObject").className = "navbar-inverse navbar-nav";
    }
    document.getElementById("startButtonCreateMazeOne").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonCreateMazeTwo").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonCreateMazeThree").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonCreateMazeFour").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonCreateMazeWeights").className = "navbar-inverse navbar-nav";
    document.getElementById("startStairDemonstration").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonDFS").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonBFS").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonDijkstra").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonAStar").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonAStar2").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonAStar3").className = "navbar-inverse navbar-nav";
    document.getElementById("adjustFastar").className = "navbar-inverse navbar-nav";
    document.getElementById("adjustAverage").className = "navbar-inverse navbar-nav";
    document.getElementById("adjustSlow").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonBidirectional").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonGreedy").className = "navbar-inverse navbar-nav";
    document.getElementById("actualStartButton").style.backgroundColor = "";

  } else {
    this.buttonsOn = false;
    document.getElementById("startButtonDFS").onclick = null;
    document.getElementById("startButtonBFS").onclick = null;
    document.getElementById("startButtonDijkstra").onclick = null;
    document.getElementById("startButtonAStar").onclick = null;
    document.getElementById("startButtonGreedy").onclick = null;
    document.getElementById("startButtonAddObject").onclick = null;
    document.getElementById("startButtonAStar2").onclick = null;
    document.getElementById("startButtonAStar3").onclick = null;
    document.getElementById("startButtonBidirectional").onclick = null;
    document.getElementById("startButtonCreateMazeOne").onclick = null;
    document.getElementById("startButtonCreateMazeTwo").onclick = null;
    document.getElementById("startButtonCreateMazeThree").onclick = null;
    document.getElementById("startButtonCreateMazeFour").onclick = null;
    document.getElementById("startButtonCreateMazeWeights").onclick = null;
    document.getElementById("startStairDemonstration").onclick = null;
    document.getElementById("startButtonClearPath").onclick = null;
    document.getElementById("startButtonClearWalls").onclick = null;
    document.getElementById("startButtonClearBoard").onclick = null;
    document.getElementById("startButtonStart").onclick = null;
    document.getElementById("adjustFastar").onclick = null;
    document.getElementById("adjustAverage").onclick = null;
    document.getElementById("adjustSlow").onclick = null;

    document.getElementById("adjustFastar").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("adjustAverage").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("adjustSlow").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonClearPath").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonClearWalls").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonClearBoard").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonAddObject").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeOne").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeTwo").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeThree").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeFour").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeWeights").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startStairDemonstration").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonDFS").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonBFS").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonDijkstra").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonAStar").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonGreedy").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonAStar2").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonAStar3").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonBidirectional").className = "navbar-inverse navbar-nav disabledA";

    document.getElementById("actualStartButton").style.backgroundColor = "rgb(185, 15, 15)";
  }


}

let nbh = $("#navbarDiv").height();
let th = $("#mainText").height() + $("#algorithmDescriptor").height();
let height = Math.floor(($(document).height() - nbh - th) / 28);
let width = Math.floor($(document).width() / 25);
let newBoard = new Board(height, width)
newBoard.initialise();

window.onkeydown = (e) => {
  newBoard.keyDown = e.keyCode;
}

window.onkeyup = (e) => {
  newBoard.keyDown = false;
}
