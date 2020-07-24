//function to Get the Distance
function gds(no, nt) {
  let ccoo = nodeOne.id.split("-");
  let tcoo = nt.id.split("-");
  let x1 = parseInt(ccoo[0]);
  let y1 = parseInt(ccoo[1]);
  let x2 = parseInt(tcoo[0]);
  let y2 = parseInt(tcoo[1]);
  if (x2 < x1) {
    if no.direction === "up") {
      return [1, ["f"], "up"];
    } else if no.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if no.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if no.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if no.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if no.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if no.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if no.direction === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if no.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if no.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if no.direction === "left") {
      return [1, ["f"], "left"];
    } else if no.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if no.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if no.direction === "right") {
      return [1, ["f"], "right"];
    } else if no.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if no.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

module.exports = gds;
