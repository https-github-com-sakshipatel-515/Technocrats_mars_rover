//This function creates basic Weight Maze
function wdem(board) {
  let cidx = board.height - 1;
  let cidy = 35;
  while (cidx > 5) {
    let cii = `${cidx}-${cidy}`;
    let cel = document.getElementById(cii);
    board.wallsToAnimate.push(cel);
    let cnn = board.nodes[cii];
    cnn.status = "wall";
    cnn.weight = 0;
    cidx--;
  }
  for (let cidx = board.height - 2; cidx > board.height - 11; cidx--) {
    for (let cidy = 1; cidy < 35; cidy++) {
      let cii = `${cidx}-${cidy}`;
      let cel = document.getElementById(cii);
      board.wallsToAnimate.push(cel);
      let cnn = board.nodes[cii];
      if (cidx === board.height - 2 && cidy < 35 && cidy > 26) {
        cnn.status = "wall";
        cnn.weight = 0;
      } else {
        cnn.status = "unvisited";
        cnn.weight = 15;
      }
    }
  }
}

module.exports = wdem;