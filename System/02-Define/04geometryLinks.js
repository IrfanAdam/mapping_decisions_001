var SBPlinks = newSys
  .selectAll("SysLinks")
  .data(slData.links)
  .enter()
  .append("path")
  .classed("Bubblelinks", true);

const gapFromNode = 3;
var spaceBetArrows = 24;

function addLinkArray(link, nodeSide, nodeDOM) {
  const linkDOM = DOMGeometries.links.find((l) => l.name === link.name);
  nodeDOM.topLinks = nodeDOM.topLinks || [];
  nodeDOM.bottomLinks = nodeDOM.bottomLinks || [];
  if (nodeSide === "top") {
    if (!nodeDOM.topLinks.some((l) => l.name === link.name)) {
      nodeDOM.topLinks.push(linkDOM);
    }
  }
  if (nodeSide === "bottom") {
    if (!nodeDOM.bottomLinks.some((l) => l.name === link.name)) {
      nodeDOM.bottomLinks.push(linkDOM);
    }
  }
}

function loadConnections() {
  for (let index = 0; index < slData.links.length; index++) {
    const link = slData.links[index];
    const gmtDom1 = DOMGeometries.nodes.find((n) => n.name === link.source);
    const gmtDom2 = DOMGeometries.nodes.find((n) => n.name === link.target);
    setLinkDOM(link, gmtDom1, gmtDom2);
    renderLink(link, gmtDom1, gmtDom2);
  }
}

function setLinkDOM(link, gmtDom1, gmtDom2) {
  const relativeY = gmtDom2.y - gmtDom1.y;
  const startSide = relativeY > 0 ? "bottom" : "top";
  const endSide = relativeY > 0 ? "top" : "bottom";
  const updateAttr = {
    name: link.name,
    source: gmtDom1,
    target: gmtDom2,
  };
  updateLinkGeometry(link, updateAttr);
  addLinkArray(link, startSide, gmtDom1);
  addLinkArray(link, endSide, gmtDom2);
}

function adjustlLinkEndPoints(link, nodeSide, nodeDOM) {
  var linksArray =
    nodeSide === "bottom" ? nodeDOM.bottomLinks : nodeDOM.topLinks;
  var indexPos = linksArray.findIndex((l) => l.name === link.name);
  var availWidth = spaceBetArrows * (linksArray.length - 1);
  var halfW = availWidth / 2;
  var xPosi = indexPos * spaceBetArrows;
  var xPos = xPosi - halfW;
  return xPos;
}

function setLinkPoint(nodeDom, nodeSide, xPos) {
  const point = {
    x: xPos + (nodeDom.x + nodeDom.width / 2),
    y:
      nodeDom.y +
      (nodeSide === "bottom" ? nodeDom.height + gapFromNode : -gapFromNode),
    nodeSide: nodeSide,
  };
  return point;
}

function updateLinkGeometry(link, updateAttr) {
  const linkGeometry = DOMGeometries.links.find((l) => l.name === link.name);
  if (linkGeometry) {
    Object.assign(linkGeometry, updateAttr);
  } else {
    DOMGeometries.links.push(updateAttr);
  }
}
