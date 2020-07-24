const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");

//function Launch Instant Animation
function lia(board, scs, type, object, algorithm, heuristic) {
  let nds = object ? board.objectNodesToAnimate.slice(0) : board.ndsToAnimate.slice(0);
  let snds;
  for (let i = 0; i < nds.length; i++) {
    if (i === 0) {
      chg(nds[i]);
    } else {
      chg(nds[i], nds[i - 1]);
    }
  }
  if (object) {
    board.objectNodesToAnimate = [];
    if (scs) {
      board.drawShortestPath(board.object, board.start, "object");
      board.clearNodeStatuses();
      let ncss;
      if (type === "weighted") {
        ncss = weightedSearchAlgorithm(board.nds, board.object, board.target, board.ndsToAnimate, board.boardArray, algorithm, heuristic);
      } else {
        ncss = unweightedSearchAlgorithm(board.nds, board.object, board.target, board.ndsToAnimate, board.boardArray, algorithm);
      }
      lia(board, ncss, type);
      snds = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      console.log("Failure.");
      board.reset();
      return;
    }
  } else {
    board.ndsToAnimate = [];
    if (scs) {
      if (board.isObject) {
        board.drawShortestPath(board.target, board.object);
      } else {
        board.drawShortestPath(board.target, board.start);
      }
      snds = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      console.log("Failure");
      board.reset();
      return;
    }
  }

  let j;
  for (j = 0; j < snds.length; j++) {
    if (j === 0) {
      spc(snds[j]);
    } else {
      spc(snds[j], snds[j - 1]);
    }
  }
  board.reset();
  if (object) {
    spc(board.nds[board.target], snds[j - 1]);
    board.objectShortestPathNodesToAnimate = [];
    board.shortestPathNodesToAnimate = [];
    board.clearNodeStatuses();
    let ncss;
    if (type === "weighted") {
      ncss = weightedSearchAlgorithm(board.nds, board.object, board.target, board.ndsToAnimate, board.boardArray, algorithm);
    } else {
      ncss = unweightedSearchAlgorithm(board.nds, board.object, board.target, board.ndsToAnimate, board.boardArray, algorithm);
    }
    lia(board, ncss, type);
  } else {
    spc(board.nds[board.target], snds[j - 1]);
    board.objectShortestPathNodesToAnimate = [];
    board.shortestPathNodesToAnimate = [];
  }

  //function Change
  function chg(cnn, pnn) {
    let chn = document.getElementById(cnn.id);
    let rcn = ["start", "shortest-path", "instantshortest-path", "instantshortest-path weight"];
    if (pnn) {
      let phn = document.getElementById(pnn.id);
      if (!rcn.includes(phn.className)) {
        if (object) {
          phn.className = pnn.weight === 15 ? "instantvisitedobject weight" : "instantvisitedobject";
        } else {
          phn.className = pnn.weight === 15 ? "instantvisited weight" : "instantvisited";
        }
      }
    }
  }

   //function Shortest Path Change
  function spc(cnn, pnn) {
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
    if (pnn) {
      let phn = document.getElementById(pnn.id);
      phn.className = pnn.weight === 15 ? "instantshortest-path weight" : "instantshortest-path";
    } else {
      let element = document.getElementById(board.start);
      element.className = "startTransparent";
    }
  }

};

module.exports = lia;
