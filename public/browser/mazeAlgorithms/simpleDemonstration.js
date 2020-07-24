//This function creates Basic Random Maze
function sde(board) {
  let cid = board.width - 10;
  for (let counter = 0; counter < 7; counter++) {
    let cido = Math.floor(board.height / 2) - counter;
    let cidt = Math.floor(board.height / 2) + counter;
    let cidO = `${cido}-${cid}`;
    let cidT = `${cidt}-${cid}`;
    let currentElementOne = document.getElementById(cidO);
    let currentElementTwo = document.getElementById(cidT);
    board.wallsToAnimate.push(currentElementOne);
    board.wallsToAnimate.push(currentElementTwo);
    let cnon = board.nodes[cidO];
    let cntw = board.nodes[cidT];
    cnon.status = "wall";
    cnon.weight = 0;
    cntw.status = "wall";
    cntw.weight = 0;
  }
}

module.exports = sde;