(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");

function la(board, scs, type, object, algorithm, heuristic) {
  let nodes = object ? board.objectNodesToAnimate.slice(0) : board.nta.slice(0);
  let spd = board.spd === "fast" ?
    0 : board.spd === "average" ?
      100 : 500;
  let sno;
  function tot(index) {
    setTimeout(function () {
      if (index === nodes.length) {
        if (object) {
          board.objectNodesToAnimate = [];
          if (scs) {
            board.addShortestPath(board.object, board.start, "object");
            board.clearNodeStatuses();
            let ncss;
            if (board.currentAlgorithm === "bidirectional") {

            } else {
              if (type === "weighted") {
                ncss = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nta, board.gridArray, algorithm, heuristic);
              } else {
                ncss = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nta, board.gridArray, algorithm);
              }
            }
            document.getElementById(board.object).className = "visitedObjectNode";
            la(board, ncss, type);
            return;
          } else {
            console.log("Failure.");
            board.reset();
            board.toggleButtons();
            return;
          }
        } else {
          board.nta = [];
          if (scs) {
            if (document.getElementById(board.target).className !== "visitedTargetNodeBlue") {
              document.getElementById(board.target).className = "visitedTargetNodeBlue";
            }
            if (board.isObject) {
              board.addShortestPath(board.target, board.object);
              board.drawShortestPathTimeout(board.target, board.object, type, "object");
              board.objectShortestPathNodesToAnimate = [];
              board.shortestPathNodesToAnimate = [];
              board.reset("objectNotTransparent");
            } else {
              board.drawShortestPathTimeout(board.target, board.start, type);
              board.objectShortestPathNodesToAnimate = [];
              board.shortestPathNodesToAnimate = [];
              board.reset();
            }
            sno = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
            return;
          } else {
            console.log("Failure.");
            board.reset();
            board.toggleButtons();
            return;
          }
        }
      } else if (index === 0) {
        if (object) {
          document.getElementById(board.start).className = "visitedStartNodePurple";
        } else {
          if (document.getElementById(board.start).className !== "visitedStartNodePurple") {
            document.getElementById(board.start).className = "visitedStartNodeBlue";
          }
        }
        if (board.currentAlgorithm === "bidirectional") {
          document.getElementById(board.target).className = "visitedTargetNodeBlue";
        }
        chg(nodes[index])
      } else if (index === nodes.length - 1 && board.currentAlgorithm === "bidirectional") {
        chg(nodes[index], nodes[index - 1], "bidirectional");
      } else {
        chg(nodes[index], nodes[index - 1]);
      }
      tot(index + 1);
    }, spd);
  }

  function chg(cnn, pno, bidirectional) {
    let chn = document.getElementById(cnn.id);
    let rcn = ["start", "target", "object", "visitedStartNodeBlue", "visitedStartNodePurple", "visitedObjectNode", "visitedTargetNodePurple", "visitedTargetNodeBlue"];
    if (!rcn.includes(chn.className)) {
      chn.className = !bidirectional ?
        "current" : cnn.weight === 15 ?
          "visited weight" : "visited";
    }
    if (chn.className === "visitedStartNodePurple" && !object) {
      chn.className = "visitedStartNodeBlue";
    }
    if (chn.className === "target" && object) {
      chn.className = "visitedTargetNodePurple";
    }
    if (pno) {
      let phn = document.getElementById(pno.id);
      if (!rcn.includes(phn.className)) {
        if (object) {
          phn.className = pno.weight === 15 ? "visitedobject weight" : "visitedobject";
        } else {
          phn.className = pno.weight === 15 ? "visited weight" : "visited";
        }
      }
    }
  }

  function spto(index) {
    setTimeout(function () {
      if (index === sno.length){
        board.reset();
        if (object) {
          spc(board.nodes[board.target], sno[index - 1]);
          board.objectShortestPathNodesToAnimate = [];
          board.shortestPathNodesToAnimate = [];
          board.clearNodeStatuses();
          let ncss;
          if (type === "weighted") {
            ncss = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nta, board.gridArray, algorithm);
          } else {
            ncss = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nta, board.gridArray, algorithm);
          }
          la(board, ncss, type);
          return;
        } else {
          spc(board.nodes[board.target], sno[index - 1]);
          board.objectShortestPathNodesToAnimate = [];
          board.shortestPathNodesToAnimate = [];
          return;
        }
      } else if (index === 0) {
        spc(sno[index])
      } else {
        spc(sno[index], sno[index - 1]);
      }
      spto(index + 1);
    }, 40);
  }

  function spc(cnn, pno) {
    let chn = document.getElementById(cnn.id);
    if (type === "unweighted") {
      chn.className = "shortest-path-unweighted";
    } else {
      if (cnn.direction === "up") {
        chn.className = "shortest-path-up";
      } else if (cnn.direction === "down") {
        chn.className = "shortest-path-down";
      } else if (cnn.direction === "right") {
        chn.className = "shortest-path-right";
      } else if (cnn.direction === "left") {
        chn.className = "shortest-path-left";
      } else if (cnn.direction = "down-right") {
        chn.className = "wall"
      }
    }
    if (pno) {
      let phn = document.getElementById(pno.id);
      phn.className = "shortest-path";
    } else {
      let element = document.getElementById(board.start);
      element.className = "shortest-path";
      element.removeAttribute("style");
    }
  }

  tot(0);

};

module.exports = la;

},{"../pathfindingAlgorithms/unweightedSearchAlgorithm":15,"../pathfindingAlgorithms/weightedSearchAlgorithm":16}],2:[function(require,module,exports){
const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");

function lia(board, scs, type, object, algorithm, heuristic) {
  let nodes = object ? board.objectNodesToAnimate.slice(0) : board.nta.slice(0);
  let sno;
  for (let i = 0; i < nodes.length; i++) {
    if (i === 0) {
      chg(nodes[i]);
    } else {
      chg(nodes[i], nodes[i - 1]);
    }
  }
  if (object) {
    board.objectNodesToAnimate = [];
    if (scs) {
      board.drawShortestPath(board.object, board.start, "object");
      board.clearNodeStatuses();
      let ncss;
      if (type === "weighted") {
        ncss = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nta, board.gridArray, algorithm, heuristic);
      } else {
        ncss = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nta, board.gridArray, algorithm);
      }
      lia(board, ncss, type);
      sno = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      console.log("Failure.");
      board.reset();
      return;
    }
  } else {
    board.nta = [];
    if (scs) {
      if (board.isObject) {
        board.drawShortestPath(board.target, board.object);
      } else {
        board.drawShortestPath(board.target, board.start);
      }
      sno = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      console.log("Failure");
      board.reset();
      return;
    }
  }

  let j;
  for (j = 0; j < sno.length; j++) {
    if (j === 0) {
      spc(sno[j]);
    } else {
      spc(sno[j], sno[j - 1]);
    }
  }
  board.reset();
  if (object) {
    spc(board.nodes[board.target], sno[j - 1]);
    board.objectShortestPathNodesToAnimate = [];
    board.shortestPathNodesToAnimate = [];
    board.clearNodeStatuses();
    let ncss;
    if (type === "weighted") {
      ncss = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nta, board.gridArray, algorithm);
    } else {
      ncss = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nta, board.gridArray, algorithm);
    }
    lia(board, ncss, type);
  } else {
    spc(board.nodes[board.target], sno[j - 1]);
    board.objectShortestPathNodesToAnimate = [];
    board.shortestPathNodesToAnimate = [];
  }

  function chg(cnn, pno) {
    let chn = document.getElementById(cnn.id);
    let rcn = ["start", "shortest-path", "instantshortest-path", "instantshortest-path weight"];
    if (pno) {
      let phn = document.getElementById(pno.id);
      if (!rcn.includes(phn.className)) {
        if (object) {
          phn.className = pno.weight === 15 ? "instantvisitedobject weight" : "instantvisitedobject";
        } else {
          phn.className = pno.weight === 15 ? "instantvisited weight" : "instantvisited";
        }
      }
    }
  }

  function spc(cnn, pno) {
    let chn = document.getElementById(cnn.id);
    if (type === "unweighted") {
      chn.className = "shortest-path-unweighted";
    } else {
      if (cnn.direction === "up") {
        chn.className = "shortest-path-up";
      } else if (cnn.direction === "down") {
        chn.className = "shortest-path-down";
      } else if (cnn.direction === "right") {
        chn.className = "shortest-path-right";
      } else if (cnn.direction === "left") {
        chn.className = "shortest-path-left";
      }
    }
    if (pno) {
      let phn = document.getElementById(pno.id);
      phn.className = pno.weight === 15 ? "instantshortest-path weight" : "instantshortest-path";
    } else {
      let element = document.getElementById(board.start);
      element.className = "startTransparent";
    }
  }

};

