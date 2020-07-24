//This function is used to create Recursive Division Maze
function rdm(board, rst, ren, cst, cend, ornt, swl) {
  if (ren < rst || cend < cst) {
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
          board.wallsToAnimate.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    swl = true;
  }
  if (ornt === "horizontal") {
    let pr = [];
    for (let number = rst; number <= ren; number += 2) {
      pr.push(number);
    }
    let pc = [];
    for (let number = cst - 1; number <= cend + 1; number += 2) {
      pc.push(number);
    }
    let rri = Math.floor(Math.random() * pr.length);
    let rci = Math.floor(Math.random() * pc.length);
    let cro = pr[rri];
    let cra = pc[rci];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (r === cro && c !== cra && c >= cst - 1 && c <= cend + 1) {
        let chn = document.getElementById(node);
        if (chn.className !== "start" && chn.className !== "target" && chn.className !== "object") {
          board.wallsToAnimate.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (cro - 2 - rst > cend - cst) {
      rdm(board, rst, cro - 2, cst, cend, ornt, swl);
    } else {
      rdm(board, rst, cro - 2, cst, cend, "vertical", swl);
    }
    if (ren - (cro + 2) > cend - cst) {
      rdm(board, cro + 2, ren, cst, cend, "vertical", swl);
    } else {
      rdm(board, cro + 2, ren, cst, cend, "vertical", swl);
    }
  } else {
    let pc = [];
    for (let number = cst; number <= cend; number += 2) {
      pc.push(number);
    }
    let pr = [];
    for (let number = rst - 1; number <= ren + 1; number += 2) {
      pr.push(number);
    }
    let rci = Math.floor(Math.random() * pc.length);
    let rri = Math.floor(Math.random() * pr.length);
    let cco = pc[rci];
    let rra = pr[rri];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (c === cco && r !== rra && r >= rst - 1 && r <= ren + 1) {
        let chn = document.getElementById(node);
        if (chn.className !== "start" && chn.className !== "target" && chn.className !== "object") {
          board.wallsToAnimate.push(chn);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (ren - rst > cco - 2 - cst) {
      rdm(board, rst, ren, cst, cco - 2, "vertical", swl);
    } else {
      rdm(board, rst, ren, cst, cco - 2, ornt, swl);
    }
    if (ren - rst > cend - (cco + 2)) {
      rdm(board, rst, ren, cco + 2, cend, "horizontal", swl);
    } else {
      rdm(board, rst, ren, cco + 2, cend, ornt, swl);
    }
  }
};

module.exports = rdm;