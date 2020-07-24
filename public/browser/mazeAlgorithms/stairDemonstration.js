//This function creates simple Stair Pattern
function sdem(board) {
  let cidx = board.height - 1;
  let cidy = 0;
  let rss = ["start", "target", "object"];
  while (cidx > 0 && cidy < board.width) {
    let cii = `${cidx}-${cidy}`;
    let cnn = board.nodes[cii];
    let chn = document.getElementById(cii);
    if (!rss.includes(cnn.status)) {
      cnn.status = "wall";
      board.wallsToAnimate.push(chn);
    }
    cidx--;
    cidy++;
  }
  while (cidx < board.height - 2 && cidy < board.width) {
    let cii = `${cidx}-${cidy}`;
    let cnn = board.nodes[cii];
    let chn = document.getElementById(cii);
    if (!rss.includes(cnn.status)) {
      cnn.status = "wall";
      board.wallsToAnimate.push(chn);
    }
    cidx++;
    cidy++;
  }
  while (cidx > 0 && cidy < board.width - 1) {
    let cii = `${cidx}-${cidy}`;
    let cnn = board.nodes[cii];
    let chn = document.getElementById(cii);
    if (!rss.includes(cnn.status)) {
      cnn.status = "wall";
      board.wallsToAnimate.push(chn);
    }
    cidx--;
    cidy++;
  }
}

module.exports = sdem;