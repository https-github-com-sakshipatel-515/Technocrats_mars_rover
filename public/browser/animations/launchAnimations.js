const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");

//This function is created to launch animation
function lan(board, scs, type, object, algorithm, heuristic) {
  let nds = object ? board.objectNodesToAnimate.slice(0) : board.ndsToAnimate.slice(0);
  let spd = board.spd === "fast" ?
    0 : board.spd === "average" ?
      100 : 500;
  let snod;
    
    //function timeout
  function tot(index) {
    setTimeout(function () {
      if (index === nds.length) {
        if (object) {
          board.objectNodesToAnimate = [];
          if (scs) {
            board.addShortestPath(board.object, board.start, "object");
            board.clearNodeStatuses();
            let ncss;
            if (board.currentAlgorithm === "bidirectional") {

            } else {
              if (type === "weighted") {
                ncss = weightedSearchAlgorithm(board.nds, board.object, board.target, board.ndsToAnimate, board.boardArray, algorithm, heuristic);
              } else {
                ncss = unweightedSearchAlgorithm(board.nds, board.object, board.target, board.ndsToAnimate, board.boardArray, algorithm);
              }
            }
            document.getElementById(board.object).className = "visitedObjectNode";
            lan(board, ncss, type);
            return;
          } else {
            console.log("Failure.");
            board.reset();
            board.toggleButtons();
            return;
          }
        } else {
          board.ndsToAnimate = [];
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
            snod = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
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
        chg(nds[index])
      } else if (index === nds.length - 1 && board.currentAlgorithm === "bidirectional") {
        chg(nds[index], nds[index - 1], "bidirectional");
      } else {
        chg(nds[index], nds[index - 1]);
      }
      tot(index + 1);
    }, spd);
  }
    
    //function Change
    function chg(cnn, pnn, bidirectional) {
    let chn = document.getElementById(cnn.id);
    let relevantClassNames = ["start", "target", "object", "visitedStartNodeBlue", "visitedStartNodePurple", "visitedObjectNode", "visitedTargetNodePurple", "visitedTargetNodeBlue"];
    if (!relevantClassNames.includes(chn.className)) {
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
    if (pnn) {
      letphn = document.getElementById(pnn.id);
      if (!relevantClassNames.includes(previousHTMLNode.className)) {
        if (object) {
         phn.className = pnn.weight === 15 ? "visitedobject weight" : "visitedobject";
        } else {
         phn.className = pnn.weight === 15 ? "visited weight" : "visited";
        }
      }
    }
  }

  //function Shortest Path Timeout
  function spto(index) {
    setTimeout(function () {
      if (index === snod.length){
        board.reset();
        if (object) {
          spcg(board.nds[board.target], snod[index - 1]);
          board.objectShortestPathNodesToAnimate = [];
          board.shortestPathNodesToAnimate = [];
          board.clearNodeStatuses();
          let ncss;
          if (type === "weighted") {
            ncss = weightedSearchAlgorithm(board.nds, board.object, board.target, board.ndsToAnimate, board.boardArray, algorithm);
          } else {
            ncss = unweightedSearchAlgorithm(board.nds, board.object, board.target, board.ndsToAnimate, board.boardArray, algorithm);
          }
          lan(board, ncss, type);
          return;
        } else {
          spcg(board.nds[board.target], snod[index - 1]);
          board.objectShortestPathNodesToAnimate = [];
          board.shortestPathNodesToAnimate = [];
          return;
        }
      } else if (index === 0) {
        spcg(snod[index])
      } else {
        spcg(snod[index], snod[index - 1]);
      }
      spto(index + 1);
    }, 40);
  }
    
    //function Shortest Path Change
    function spcg(cnn, pnn) {
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
    if (pnn) {
      let phn = document.getElementById(pnn.id);
     phn.className = "shortest-path";
    } else {
      let element = document.getElementById(board.start);
      element.className = "shortest-path";
      element.removeAttribute("style");
    }
  }

  tot(0);

};

module.exports = lan;
