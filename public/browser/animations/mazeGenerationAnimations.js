function mazeGenerationAnimations(board) {
  let nds = board.wallsToAnimate.slice(0);
  let spd = board.spd === "fast" ?
    5 : board.spd === "average" ?
      25 : 75;
  function tot(index) {
    setTimeout(function () {
        if (index === nds.length){
          board.wallsToAnimate = [];
          board.toggleButtons();
          return;
        }
        nds[index].className = board.nds[nds[index].id].weight === 15 ? "unvisited weight" : "wall";
        tot(index + 1);
    }, spd);
  }

  tot(0);
};

module.exports = mazeGenerationAnimations;