module.exports = lia;

},{"../pathfindingAlgorithms/unweightedSearchAlgorithm":15,"../pathfindingAlgorithms/weightedSearchAlgorithm":16}],3:[function(require,module,exports){
function mazeGenerationAnimations(board) {
  let nodes = board.wtan.slice(0);
  let spd = board.spd === "fast" ?
    5 : board.spd === "average" ?
      25 : 75;
  function tot(index) {
    setTimeout(function () {
        if (index === nodes.length){
          board.wtan = [];
          board.toggleButtons();
          return;
        }
        nodes[index].className = board.nodes[nodes[index].id].weight === 15 ? "unvisited weight" : "wall";
        tot(index + 1);
    }, spd);
  }

  tot(0);
};

module.exports = mazeGenerationAnimations;

},{}],4:[function(require,module,exports){
const Node = require("./node");
const la = require("./animations/la");
const lia = require("./animations/lia");
const mazeGenerationAnimations = require("./animations/mazeGenerationAnimations");
const weightedSearchAlgorithm = require("./pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("./pathfindingAlgorithms/unweightedSearchAlgorithm");
const rdm = require("./mazeAlgorithms/rdm");
const otherMaze = require("./mazeAlgorithms/otherMaze");
const otherOtherMaze = require("./mazeAlgorithms/otherOtherMaze");
const astar = require("./pathfindingAlgorithms/astar");
const stairDemonstration = require("./mazeAlgorithms/stairDemonstration");
const weightsDemonstration = require("./mazeAlgorithms/weightsDemonstration");
const simpleDemonstration = require("./mazeAlgorithms/simpleDemonstration");
const bidirectional = require("./pathfindingAlgorithms/bidirectional");
const gdi = require("./gdi");

function Board(height, width) {
  this.height = height;
  this.width = width;
  this.start = null;
  this.target = null;
  this.object = null;
  this.gridArray = [];
  this.nodes = {};
  this.nta = [];
  this.objectNodesToAnimate = [];
  this.shortestPathNodesToAnimate = [];
  this.objectShortestPathNodesToAnimate = [];
  this.wtan = [];
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
  this.spd = "fast";
}

Board.prototype.initialise = function() {
  this.createGrid();
  this.addEventListeners();
  this.toggleTutorialButtons();
};

Board.prototype.createGrid = function() {
  let tableHTML = "";
  for (let r = 0; r < this.height; r++) {
    let car = [];
    let chr = `<tr id="row ${r}">`;
    for (let c = 0; c < this.width; c++) {
      let newNodeId = `${r}-${c}`, newNodeClass, newNode;
      if (r === Math.floor(this.height / 7) && c === Math.floor(this.width / 9)) {
        newNodeClass = "start";
        this.start = `${newNodeId}`;
      } else if (r === Math.floor(this.height / 7) && c === Math.floor(3 * this.width / 9)) {
        newNodeClass = "target";
        this.target = `${newNodeId}`;
      } else {
        newNodeClass = "unvisited";
      }
      newNode = new Node(newNodeId, newNodeClass);
      car.push(newNode);
      chr += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
      this.nodes[`${newNodeId}`] = newNode;
    }
    this.gridArray.push(car);
    tableHTML += `${chr}</tr>`;
  }
  let board = document.getElementById("board");
  board.innerHTML = tableHTML;
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
            board.chgNormalNode(cnn);
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
            board.chgSpecialNode(cnn);
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
            board.chgNormalNode(cnn);
          }
        }
      }
      cel.onmouseleave = () => {
        if (this.buttonsOn) {
          if (board.mouseDown && board.pressedNodeStatus !== "normal") {
            board.chgSpecialNode(cnn);
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
  return this.gridArray[r][c];
};

Board.prototype.chgSpecialNode = function(cnn) {
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

Board.prototype.chgNormalNode = function(cnn) {
  let element = document.getElementById(cnn.id);
  let rss = ["start", "target", "object"];
  let unweightedAlgorithms = ["dfs", "bfs"]
  if (!this.keyDown) {
    if (!rss.includes(cnn.status)) {
      element.className = cnn.status !== "wall" ?
        "wall" : "unvisited";
      cnn.status = element.className !== "wall" ?
        "unvisited" : "wall";
      cnn.weight = 0;
    }
  } else if (this.keyDown === 87 && !unweightedAlgorithms.includes(this.currentAlgorithm)) {
    if (!rss.includes(cnn.status)) {
      element.className = cnn.weight !== 15 ?
        "unvisited weight" : "unvisited";
      cnn.weight = element.className !== "unvisited weight" ?
        0 : 15;
      cnn.status = "unvisited";
    }
  }
};

Board.prototype.drawShortestPath = function(tnId, snid, object) {
  let cnn;
  if (this.currentAlgorithm !== "bidirectional") {
    cnn = this.nodes[this.nodes[tnId].pno];
    if (object) {
      while (cnn.id !== snid) {
        this.objectShortestPathNodesToAnimate.unshift(cnn);
        cnn = this.nodes[cnn.pno];
      }
    } else {
      while (cnn.id !== snid) {
        this.shortestPathNodesToAnimate.unshift(cnn);
        document.getElementById(cnn.id).className = `shortest-path`;
        cnn = this.nodes[cnn.pno];
      }
    }
  } else {
    if (this.middleNode !== this.target && this.middleNode !== this.start) {
      cnn = this.nodes[this.nodes[this.middleNode].pno];
      scno = this.nodes[this.nodes[this.middleNode].otherpno];
      if (scno.id === this.target) {
        this.nodes[this.target].direction = gdi(this.nodes[this.middleNode], this.nodes[this.target])[2];
      }
      if (this.nodes[this.middleNode].weight === 0) {
        document.getElementById(this.middleNode).className = `shortest-path`;
      } else {
        document.getElementById(this.middleNode).className = `shortest-path weight`;
      }
      while (cnn.id !== snid) {
        this.shortestPathNodesToAnimate.unshift(cnn);
        document.getElementById(cnn.id).className = `shortest-path`;
        cnn = this.nodes[cnn.pno];
      }
      while (scno.id !== tnId) {
        this.shortestPathNodesToAnimate.unshift(scno);
        document.getElementById(scno.id).className = `shortest-path`;
        if (scno.otherpno === tnId) {
          if (scno.otherdirection === "left") {
            scno.direction = "right";
          } else if (scno.otherdirection === "right") {
            scno.direction = "left";
          } else if (scno.otherdirection === "up") {
            scno.direction = "down";
          } else if (scno.otherdirection === "down") {
            scno.direction = "up";
          }
          this.nodes[this.target].direction = gdi(scno, this.nodes[this.target])[2];
        }
        scno = this.nodes[scno.otherpno]
      }
    } else {
      document.getElementById(this.nodes[this.target].pno).className = `shortest-path`;
    }
  }
};

Board.prototype.addShortestPath = function(tnId, snid, object) {
  let cnn = this.nodes[this.nodes[tnId].pno];
  if (object) {
    while (cnn.id !== snid) {
      this.objectShortestPathNodesToAnimate.unshift(cnn);
      cnn.relatesToObject = true;
      cnn = this.nodes[cnn.pno];
    }
  } else {
    while (cnn.id !== snid) {
      this.shortestPathNodesToAnimate.unshift(cnn);
      cnn = this.nodes[cnn.pno];
    }
  }
};

Board.prototype.drawShortestPathTimeout = function(tnId, snid, type, object) {
  let board = this;
  let cnn;
  let scno;
  let cnnsToAnimate;

  if (board.currentAlgorithm !== "bidirectional") {
    cnn = board.nodes[board.nodes[tnId].pno];
    if (object) {
      board.objectShortestPathNodesToAnimate.push("object");
      cnnsToAnimate = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      cnnsToAnimate = [];
      while (cnn.id !== snid) {
        cnnsToAnimate.unshift(cnn);
        cnn = board.nodes[cnn.pno];
      }
    }
  } else {
    if (board.middleNode !== board.target && board.middleNode !== board.start) {
      cnn = board.nodes[board.nodes[board.middleNode].pno];
      scno = board.nodes[board.nodes[board.middleNode].otherpno];
      if (scno.id === board.target) {
        board.nodes[board.target].direction = gdi(board.nodes[board.middleNode], board.nodes[board.target])[2];
      }
      if (object) {

      } else {
        cnnsToAnimate = [];
        board.nodes[board.middleNode].direction = gdi(cnn, board.nodes[board.middleNode])[2];
        while (cnn.id !== snid) {
          cnnsToAnimate.unshift(cnn);
          cnn = board.nodes[cnn.pno];
        }
        cnnsToAnimate.push(board.nodes[board.middleNode]);
        while (scno.id !== tnId) {
          if (scno.otherdirection === "left") {
            scno.direction = "right";
          } else if (scno.otherdirection === "right") {
            scno.direction = "left";
          } else if (scno.otherdirection === "up") {
            scno.direction = "down";
          } else if (scno.otherdirection === "down") {
            scno.direction = "up";
          }
          cnnsToAnimate.push(scno);
          if (scno.otherpno === tnId) {
            board.nodes[board.target].direction = gdi(scno, board.nodes[board.target])[2];
          }
          scno = board.nodes[scno.otherpno]
        }
    }
  } else {
    cnnsToAnimate = [];
    let target = board.nodes[board.target];
    cnnsToAnimate.push(board.nodes[target.pno], target);
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


  function spc(cnn, pno, isActualTarget) {
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
    if (pno) {
      if (pno !== "object" && pno.id !== board.target && pno.id !== board.start) {
        let phn = document.getElementById(pno.id);
        phn.className = pno.weight === 15 ? "shortest-path weight" : "shortest-path";
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
      let weightedAlgorithms = ["dijkstra", "CLA", "greedy"];
      let unweightedAlgorithms = ["dfs", "bfs"];
      let scs;
      if (this.currentAlgorithm === "bidirectional") {
        if (!this.numberOfObjects) {
          scs = bidirectional(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic, this);
          la(this, scs, "weighted");
        } else {
          this.isObject = true;
        }
        this.algoDone = true;
      } else if (this.currentAlgorithm === "astar") {
        if (!this.numberOfObjects) {
          scs = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
          la(this, scs, "weighted");
        } else {
          this.isObject = true;
          scs = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
          la(this, scs, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
        }
        this.algoDone = true;
      } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
        if (!this.numberOfObjects) {
          scs = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
          la(this, scs, "weighted");
        } else {
          this.isObject = true;
          scs = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
          la(this, scs, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
        }
        this.algoDone = true;
      } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
        if (!this.numberOfObjects) {
          scs = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm);
          la(this, scs, "unweighted");
        } else {
          this.isObject = true;
          scs = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm);
          la(this, scs, "unweighted", "object", this.currentAlgorithm);
        }
        this.algoDone = true;
      }
    }
  }

  this.algoDone = false;
  Object.keys(this.nodes).forEach(id => {
    let cnn = this.nodes[id];
    cnn.pno = null;
    cnn.distance = Infinity;
    cnn.totalDistance = Infinity;
    cnn.heuristicDistance = null;
    cnn.direction = null;
    cnn.storedDirection = null;
    cnn.relatesToObject = false;
    cnn.overwriteObjectRelation = false;
    cnn.otherpno = null;
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
    cnn.pno = null;
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
  let weightedAlgorithms = ["dijkstra", "CLA", "greedy"];
  let unweightedAlgorithms = ["dfs", "bfs"];
  let scs;
  if (this.currentAlgorithm === "bidirectional") {
    if (!this.numberOfObjects) {
      scs = bidirectional(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic, this);
      lia(this, scs, "weighted");
    } else {
      this.isObject = true;
    }
    this.algoDone = true;
  } else if (this.currentAlgorithm === "astar") {
    if (!this.numberOfObjects) {
      scs = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
      lia(this, scs, "weighted");
    } else {
      this.isObject = true;
      scs = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
      lia(this, scs, "weighted", "object", this.currentAlgorithm);
    }
    this.algoDone = true;
  }
  if (weightedAlgorithms.includes(this.currentAlgorithm)) {
    if (!this.numberOfObjects) {
      scs = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
      lia(this, scs, "weighted");
    } else {
      this.isObject = true;
      scs = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
      lia(this, scs, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
    }
    this.algoDone = true;
  } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
    if (!this.numberOfObjects) {
      scs = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm);
      lia(this, scs, "unweighted");
    } else {
      this.isObject = true;
      scs = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm);
      lia(this, scs, "unweighted", "object", this.currentAlgorithm);
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

Board.prototype.chgStartNodeImages = function() {
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
      document.getElementById("tutorial").innerHTML = `<h4>LET'S HAVE A LOOK OVER ALGORITHMS!</h5><h7>Not all algorithms are created equal.</h7><ul><li><b>Dijkstra's Algorithm</b>(weighted):The father of PathFinding Algorithms;guarantees the Shortest Path</li><li><b>A* Search</b> (weighted): Arguably the best PathFinding Algorithm; uses Heuristics to guarantee the Shortest Path much faster than Dijkstra's Algorithm</li><li><b>Greedy Best-first Search</b> (weighted): A faster, more Heuristic-Heavy Version of A*</li><li><b>CDA Algorithm</b> (weighted): a combination of Dijkstra's Algorithm and A*</li><li><b>Convergent CDA Algorithm</b> (weighted): The faster, more Heuristic-Heavy version of CDA</li><li><b>Bidirectional CDA Algorithm</b> (weighted): CDA(Combination of Dijkstra's and A*) from both sides</li><li><b>Breath-first Search</b> (unweighted): A great Algorithm; guarantees the Shortest path</li><li><b>Depth-first Search</b> (unweighted): An algorithm for pathfinding; which is least taken into consideration</li></ul><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 5) {
      document.getElementById("tutorial").innerHTML = `<h3>CREATING OBSTACLES AND CRATERS</h3><h6>Click on the grid to add an Obstacle. Right Click on the grid while pressing W(on the keyboard) to add a Crater. Generate Mazes and Patterns from the "Mazes & Patterns" drop-down menu.</h6><p>Obstacles are Impenetrable, meaning that a path cannot cross through them. Craters, however, are not impassable. They are simply more "costly" to move through. In this Web Application, Moving through a Crater node will result in the decrement in the amount of Energy of the Rover at the rate of 20%.</p><img id="secondTutorialImage" src="public/styling/walls.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 6) {
      document.getElementById("tutorial").innerHTML = `<h3>RESEARCH SITE</h3><h6>Click the "ADD ADDITIONAL STATION NODE" button.</h6><p>Adding a 'Additional Station Node' will change the course of the chosen algorithm. In other words, the algorithm will first look for the 'Additional Station Node' in an effort to collect the Soil Samples and to Survey the Mars' Surface. While Collecting and Surveying, the Rover's High Resolution Camera will capture the Snaps which will be sent back to the Earth and then it will look for the Target Node(Destination). Note that the Bidirectional CDA Algorithm does not support adding an Additional station Node.</p><img id="secondTutorialImage" src="public/styling/bomb.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 7) {
      document.getElementById("tutorial").innerHTML = `<h3>DRAGGING NODES</h3><h6>Click and drag the Start Node(Source), Target node(Destination) and Additional Station Node to move them.</h6><p>Note that you can drag nodes even after an Algorithm has finished running. This will allow you to instantly see Different Paths.</p><img src="public/styling/dragging.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
    } else if (counter === 8) {
      document.getElementById("tutorial").innerHTML = `<h3>VISUALIZING AND MORE!</h3><h6>You can use the Navigation Bar buttons to visualize Algorithms and to do other stuff!</h6><p>You can clear the Current Path, clear Obstacles and Craters, clear the complete Environment, and adjust the Visualization Speed, all from the Navigation bar. If you want to access this tutorial again, click on "TECHNOCRATS ON MARS" in the top left corner of your screen.</p><img id="secondTutorialImage" src="public/styling/navbar.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
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
        let weightedAlgorithms = ["dijkstra", "CLA", "CLA", "greedy"];
        let unweightedAlgorithms = ["dfs", "bfs"];
        let scs;
        if (this.currentAlgorithm === "bidirectional") {
          if (!this.numberOfObjects) {
            scs = bidirectional(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic, this);
            la(this, scs, "weighted");
          } else {
            this.isObject = true;
            scs = bidirectional(this.nodes, this.start, this.object, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic, this);
            la(this, scs, "weighted");
          }
          this.algoDone = true;
        } else if (this.currentAlgorithm === "astar") {
          if (!this.numberOfObjects) {
            scs = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
            la(this, scs, "weighted");
          } else {
            this.isObject = true;
            scs = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
            la(this, scs, "weighted", "object", this.currentAlgorithm);
          }
          this.algoDone = true;
        } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
          if (!this.numberOfObjects) {
            scs = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
            la(this, scs, "weighted");
          } else {
            this.isObject = true;
            scs = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm, this.currentHeuristic);
            la(this, scs, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
          }
          this.algoDone = true;
        } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
          if (!this.numberOfObjects) {
            scs = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nta, this.gridArray, this.currentAlgorithm);
            la(this, scs, "unweighted");
          } else {
            this.isObject = true;
            scs = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.gridArray, this.currentAlgorithm);
            la(this, scs, "unweighted", "object", this.currentAlgorithm);
          }
          this.algoDone = true;
        }
      }
    }

    document.getElementById("adjustFast").onclick = () => {
      this.spd = "fast";
      document.getElementById("adjustSpeed").innerHTML = 'Speed: Fast<span class="caret"></span>';
    }

    document.getElementById("adjustAverage").onclick = () => {
      this.spd = "average";
      document.getElementById("adjustSpeed").innerHTML = 'Speed: Average<span class="caret"></span>';
    }

    document.getElementById("adjustSlow").onclick = () => {
      this.spd = "slow";
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
        let onid = this.object;
        document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add Additional Station Node</a></li>';
        document.getElementById(onid).className = "unvisited";
        this.object = null;
        this.numberOfObjects = 0;
        this.nodes[onid].status = "unvisited";
        this.isObject = false;
      }
      this.clearPath("clickedButton");
      this.chgStartNodeImages();
    }

    document.getElementById("startButtonDijkstra").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Dijkstra\'s!</button>'
      this.currentAlgorithm = "dijkstra";
      this.chgStartNodeImages();
    }

    document.getElementById("startButtonAStar").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize CDA!</button>'
      this.currentAlgorithm = "CLA";
      this.currentHeuristic = "manhattanDistance"
      this.chgStartNodeImages();
    }

    document.getElementById("startButtonAStar2").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize A*!</button>'
      this.currentAlgorithm = "astar";
      this.currentHeuristic = "poweredManhattanDistance"
      this.chgStartNodeImages();
    }

    document.getElementById("startButtonAStar3").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Convergent CDA!</button>'
      this.currentAlgorithm = "CLA";
      this.currentHeuristic = "extraPoweredManhattanDistance"
      this.chgStartNodeImages();
    }

    document.getElementById("startButtonGreedy").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Greedy!</button>'
      this.currentAlgorithm = "greedy";
      this.chgStartNodeImages();
    }

    document.getElementById("startButtonBFS").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize BFS!</button>'
      this.currentAlgorithm = "bfs";
      this.clearWeights();
      this.chgStartNodeImages();
    }

    document.getElementById("startButtonDFS").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize DFS!</button>'
      this.currentAlgorithm = "dfs";
      this.clearWeights();
      this.chgStartNodeImages();
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
      rdm(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false, "wall");
      mazeGenerationAnimations(this);
    }

    document.getElementById("startButtonCreateMazeWeights").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.createMazeOne("weight");
    }

    document.getElementById("startButtonClearBoard").onclick = () => {
      document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add Additional Station Node</a></li>';



      let navbarHeight = document.getElementById("navbarDiv").clientHeight;
      let textHeight = document.getElementById("mainText").clientHeight + document.getElementById("algorithmDescriptor").clientHeight;
      let height = Math.floor((document.documentElement.clientHeight - navbarHeight - textHeight) / 28);
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
          cnn.pno = null;
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
      this.nta = [];
      this.objectNodesToAnimate = [];
      this.shortestPathNodesToAnimate = [];
      this.objectShortestPathNodesToAnimate = [];
      this.wtan = [];
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
          let onid = `${r}-${c}`;
          if (this.target === onid || this.start === onid || this.numberOfObjects === 1) {
            console.log("Failure to place object.");
          } else {
            document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Remove Additional Station Node</a></li>';
            this.clearPath("clickedButton");
            this.object = onid;
            this.numberOfObjects = 1;
            this.nodes[onid].status = "object";
            document.getElementById(onid).className = "object";
          }
        } else {
          let onid = this.object;
          document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add Additional Station Node</a></li>';
          document.getElementById(onid).className = "unvisited";
          this.object = null;
          this.numberOfObjects = 0;
          this.nodes[onid].status = "unvisited";
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
    document.getElementById("adjustFast").className = "navbar-inverse navbar-nav";
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
    document.getElementById("adjustFast").onclick = null;
    document.getElementById("adjustAverage").onclick = null;
    document.getElementById("adjustSlow").onclick = null;

    document.getElementById("adjustFast").className = "navbar-inverse navbar-nav disabledA";
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

let navbarHeight = $("#navbarDiv").height();
let textHeight = $("#mainText").height() + $("#algorithmDescriptor").height();
let height = Math.floor(($(document).height() - navbarHeight - textHeight) / 28);
let width = Math.floor($(document).width() / 25);
let newBoard = new Board(height, width)
newBoard.initialise();

window.onkeydown = (e) => {
  newBoard.keyDown = e.keyCode;
}

window.onkeyup = (e) => {
  newBoard.keyDown = false;
}

},{"./animations/la":1,"./animations/lia":2,"./animations/mazeGenerationAnimations":3,"./gdi":5,"./mazeAlgorithms/otherMaze":6,"./mazeAlgorithms/otherOtherMaze":7,"./mazeAlgorithms/rdm":8,"./mazeAlgorithms/simpleDemonstration":9,"./mazeAlgorithms/stairDemonstration":10,"./mazeAlgorithms/weightsDemonstration":11,"./node":12,"./pathfindingAlgorithms/astar":13,"./pathfindingAlgorithms/bidirectional":14,"./pathfindingAlgorithms/unweightedSearchAlgorithm":15,"./pathfindingAlgorithms/weightedSearchAlgorithm":16}],5:[function(require,module,exports){
function gdi(no, nt) {
  let ccoo = no.id.split("-");
  let tcoo = nt.id.split("-");
  let x1 = parseInt(ccoo[0]);
  let y1 = parseInt(ccoo[1]);
  let x2 = parseInt(tcoo[0]);
  let y2 = parseInt(tcoo[1]);
  if (x2 < x1) {
    if (no.direction === "up") {
      return [1, ["f"], "up"];
    } else if (no.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (no.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (no.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (no.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (no.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (no.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (no.direction === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (no.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (no.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (no.direction === "left") {
      return [1, ["f"], "left"];
    } else if (no.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (no.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (no.direction === "right") {
      return [1, ["f"], "right"];
    } else if (no.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (no.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

module.exports = gdi;

},{}],6:[function(require,module,exports){
function rdm(board, rowStart, rowEnd, colStart, colEnd, orientation, swl) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!swl) {
    let ris = [board.start, board.target];
    if (board.object) ris.push(board.object);
    Object.keys(board.nodes).forEach(node => {
      if (!ris.includes(node)) {
        let r = parseInt(node.split("-")[0]);
        let c = parseInt(node.split("-")[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          let chn = document.getElementById(node);
          board.wtan.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    swl = true;
  }
  if (orientation === "horizontal") {
    let pr = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      pr.push(number);
    }
    let pc = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      pc.push(number);
    }
    let rri = Math.floor(Math.random() * pr.length);
    let rci = Math.floor(Math.random() * pc.length);
    let cro = pr[rri];
    let cra = pc[rci];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (r === cro && c !== cra && c >= colStart - 1 && c <= colEnd + 1) {
        let chn = document.getElementById(node);
        if (chn.className !== "start" && chn.className !== "target" && chn.className !== "object") {
          board.wtan.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (cro - 2 - rowStart > colEnd - colStart) {
      rdm(board, rowStart, cro - 2, colStart, colEnd, orientation, swl);
    } else {
      rdm(board, rowStart, cro - 2, colStart, colEnd, "vertical", swl);
    }
    if (rowEnd - (cro + 2) > colEnd - colStart) {
      rdm(board, cro + 2, rowEnd, colStart, colEnd, "vertical", swl);
    } else {
      rdm(board, cro + 2, rowEnd, colStart, colEnd, "vertical", swl);
    }
  } else {
    let pc = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      pc.push(number);
    }
    let pr = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      pr.push(number);
    }
    let rci = Math.floor(Math.random() * pc.length);
    let rri = Math.floor(Math.random() * pr.length);
    let currentCol = pc[rci];
    let rrm = pr[rri];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (c === currentCol && r !== rrm && r >= rowStart - 1 && r <= rowEnd + 1) {
        let chn = document.getElementById(node);
        if (chn.className !== "start" && chn.className !== "target" && chn.className !== "object") {
          board.wtan.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      rdm(board, rowStart, rowEnd, colStart, currentCol - 2, "vertical", swl);
    } else {
      rdm(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, swl);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      rdm(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", swl);
    } else {
      rdm(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, swl);
    }
  }
};

module.exports = rdm;

},{}],7:[function(require,module,exports){
function rdm(board, rowStart, rowEnd, colStart, colEnd, orientation, swl) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!swl) {
    let ris = [board.start, board.target];
    if (board.object) ris.push(board.object);
    Object.keys(board.nodes).forEach(node => {
      if (!ris.includes(node)) {
        let r = parseInt(node.split("-")[0]);
        let c = parseInt(node.split("-")[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          let chn = document.getElementById(node);
          board.wtan.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    swl = true;
  }
  if (orientation === "horizontal") {
    let pr = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      pr.push(number);
    }
    let pc = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      pc.push(number);
    }
    let rri = Math.floor(Math.random() * pr.length);
    let rci = Math.floor(Math.random() * pc.length);
    let cro = pr[rri];
    let cra = pc[rci];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (r === cro && c !== cra && c >= colStart - 1 && c <= colEnd + 1) {
        let chn = document.getElementById(node);
        if (chn.className !== "start" && chn.className !== "target" && chn.className !== "object") {
          board.wtan.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (cro - 2 - rowStart > colEnd - colStart) {
      rdm(board, rowStart, cro - 2, colStart, colEnd, orientation, swl);
    } else {
      rdm(board, rowStart, cro - 2, colStart, colEnd, "horizontal", swl);
    }
    if (rowEnd - (cro + 2) > colEnd - colStart) {
      rdm(board, cro + 2, rowEnd, colStart, colEnd, orientation, swl);
    } else {
      rdm(board, cro + 2, rowEnd, colStart, colEnd, "vertical", swl);
    }
  } else {
    let pc = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      pc.push(number);
    }
    let pr = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      pr.push(number);
    }
    let rci = Math.floor(Math.random() * pc.length);
    let rri = Math.floor(Math.random() * pr.length);
    let currentCol = pc[rci];
    let rrm = pr[rri];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (c === currentCol && r !== rrm && r >= rowStart - 1 && r <= rowEnd + 1) {
        let chn = document.getElementById(node);
        if (chn.className !== "start" && chn.className !== "target" && chn.className !== "object") {
          board.wtan.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      rdm(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", swl);
    } else {
      rdm(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", swl);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      rdm(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", swl);
    } else {
      rdm(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, swl);
    }
  }
};

module.exports = rdm;

},{}],8:[function(require,module,exports){
function rdm(board, rowStart, rowEnd, colStart, colEnd, orientation, swl, type) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!swl) {
    let ris = [board.start, board.target];
    if (board.object) ris.push(board.object);
    Object.keys(board.nodes).forEach(node => {
      if (!ris.includes(node)) {
        let r = parseInt(node.split("-")[0]);
        let c = parseInt(node.split("-")[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          let chn = document.getElementById(node);
          board.wtan.push(chn);
          if (type === "wall") {
            board.nodes[node].status = "wall";
            board.nodes[node].weight = 0;
          } else if (type === "weight") {
            board.nodes[node].status = "unvisited";
            board.nodes[node].weight = 15;
          }
        }
      }
    });
    swl = true;
  }
  if (orientation === "horizontal") {
    let pr = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      pr.push(number);
    }
    let pc = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      pc.push(number);
    }
    let rri = Math.floor(Math.random() * pr.length);
    let rci = Math.floor(Math.random() * pc.length);
    let cro = pr[rri];
    let cra = pc[rci];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (r === cro && c !== cra && c >= colStart - 1 && c <= colEnd + 1) {
        let chn = document.getElementById(node);
        if (chn.className !== "start" && chn.className !== "target" && chn.className !== "object") {
          board.wtan.push(chn);
          if (type === "wall") {
            board.nodes[node].status = "wall";
            board.nodes[node].weight = 0;
          } else if (type === "weight") {
            board.nodes[node].status = "unvisited";
            board.nodes[node].weight = 15;
          }        }
      }
    });
    if (cro - 2 - rowStart > colEnd - colStart) {
      rdm(board, rowStart, cro - 2, colStart, colEnd, orientation, swl, type);
    } else {
      rdm(board, rowStart, cro - 2, colStart, colEnd, "vertical", swl, type);
    }
    if (rowEnd - (cro + 2) > colEnd - colStart) {
      rdm(board, cro + 2, rowEnd, colStart, colEnd, orientation, swl, type);
    } else {
      rdm(board, cro + 2, rowEnd, colStart, colEnd, "vertical", swl, type);
    }
  } else {
    let pc = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      pc.push(number);
    }
    let pr = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      pr.push(number);
    }
    let rci = Math.floor(Math.random() * pc.length);
    let rri = Math.floor(Math.random() * pr.length);
    let currentCol = pc[rci];
    let rrm = pr[rri];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (c === currentCol && r !== rrm && r >= rowStart - 1 && r <= rowEnd + 1) {
        let chn = document.getElementById(node);
        if (chn.className !== "start" && chn.className !== "target" && chn.className !== "object") {
          board.wtan.push(chn);
          if (type === "wall") {
            board.nodes[node].status = "wall";
            board.nodes[node].weight = 0;
          } else if (type === "weight") {
            board.nodes[node].status = "unvisited";
            board.nodes[node].weight = 15;
          }        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      rdm(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", swl, type);
    } else {
      rdm(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, swl, type);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      rdm(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", swl, type);
    } else {
      rdm(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, swl, type);
    }
  }
};

module.exports = rdm;

},{}],9:[function(require,module,exports){
function simpleDemonstration(board) {
  let ciiY = board.width - 10;
  for (let counter = 0; counter < 7; counter++) {
    let ciiXOne = Math.floor(board.height / 2) - counter;
    let ciiXTwo = Math.floor(board.height / 2) + counter;
    let ciiOne = `${ciiXOne}-${ciiY}`;
    let ciiTwo = `${ciiXTwo}-${ciiY}`;
    let ceo = document.getElementById(ciiOne);
    let cet = document.getElementById(ciiTwo);
    board.wtan.push(ceo);
    board.wtan.push(cet);
    let cnnOne = board.nodes[ciiOne];
    let cnnTwo = board.nodes[ciiTwo];
    cnnOne.status = "wall";
    cnnOne.weight = 0;
    cnnTwo.status = "wall";
    cnnTwo.weight = 0;
  }
}

module.exports = simpleDemonstration;

},{}],10:[function(require,module,exports){
function stairDemonstration(board) {
  let ciiX = board.height - 1;
  let ciiY = 0;
  let rss = ["start", "target", "object"];
  while (ciiX > 0 && ciiY < board.width) {
    let cii = `${ciiX}-${ciiY}`;
    let cnn = board.nodes[cii];
    let chn = document.getElementById(cii);
    if (!rss.includes(cnn.status)) {
      cnn.status = "wall";
      board.wtan.push(chn);
    }
    ciiX--;
    ciiY++;
  }
  while (ciiX < board.height - 2 && ciiY < board.width) {
    let cii = `${ciiX}-${ciiY}`;
    let cnn = board.nodes[cii];
    let chn = document.getElementById(cii);
    if (!rss.includes(cnn.status)) {
      cnn.status = "wall";
      board.wtan.push(chn);
    }
    ciiX++;
    ciiY++;
  }
  while (ciiX > 0 && ciiY < board.width - 1) {
    let cii = `${ciiX}-${ciiY}`;
    let cnn = board.nodes[cii];
    let chn = document.getElementById(cii);
    if (!rss.includes(cnn.status)) {
      cnn.status = "wall";
      board.wtan.push(chn);
    }
    ciiX--;
    ciiY++;
  }
}

module.exports = stairDemonstration;

},{}],11:[function(require,module,exports){
function weightsDemonstration(board) {
  let ciiX = board.height - 1;
  let ciiY = 35;
  while (ciiX > 5) {
    let cii = `${ciiX}-${ciiY}`;
    let cel = document.getElementById(cii);
    board.wtan.push(cel);
    let cnn = board.nodes[cii];
    cnn.status = "wall";
    cnn.weight = 0;
    ciiX--;
  }
  for (let ciiX = board.height - 2; ciiX > board.height - 11; ciiX--) {
    for (let ciiY = 1; ciiY < 35; ciiY++) {
      let cii = `${ciiX}-${ciiY}`;
      let cel = document.getElementById(cii);
      board.wtan.push(cel);
      let cnn = board.nodes[cii];
      if (ciiX === board.height - 2 && ciiY < 35 && ciiY > 26) {
        cnn.status = "wall";
        cnn.weight = 0;
      } else {
        cnn.status = "unvisited";
        cnn.weight = 15;
      }
    }
  }
}

module.exports = weightsDemonstration;

},{}],12:[function(require,module,exports){
function Node(id, status) {
  this.id = id;
  this.status = status;
  this.pno = null;
  this.path = null;
  this.direction = null;
  this.storedDirection = null;
  this.distance = Infinity;
  this.totalDistance = Infinity;
  this.heuristicDistance = null;
  this.weight = 0;
  this.relatesToObject = false;
  this.overwriteObjectRelation = false;

  this.otherid = id;
  this.otherstatus = status;
  this.otherpno = null;
  this.otherpath = null;
  this.otherdirection = null;
  this.otherstoredDirection = null;
  this.otherdistance = Infinity;
  this.otherweight = 0;
  this.otherrelatesToObject = false;
  this.otheroverwriteObjectRelation = false;
}

module.exports = Node;

},{}],13:[function(require,module,exports){
function astar(nodes, start, target, nta, gridArray, name, heuristic) {
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].totalDistance = 0;
  nodes[start].direction = "up";
  let und = Object.keys(nodes);
  while (und.length) {
    let cnn = cnod(nodes, und);
    while (cnn.status === "wall" && und.length) {
      cnn = cnod(nodes, und)
    }
    if (cnn.distance === Infinity) return false;
    nta.push(cnn);
    cnn.status = "visited";
    if (cnn.id === target) {
      return "scs!";
    }
    uns(nodes, cnn, gridArray, target, name, start, heuristic);
  }
}

function cnod(nodes, und) {
  let ccl, index;
  for (let i = 0; i < und.length; i++) {
    if (!ccl || ccl.totalDistance > nodes[und[i]].totalDistance) {
      ccl = nodes[und[i]];
      index = i;
    } else if (ccl.totalDistance === nodes[und[i]].totalDistance) {
      if (ccl.heuristicDistance > nodes[und[i]].heuristicDistance) {
        ccl = nodes[und[i]];
        index = i;
      }
    }
  }
  und.splice(index, 1);
  return ccl;
}

function uns(nodes, node, gridArray, target, name, start, heuristic) {
  let nbs = gns(node.id, nodes, gridArray);
  for (let neighbor of nbs) {
    if (target) {
      und(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, gridArray);
    } else {
      und(node, nodes[neighbor]);
    }
  }
}

function und(cnn, tn, atn, name, nodes, asn, heuristic, gridArray) {
  let distance = gdi(cnn, tn);
  if (!tn.heuristicDistance) tn.heuristicDistance = manhattanDistance(tn, atn);
  let dtc = cnn.distance + tn.weight + distance[0];
  if (dtc < tn.distance) {
    tn.distance = dtc;
    tn.totalDistance = tn.distance + tn.heuristicDistance;
    tn.pno = cnn.id;
    tn.path = distance[1];
    tn.direction = distance[2];
  }
}

function gns(id, nodes, gridArray) {
  let crd = id.split("-");
  let x = parseInt(crd[0]);
  let y = parseInt(crd[1]);
  let nbs = [];
  let pne;
  if (gridArray[x - 1] && gridArray[x - 1][y]) {
    pne = `${(x - 1).toString()}-${y.toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x + 1] && gridArray[x + 1][y]) {
    pne = `${(x + 1).toString()}-${y.toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x][y - 1]) {
    pne = `${x.toString()}-${(y - 1).toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x][y + 1]) {
    pne = `${x.toString()}-${(y + 1).toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  // if (gridArray[x - 1] && gridArray[x - 1][y - 1]) {
  //   pne = `${(x - 1).toString()}-${(y - 1).toString()}`
  //   let potentialWallOne = `${(x - 1).toString()}-${y.toString()}`
  //   let potentialWallTwo = `${x.toString()}-${(y - 1).toString()}`
  //   if (nodes[pne].status !== "wall" && !(nodes[potentialWallOne].status === "wall" && nodes[potentialWallTwo].status === "wall")) nbs.push(pne);
  // }
  // if (gridArray[x + 1] && gridArray[x + 1][y - 1]) {
  //   pne = `${(x + 1).toString()}-${(y - 1).toString()}`
  //   let potentialWallOne = `${(x + 1).toString()}-${y.toString()}`
  //   let potentialWallTwo = `${x.toString()}-${(y - 1).toString()}`
  //   if (nodes[pne].status !== "wall" && !(nodes[potentialWallOne].status === "wall" && nodes[potentialWallTwo].status === "wall")) nbs.push(pne);
  // }
  // if (gridArray[x - 1] && gridArray[x - 1][y + 1]) {
  //   pne = `${(x - 1).toString()}-${(y + 1).toString()}`
  //   let potentialWallOne = `${(x - 1).toString()}-${y.toString()}`
  //   let potentialWallTwo = `${x.toString()}-${(y + 1).toString()}`
  //   if (nodes[pne].status !== "wall" && !(nodes[potentialWallOne].status === "wall" && nodes[potentialWallTwo].status === "wall")) nbs.push(pne);
  // }
  // if (gridArray[x + 1] && gridArray[x + 1][y + 1]) {
  //   pne = `${(x + 1).toString()}-${(y + 1).toString()}`
  //   let potentialWallOne = `${(x + 1).toString()}-${y.toString()}`
  //   let potentialWallTwo = `${x.toString()}-${(y + 1).toString()}`
  //   if (nodes[pne].status !== "wall" && !(nodes[potentialWallOne].status === "wall" && nodes[potentialWallTwo].status === "wall")) nbs.push(pne);
  // }
  return nbs;
}


function gdi(no, nt) {
  let ccoo = no.id.split("-");
  let tcoo = nt.id.split("-");
  let x1 = parseInt(ccoo[0]);
  let y1 = parseInt(ccoo[1]);
  let x2 = parseInt(tcoo[0]);
  let y2 = parseInt(tcoo[1]);
  if (x2 < x1 && y1 === y2) {
    if (no.direction === "up") {
      return [1, ["f"], "up"];
    } else if (no.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (no.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (no.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    } else if (no.direction === "up-right") {
      return [1.5, null, "up"];
    } else if (no.direction === "down-right") {
      return [2.5, null, "up"];
    } else if (no.direction === "up-left") {
      return [1.5, null, "up"];
    } else if (no.direction === "down-left") {
      return [2.5, null, "up"];
    }
  } else if (x2 > x1 && y1 === y2) {
    if (no.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (no.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (no.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (no.direction === "down") {
      return [1, ["f"], "down"];
    } else if (no.direction === "up-right") {
      return [2.5, null, "down"];
    } else if (no.direction === "down-right") {
      return [1.5, null, "down"];
    } else if (no.direction === "up-left") {
      return [2.5, null, "down"];
    } else if (no.direction === "down-left") {
      return [1.5, null, "down"];
    }
  }
  if (y2 < y1 && x1 === x2) {
    if (no.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (no.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (no.direction === "left") {
      return [1, ["f"], "left"];
    } else if (no.direction === "down") {
      return [2, ["r", "f"], "left"];
    } else if (no.direction === "up-right") {
      return [2.5, null, "left"];
    } else if (no.direction === "down-right") {
      return [2.5, null, "left"];
    } else if (no.direction === "up-left") {
      return [1.5, null, "left"];
    } else if (no.direction === "down-left") {
      return [1.5, null, "left"];
    }
  } else if (y2 > y1 && x1 === x2) {
    if (no.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (no.direction === "right") {
      return [1, ["f"], "right"];
    } else if (no.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (no.direction === "down") {
      return [2, ["l", "f"], "right"];
    } else if (no.direction === "up-right") {
      return [1.5, null, "right"];
    } else if (no.direction === "down-right") {
      return [1.5, null, "right"];
    } else if (no.direction === "up-left") {
      return [2.5, null, "right"];
    } else if (no.direction === "down-left") {
      return [2.5, null, "right"];
    }
  } /*else if (x2 < x1 && y2 < y1) {
    if (no.direction === "up") {
      return [1.5, ["f"], "up-left"];
    } else if (no.direction === "right") {
      return [2.5, ["l", "f"], "up-left"];
    } else if (no.direction === "left") {
      return [1.5, ["r", "f"], "up-left"];
    } else if (no.direction === "down") {
      return [2.5, ["r", "r", "f"], "up-left"];
    } else if (no.direction === "up-right") {
      return [2, null, "up-left"];
    } else if (no.direction === "down-right") {
      return [3, null, "up-left"];
    } else if (no.direction === "up-left") {
      return [1, null, "up-left"];
    } else if (no.direction === "down-left") {
      return [2, null, "up-left"];
    }
  } else if (x2 < x1 && y2 > y1) {
    if (no.direction === "up") {
      return [1.5, ["f"], "up-right"];
    } else if (no.direction === "right") {
      return [1.5, ["l", "f"], "up-right"];
    } else if (no.direction === "left") {
      return [2.5, ["r", "f"], "up-right"];
    } else if (no.direction === "down") {
      return [2.5, ["r", "r", "f"], "up-right"];
    } else if (no.direction === "up-right") {
      return [1, null, "up-right"];
    } else if (no.direction === "down-right") {
      return [2, null, "up-right"];
    } else if (no.direction === "up-left") {
      return [2, null, "up-right"];
    } else if (no.direction === "down-left") {
      return [3, null, "up-right"];
    }
  } else if (x2 > x1 && y2 > y1) {
    if (no.direction === "up") {
      return [2.5, ["f"], "down-right"];
    } else if (no.direction === "right") {
      return [1.5, ["l", "f"], "down-right"];
    } else if (no.direction === "left") {
      return [2.5, ["r", "f"], "down-right"];
    } else if (no.direction === "down") {
      return [1.5, ["r", "r", "f"], "down-right"];
    } else if (no.direction === "up-right") {
      return [2, null, "down-right"];
    } else if (no.direction === "down-right") {
      return [1, null, "down-right"];
    } else if (no.direction === "up-left") {
      return [3, null, "down-right"];
    } else if (no.direction === "down-left") {
      return [2, null, "down-right"];
    }
  } else if (x2 > x1 && y2 < y1) {
    if (no.direction === "up") {
      return [2.5, ["f"], "down-left"];
    } else if (no.direction === "right") {
      return [2.5, ["l", "f"], "down-left"];
    } else if (no.direction === "left") {
      return [1.5, ["r", "f"], "down-left"];
    } else if (no.direction === "down") {
      return [1.5, ["r", "r", "f"], "down-left"];
    } else if (no.direction === "up-right") {
      return [3, null, "down-left"];
    } else if (no.direction === "down-right") {
      return [2, null, "down-left"];
    } else if (no.direction === "up-left") {
      return [2, null, "down-left"];
    } else if (no.direction === "down-left") {
      return [1, null, "down-left"];
    }
  }*/
}

function manhattanDistance(no, nt) {
  let noc = no.id.split("-").map(ele => parseInt(ele));
  let ntco = nt.id.split("-").map(ele => parseInt(ele));
  let xOne = noc[0];
  let xTwo = ntco[0];
  let yOne = noc[1];
  let yTwo = ntco[1];

  let xc = Math.abs(xOne - xTwo);
  let yc = Math.abs(yOne - yTwo);

  return (xc + yc);
}



module.exports = astar;

},{}],14:[function(require,module,exports){
const astar = require("./astar");

function bidirectional(nodes, start, target, nta, gridArray, name, heuristic, board) {
  if (name === "astar") return astar(nodes, start, target, nta, gridArray, name)
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = "right";
  nodes[target].otherdistance = 0;
  nodes[target].otherdirection = "left";
  let vnd = {};
  let uno = Object.keys(nodes);
  let unt = Object.keys(nodes);
  while (uno.length && unt.length) {
    let cnn = cnod(nodes, uno);
    let scno = cntwo(nodes, unt);
    while ((cnn.status === "wall" || scno.status === "wall") && uno.length && unt.length) {
      if (cnn.status === "wall") cnn = cnod(nodes, uno);
      if (scno.status === "wall") scno = cntwo(nodes, unt);
    }
    if (cnn.distance === Infinity || scno.otherdistance === Infinity) {
      return false;
    }
    nta.push(cnn);
    nta.push(scno);
    cnn.status = "visited";
    scno.status = "visited";
    if (vnd[cnn.id]) {
      board.middleNode = cnn.id;
      return "scs";
    } else if (vnd[scno.id]) {
      board.middleNode = scno.id;
      return "scs";
    } else if (cnn === scno) {
      board.middleNode = scno.id;
      return "scs";
    }
    vnd[cnn.id] = true;
    vnd[scno.id] = true;
    uns(nodes, cnn, gridArray, target, name, start, heuristic);
    unt(nodes, scno, gridArray, start, name, target, heuristic);
  }
}

function cnod(nodes, und) {
  let ccl, index;
  for (let i = 0; i < und.length; i++) {
    if (!ccl || ccl.distance > nodes[und[i]].distance) {
      ccl = nodes[und[i]];
      index = i;
    }
  }
  und.splice(index, 1);
  return ccl;
}

function cntwo(nodes, und) {
  let ccl, index;
  for (let i = 0; i < und.length; i++) {
    if (!ccl || ccl.otherdistance > nodes[und[i]].otherdistance) {
      ccl = nodes[und[i]];
      index = i;
    }
  }
  und.splice(index, 1);
  return ccl;
}

function uns(nodes, node, gridArray, target, name, start, heuristic) {
  let nbs = gns(node.id, nodes, gridArray);
  for (let neighbor of nbs) {
    und(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, gridArray);
  }
}

function unt(nodes, node, gridArray, target, name, start, heuristic) {
  let nbs = gns(node.id, nodes, gridArray);
  for (let neighbor of nbs) {
    undTwo(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, gridArray);
  }
}

function und(cnn, tn, atn, name, nodes, asn, heuristic, gridArray) {
  let distance = gdi(cnn, tn);
  let weight = tn.weight === 15 ? 15 : 1;
  let dtc = cnn.distance + (weight + distance[0]) * manhattanDistance(tn, atn);
  if (dtc < tn.distance) {
    tn.distance = dtc;
    tn.pno = cnn.id;
    tn.path = distance[1];
    tn.direction = distance[2];
  }
}

function undTwo(cnn, tn, atn, name, nodes, asn, heuristic, gridArray) {
  let distance = gdiTwo(cnn, tn);
  let weight = tn.weight === 15 ? 15 : 1;
  let dtc = cnn.otherdistance + (weight + distance[0]) * manhattanDistance(tn, atn);
  if (dtc < tn.otherdistance) {
    tn.otherdistance = dtc;
    tn.otherpno = cnn.id;
    tn.path = distance[1];
    tn.otherdirection = distance[2];
  }
}

function gns(id, nodes, gridArray) {
  let crd = id.split("-");
  let x = parseInt(crd[0]);
  let y = parseInt(crd[1]);
  let nbs = [];
  let pne;
  if (gridArray[x - 1] && gridArray[x - 1][y]) {
    pne = `${(x - 1).toString()}-${y.toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x + 1] && gridArray[x + 1][y]) {
    pne = `${(x + 1).toString()}-${y.toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x][y - 1]) {
    pne = `${x.toString()}-${(y - 1).toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x][y + 1]) {
    pne = `${x.toString()}-${(y + 1).toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  return nbs;
}

function gdi(no, nt) {
  let ccoo = no.id.split("-");
  let tcoo = nt.id.split("-");
  let x1 = parseInt(ccoo[0]);
  let y1 = parseInt(ccoo[1]);
  let x2 = parseInt(tcoo[0]);
  let y2 = parseInt(tcoo[1]);
  if (x2 < x1) {
    if (no.direction === "up") {
      return [1, ["f"], "up"];
    } else if (no.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (no.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (no.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (no.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (no.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (no.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (no.direction === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (no.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (no.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (no.direction === "left") {
      return [1, ["f"], "left"];
    } else if (no.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (no.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (no.direction === "right") {
      return [1, ["f"], "right"];
    } else if (no.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (no.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

function gdiTwo(no, nt) {
  let ccoo = no.id.split("-");
  let tcoo = nt.id.split("-");
  let x1 = parseInt(ccoo[0]);
  let y1 = parseInt(ccoo[1]);
  let x2 = parseInt(tcoo[0]);
  let y2 = parseInt(tcoo[1]);
  if (x2 < x1) {
    if (no.otherdirection === "up") {
      return [1, ["f"], "up"];
    } else if (no.otherdirection === "right") {
      return [2, ["l", "f"], "up"];
    } else if (no.otherdirection === "left") {
      return [2, ["r", "f"], "up"];
    } else if (no.otherdirection === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (no.otherdirection === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (no.otherdirection === "right") {
      return [2, ["r", "f"], "down"];
    } else if (no.otherdirection === "left") {
      return [2, ["l", "f"], "down"];
    } else if (no.otherdirection === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (no.otherdirection === "up") {
      return [2, ["l", "f"], "left"];
    } else if (no.otherdirection === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (no.otherdirection === "left") {
      return [1, ["f"], "left"];
    } else if (no.otherdirection === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (no.otherdirection === "up") {
      return [2, ["r", "f"], "right"];
    } else if (no.otherdirection === "right") {
      return [1, ["f"], "right"];
    } else if (no.otherdirection === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (no.otherdirection === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

function manhattanDistance(no, nt) {
  let noc = no.id.split("-").map(ele => parseInt(ele));
  let ntco = nt.id.split("-").map(ele => parseInt(ele));
  let xc = Math.abs(noc[0] - ntco[0]);
  let yc = Math.abs(noc[1] - ntco[1]);
  return (xc + yc);
}

function wmd(no, nt, nodes) {
  let noc = no.id.split("-").map(ele => parseInt(ele));
  let ntco = nt.id.split("-").map(ele => parseInt(ele));
  let xc = Math.abs(noc[0] - ntco[0]);
  let yc = Math.abs(noc[1] - ntco[1]);

  if (noc[0] < ntco[0] && noc[1] < ntco[1]) {

    let additionalxc = 0,
        additionalyc = 0;
    for (let cx = noc[0]; cx <= ntco[0]; cx++) {
      let cii = `${cx}-${no.id.split("-")[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }
    for (let cy = noc[1]; cy <= ntco[1]; cy++) {
      let cii = `${ntco[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }

    let otherAdditionalxc = 0,
        otherAdditionalyc = 0;
    for (let cy = noc[1]; cy <= ntco[1]; cy++) {
      let cii = `${no.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }
    for (let cx = noc[0]; cx <= ntco[0]; cx++) {
      let cii = `${cx}-${ntco[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }

    if (additionalxc + additionalyc < otherAdditionalxc + otherAdditionalyc) {
      xc += additionalxc;
      yc += additionalyc;
    } else {
      xc += otherAdditionalxc;
      yc += otherAdditionalyc;
    }
  } else if (noc[0] < ntco[0] && noc[1] >= ntco[1]) {
    let additionalxc = 0,
        additionalyc = 0;
    for (let cx = noc[0]; cx <= ntco[0]; cx++) {
      let cii = `${cx}-${no.id.split("-")[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }
    for (let cy = noc[1]; cy >= ntco[1]; cy--) {
      let cii = `${ntco[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }

    let otherAdditionalxc = 0,
        otherAdditionalyc = 0;
    for (let cy = noc[1]; cy >= ntco[1]; cy--) {
      let cii = `${no.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }
    for (let cx = noc[0]; cx <= ntco[0]; cx++) {
      let cii = `${cx}-${ntco[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }

    if (additionalxc + additionalyc < otherAdditionalxc + otherAdditionalyc) {
      xc += additionalxc;
      yc += additionalyc;
    } else {
      xc += otherAdditionalxc;
      yc += otherAdditionalyc;
    }
  } else if (noc[0] >= ntco[0] && noc[1] < ntco[1]) {
    let additionalxc = 0,
        additionalyc = 0;
    for (let cx = noc[0]; cx >= ntco[0]; cx--) {
      let cii = `${cx}-${no.id.split("-")[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }
    for (let cy = noc[1]; cy <= ntco[1]; cy++) {
      let cii = `${ntco[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }

    let otherAdditionalxc = 0,
        otherAdditionalyc = 0;
    for (let cy = noc[1]; cy <= ntco[1]; cy++) {
      let cii = `${no.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }
    for (let cx = noc[0]; cx >= ntco[0]; cx--) {
      let cii = `${cx}-${ntco[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }

    if (additionalxc + additionalyc < otherAdditionalxc + otherAdditionalyc) {
      xc += additionalxc;
      yc += additionalyc;
    } else {
      xc += otherAdditionalxc;
      yc += otherAdditionalyc;
    }
  } else if (noc[0] >= ntco[0] && noc[1] >= ntco[1]) {
      let additionalxc = 0,
          additionalyc = 0;
      for (let cx = noc[0]; cx >= ntco[0]; cx--) {
        let cii = `${cx}-${no.id.split("-")[1]}`;
        let cnn = nodes[cii];
        additionalxc += cnn.weight;
      }
      for (let cy = noc[1]; cy >= ntco[1]; cy--) {
        let cii = `${ntco[0]}-${cy}`;
        let cnn = nodes[cii];
        additionalyc += cnn.weight;
      }

      let otherAdditionalxc = 0,
          otherAdditionalyc = 0;
      for (let cy = noc[1]; cy >= ntco[1]; cy--) {
        let cii = `${no.id.split("-")[0]}-${cy}`;
        let cnn = nodes[cii];
        additionalyc += cnn.weight;
      }
      for (let cx = noc[0]; cx >= ntco[0]; cx--) {
        let cii = `${cx}-${ntco[1]}`;
        let cnn = nodes[cii];
        additionalxc += cnn.weight;
      }

      if (additionalxc + additionalyc < otherAdditionalxc + otherAdditionalyc) {
        xc += additionalxc;
        yc += additionalyc;
      } else {
        xc += otherAdditionalxc;
        yc += otherAdditionalyc;
      }
    }


  return xc + yc;


}

module.exports = bidirectional;

},{"./astar":13}],15:[function(require,module,exports){
function unweightedSearchAlgorithm(nodes, start, target, nta, gridArray, name) {
  if (!start || !target || start === target) {
    return false;
  }
  let ste = [nodes[start]];
  let en = {start: true};
  while (ste.length) {
    let cnn = name === "bfs" ? ste.shift() : ste.pop();
    nta.push(cnn);
    if (name === "dfs") en[cnn.id] = true;
    cnn.status = "visited";
    if (cnn.id === target) {
      return "scs";
    }
    let cnb = gns(cnn.id, nodes, gridArray, name);
    cnb.forEach(neighbor => {
      if (!en[neighbor]) {
        if (name === "bfs") en[neighbor] = true;
        nodes[neighbor].pno = cnn.id;
        ste.push(nodes[neighbor]);
      }
    });
  }
  return false;
}

function gns(id, nodes, gridArray, name) {
  let crd = id.split("-");
  let x = parseInt(crd[0]);
  let y = parseInt(crd[1]);
  let nbs = [];
  let pne;
  if (gridArray[x - 1] && gridArray[x - 1][y]) {
    pne = `${(x - 1).toString()}-${y.toString()}`
    if (nodes[pne].status !== "wall") {
      if (name === "bfs") {
        nbs.push(pne);
      } else {
        nbs.unshift(pne);
      }
    }
  }
  if (gridArray[x][y + 1]) {
    pne = `${x.toString()}-${(y + 1).toString()}`
    if (nodes[pne].status !== "wall") {
      if (name === "bfs") {
        nbs.push(pne);
      } else {
        nbs.unshift(pne);
      }
    }
  }
  if (gridArray[x + 1] && gridArray[x + 1][y]) {
    pne = `${(x + 1).toString()}-${y.toString()}`
    if (nodes[pne].status !== "wall") {
      if (name === "bfs") {
        nbs.push(pne);
      } else {
        nbs.unshift(pne);
      }
    }
  }
  if (gridArray[x][y - 1]) {
    pne = `${x.toString()}-${(y - 1).toString()}`
    if (nodes[pne].status !== "wall") {
      if (name === "bfs") {
        nbs.push(pne);
      } else {
        nbs.unshift(pne);
      }
    }
  }
  return nbs;
}

module.exports = unweightedSearchAlgorithm;

},{}],16:[function(require,module,exports){
const astar = require("./astar");

function weightedSearchAlgorithm(nodes, start, target, nta, gridArray, name, heuristic) {
  if (name === "astar") return astar(nodes, start, target, nta, gridArray, name)
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = "right";
  let und = Object.keys(nodes);
  while (und.length) {
    let cnn = cnod(nodes, und);
    while (cnn.status === "wall" && und.length) {
      cnn = cnod(nodes, und)
    }
    if (cnn.distance === Infinity) {
      return false;
    }
    nta.push(cnn);
    cnn.status = "visited";
    if (cnn.id === target) return "scs!";
    if (name === "CLA" || name === "greedy") {
      uns(nodes, cnn, gridArray, target, name, start, heuristic);
    } else if (name === "dijkstra") {
      uns(nodes, cnn, gridArray);
    }
  }
}

function cnod(nodes, und) {
  let ccl, index;
  for (let i = 0; i < und.length; i++) {
    if (!ccl || ccl.distance > nodes[und[i]].distance) {
      ccl = nodes[und[i]];
      index = i;
    }
  }
  und.splice(index, 1);
  return ccl;
}

function uns(nodes, node, gridArray, target, name, start, heuristic) {
  let nbs = gns(node.id, nodes, gridArray);
  for (let neighbor of nbs) {
    if (target) {
      und(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, gridArray);
    } else {
      und(node, nodes[neighbor]);
    }
  }
}

function anonb(cnn) {
  let num = 0;
  while (cnn.pno) {
    num++;
    cnn = cnn.pno;
  }
  return num;
}


function und(cnn, tn, atn, name, nodes, asn, heuristic, gridArray) {
  let distance = gdi(cnn, tn);
  let dtc;
  if (atn && name === "CLA") {
    let weight = tn.weight === 15 ? 15 : 1;
    if (heuristic === "manhattanDistance") {
      dtc = cnn.distance + (distance[0] + weight) * manhattanDistance(tn, atn);
    } else if (heuristic === "poweredManhattanDistance") {
      dtc = cnn.distance + tn.weight + distance[0] + Math.pow(manhattanDistance(tn, atn), 2);
    } else if (heuristic === "extraPoweredManhattanDistance") {
      dtc = cnn.distance + (distance[0] + weight) * Math.pow(manhattanDistance(tn, atn), 7);
    }
    let snmd = manhattanDistance(asn, atn);
  } else if (atn && name === "greedy") {
    dtc = tn.weight + distance[0] + manhattanDistance(tn, atn);
  } else {
    dtc = cnn.distance + tn.weight + distance[0];
  }
  if (dtc < tn.distance) {
    tn.distance = dtc;
    tn.pno = cnn.id;
    tn.path = distance[1];
    tn.direction = distance[2];
  }
}

function gns(id, nodes, gridArray) {
  let crd = id.split("-");
  let x = parseInt(crd[0]);
  let y = parseInt(crd[1]);
  let nbs = [];
  let pne;
  if (gridArray[x - 1] && gridArray[x - 1][y]) {
    pne = `${(x - 1).toString()}-${y.toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x + 1] && gridArray[x + 1][y]) {
    pne = `${(x + 1).toString()}-${y.toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x][y - 1]) {
    pne = `${x.toString()}-${(y - 1).toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  if (gridArray[x][y + 1]) {
    pne = `${x.toString()}-${(y + 1).toString()}`
    if (nodes[pne].status !== "wall") nbs.push(pne);
  }
  return nbs;
}


function gdi(no, nt) {
  let ccoo = no.id.split("-");
  let tcoo = nt.id.split("-");
  let x1 = parseInt(ccoo[0]);
  let y1 = parseInt(ccoo[1]);
  let x2 = parseInt(tcoo[0]);
  let y2 = parseInt(tcoo[1]);
  if (x2 < x1) {
    if (no.direction === "up") {
      return [1, ["f"], "up"];
    } else if (no.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (no.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (no.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (no.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (no.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (no.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (no.direction === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (no.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (no.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (no.direction === "left") {
      return [1, ["f"], "left"];
    } else if (no.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (no.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (no.direction === "right") {
      return [1, ["f"], "right"];
    } else if (no.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (no.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

function manhattanDistance(no, nt) {
  let noc = no.id.split("-").map(ele => parseInt(ele));
  let ntco = nt.id.split("-").map(ele => parseInt(ele));
  let xc = Math.abs(noc[0] - ntco[0]);
  let yc = Math.abs(noc[1] - ntco[1]);
  return (xc + yc);
}

function wmd(no, nt, nodes) {
  let noc = no.id.split("-").map(ele => parseInt(ele));
  let ntco = nt.id.split("-").map(ele => parseInt(ele));
  let xc = Math.abs(noc[0] - ntco[0]);
  let yc = Math.abs(noc[1] - ntco[1]);

  if (noc[0] < ntco[0] && noc[1] < ntco[1]) {
    let additionalxc = 0,
        additionalyc = 0;
    for (let cx = noc[0]; cx <= ntco[0]; cx++) {
      let cii = `${cx}-${no.id.split("-")[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }
    for (let cy = noc[1]; cy <= ntco[1]; cy++) {
      let cii = `${ntco[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }

    let otherAdditionalxc = 0,
        otherAdditionalyc = 0;
    for (let cy = noc[1]; cy <= ntco[1]; cy++) {
      let cii = `${no.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }
    for (let cx = noc[0]; cx <= ntco[0]; cx++) {
      let cii = `${cx}-${ntco[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }

    if (additionalxc + additionalyc < otherAdditionalxc + otherAdditionalyc) {
      xc += additionalxc;
      yc += additionalyc;
    } else {
      xc += otherAdditionalxc;
      yc += otherAdditionalyc;
    }
  } else if (noc[0] < ntco[0] && noc[1] >= ntco[1]) {
    let additionalxc = 0,
        additionalyc = 0;
    for (let cx = noc[0]; cx <= ntco[0]; cx++) {
      let cii = `${cx}-${no.id.split("-")[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }
    for (let cy = noc[1]; cy >= ntco[1]; cy--) {
      let cii = `${ntco[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }

    let otherAdditionalxc = 0,
        otherAdditionalyc = 0;
    for (let cy = noc[1]; cy >= ntco[1]; cy--) {
      let cii = `${no.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }
    for (let cx = noc[0]; cx <= ntco[0]; cx++) {
      let cii = `${cx}-${ntco[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }

    if (additionalxc + additionalyc < otherAdditionalxc + otherAdditionalyc) {
      xc += additionalxc;
      yc += additionalyc;
    } else {
      xc += otherAdditionalxc;
      yc += otherAdditionalyc;
    }
  } else if (noc[0] >= ntco[0] && noc[1] < ntco[1]) {
    let additionalxc = 0,
        additionalyc = 0;
    for (let cx = noc[0]; cx >= ntco[0]; cx--) {
      let cii = `${cx}-${no.id.split("-")[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }
    for (let cy = noc[1]; cy <= ntco[1]; cy++) {
      let cii = `${ntco[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }

    let otherAdditionalxc = 0,
        otherAdditionalyc = 0;
    for (let cy = noc[1]; cy <= ntco[1]; cy++) {
      let cii = `${no.id.split("-")[0]}-${cy}`;
      let cnn = nodes[cii];
      additionalyc += cnn.weight;
    }
    for (let cx = noc[0]; cx >= ntco[0]; cx--) {
      let cii = `${cx}-${ntco[1]}`;
      let cnn = nodes[cii];
      additionalxc += cnn.weight;
    }

    if (additionalxc + additionalyc < otherAdditionalxc + otherAdditionalyc) {
      xc += additionalxc;
      yc += additionalyc;
    } else {
      xc += otherAdditionalxc;
      yc += otherAdditionalyc;
    }
  } else if (noc[0] >= ntco[0] && noc[1] >= ntco[1]) {
      let additionalxc = 0,
          additionalyc = 0;
      for (let cx = noc[0]; cx >= ntco[0]; cx--) {
        let cii = `${cx}-${no.id.split("-")[1]}`;
        let cnn = nodes[cii];
        additionalxc += cnn.weight;
      }
      for (let cy = noc[1]; cy >= ntco[1]; cy--) {
        let cii = `${ntco[0]}-${cy}`;
        let cnn = nodes[cii];
        additionalyc += cnn.weight;
      }

      let otherAdditionalxc = 0,
          otherAdditionalyc = 0;
      for (let cy = noc[1]; cy >= ntco[1]; cy--) {
        let cii = `${no.id.split("-")[0]}-${cy}`;
        let cnn = nodes[cii];
        additionalyc += cnn.weight;
      }
      for (let cx = noc[0]; cx >= ntco[0]; cx--) {
        let cii = `${cx}-${ntco[1]}`;
        let cnn = nodes[cii];
        additionalxc += cnn.weight;
      }

      if (additionalxc + additionalyc < otherAdditionalxc + otherAdditionalyc) {
        xc += additionalxc;
        yc += additionalyc;
      } else {
        xc += otherAdditionalxc;
        yc += otherAdditionalyc;
      }
    }

  return xc + yc;


}

module.exports = weightedSearchAlgorithm;

},{"./astar":13}]},{},[4]);
