var SBPlinks = newSys
  .selectAll("SysLinks")
  .data(slData.links)
  .enter()
  .append("path")
  .classed("Bubblelinks", true);

const gapFromNode = 3;
var spaceBetArrows = 16;

function loadConnections() {
  for (let index = 0; index < slData.links.length; index++) {
    const link = slData.links[index];
    const gmtDom1 = DOMGeometries.nodes.find((n) => n.name === link.source);
    const gmtDom2 = DOMGeometries.nodes.find((n) => n.name === link.target);
    setLinkDOM(link, gmtDom1, gmtDom2);

    const relativeY = gmtDom2.y - gmtDom1.y;
    const startSide = relativeY > 0 ? "bottom" : "top";
    const endSide = relativeY > 0 ? "top" : "bottom";
    addLinktoNode(link, startSide, gmtDom1);
    addLinktoNode(link, endSide, gmtDom2);
  }
  setLinkPos();
  renderLinks();
}

function setLinkDOM(link, gmtDom1, gmtDom2) {
  const setAttr = {
    name: link.name,
    source: gmtDom1,
    target: gmtDom2,
  };
  updateLinkGeometry(link, setAttr);
}

function addLinktoNode(link, nodeSide, nodeGMT) {
  const linkDOMgmt = DOMGeometries.links.find((l) => l.name === link.name);
  nodeGMT.topLinks = nodeGMT.topLinks || [];
  nodeGMT.bottomLinks = nodeGMT.bottomLinks || [];
  if (nodeSide === "top") {
    if (!nodeGMT.topLinks.some((l) => l.name === link.name)) {
      nodeGMT.topLinks.push(linkDOMgmt);
    }
  }
  if (nodeSide === "bottom") {
    if (!nodeGMT.bottomLinks.some((l) => l.name === link.name)) {
      nodeGMT.bottomLinks.push(linkDOMgmt);
    }
  }
}

function setLinkPos(link, gmtDom1, gmtDom2) {
  for (let index = 0; index < slData.links.length; index++) {
    const link = slData.links[index];
    const gmtDom1 = DOMGeometries.nodes.find((n) => n.name === link.source);
    const gmtDom2 = DOMGeometries.nodes.find((n) => n.name === link.target);

    const relativeY = gmtDom2.y - gmtDom1.y;
    const startSide = relativeY > 0 ? "bottom" : "top";
    const endSide = relativeY > 0 ? "top" : "bottom";

    const startXpos = adjustlLinkEndPoints(link, startSide, gmtDom1);
    const endXpos = adjustlLinkEndPoints(link, endSide, gmtDom2);

    // const Xpos = adjustlLinkEndPoints(link, nodeSide, nodeDOM);
    // return Xpos;

    const updatePos = {
      start: setLinkPoint(gmtDom1, startSide, startXpos),
      end: setLinkPoint(gmtDom2, endSide, endXpos),
    };

    // appendCirc(updatePos.start, "blue"); //... use for bidirectional
    // appendCirc(updatePos.end, "red");
    updateLinkGeometry(link, updatePos);
  }
}

function adjustlLinkEndPoints(link, nodeSide, nodeDOM) {
  var linksArray =
    nodeSide === "bottom" ? nodeDOM.bottomLinks : nodeDOM.topLinks;

  var posLinks = [];
  var outLinks = linksArray.filter((l) => l.source.name === nodeDOM.name);
  var inLinks = linksArray.filter((l) => l.target.name === nodeDOM.name);

  inLinks
    .sort(
      (a, b) =>
        a.source.x + a.source.width / 2 - (b.source.x + b.source.width / 2)
    )
    .forEach((inLink) => {
      posLinks.push({
        links: [inLink],
        orderNum: inLinks.findIndex((l) => l.name === inLink.name),
        xVal: inLink.source.x + inLink.source.width / 2,
        type: "incoming",
      });
    });

  var newPosLinks = setLinksOrder(outLinks, inLinks, posLinks);

  var Xpos = getOrderPosLink(link, newPosLinks);

  var xDisplace = getXdisplace(Xpos, newPosLinks);

  return xDisplace;
}

function setLinksOrder(outLinks, inLinks, posLinks) {
  // Calculate median of outgoing links
  const medianOutX =
    outLinks.length > 0
      ? outLinks[Math.floor(outLinks.length / 2)].target.x +
        outLinks[Math.floor(outLinks.length / 2)].target.width / 2 -
        100
      : null;

  // Find the index where the medianOutX should be placed within posLinks
  let medianOrder = posLinks.findIndex(
    (posLink) =>
      medianOutX <=
      inLinks[posLink.orderNum].source.x +
        inLinks[posLink.orderNum].source.width / 2
  );

  if (medianOutX !== null) {
    // Find the index where the medianOutX should be placed within posLinks
    let medianOrder = posLinks.findIndex(
      (posLink) => medianOutX <= posLink.xVal
    );

    // If medianOutX is larger than all incoming xVals, place it at the end
    if (medianOrder === -1) medianOrder = posLinks.length;

    // Add the outgoing links with the determined orderNum
    posLinks.push({
      links: outLinks, // All outgoing links
      orderNum: medianOrder, // Their order in the combined sorted array
      xVal: medianOutX, // Median x position of the outgoing links
      type: "outgoing",
    });

    // Sort the posLinks again to ensure order after adding the outgoing links
    posLinks.sort((a, b) => a.xVal - b.xVal);

    // Reassign the orderNum to maintain consistent ordering after the addition
    posLinks.forEach((posLink, index) => {
      posLink.orderNum = index;
    });
  }
  return posLinks;
}

function getOrderPosLink(link, posLinks) {
  const pointPosX = posLinks.find((posLink) => {
    // Check if any link within the 'links' array has the matching name
    return posLink.links.some((l) => l.name === link.name);
  });
  return pointPosX;
}

function getXdisplace(Xpos, posLinks) {
  var position = Xpos.orderNum;
  var availWidth = spaceBetArrows * (posLinks.length - 1);

  var halfW = availWidth / 2;
  var xPosi = position * spaceBetArrows;

  return xPosi - halfW;
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
