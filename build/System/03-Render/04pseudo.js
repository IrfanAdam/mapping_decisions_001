// pushing nodes
function pushPseudoNode(left, right) {
  const checkStartExists = DOMGeometries.pseudoNodes.some(
    (n) => n.id === left.id && n.lane === left.lane
  );
  const checkEndExists = DOMGeometries.pseudoNodes.some(
    (n) => n.id === right.id && n.lane === right.lane
  );
  if (!checkStartExists && !checkEndExists) {
    const nodeId = DOMGeometries.pseudoNodes.length + 1;
    const startNode = {
      id: nodeId,
      name: left.lane,
      lane: left.lane,
      column: 0,
      section: left.section,
      label: returnLabel(left.lane).start,
    };
    const endNode = {
      id: nodeId + 1,
      name: "End",
      lane: left.lane,
      column: journeys.length - 1,
      section: left.section,
      label: returnLabel(left.lane).end,
    };
    DOMGeometries.pseudoNodes.push(startNode);
    DOMGeometries.pseudoNodes.push(endNode);

    setTextD(startNode, "Start");
    setTextD(endNode, "End");

    setSubtext(startNode, endNode);

    var gmtDom1 = DOMGeometries.pseudoNodes.find(
      (n) => n.id === nodeId && n.lane === left.lane
    );
    var gmtDom2 = DOMGeometries.nodes.find(
      (n) => n.id === left.id && n.lane === left.lane
    );
    var gmtDom3 = DOMGeometries.nodes.find(
      (n) => n.id === right.id && n.lane === right.lane
    );
    var gmtDom4 = DOMGeometries.pseudoNodes.find(
      (n) => n.id === endNode.id && n.lane === right.lane
    );
    setLineDOM(left.lane, gmtDom1, gmtDom2);
    setLineDOM(right.lane, gmtDom3, gmtDom4);
    renderLine(`${gmtDom1.name}-${gmtDom2.name}`);
    renderLine(`${gmtDom3.name}-${gmtDom4.name}`);
  }
}

function renderPseudoNode(node, nodeDOM) {
  const lane = node.lane;
  var color = laneColors.User;

  if (lane === "Manager Admin") {
    color = laneColors.Admin;
  }
  if (lane === "Sales App") {
    color = laneColors.App;
  }
  if (lane === "Back End Algorithm") {
    color = laneColors.BackEnd;
  }
  const newBubble = nodeDOM
    .attr("transform", `translate(${node.x}, ${node.y})`)
    .append("rect")
    .attr("fill", color) // set fill attribute
    .attr("stroke", "rgba(255,255,255,0.32)") // set stroke attribute
    .attr("stroke-width", 4) // set stroke-width attribute
    .attr("width", node.width)
    .attr("height", node.height)
    .attr("rx", node.height / 2)
    .attr("ry", node.height)
    .attr("opacity", 0.94);

  const newText = renderTextFirst(node.name, nodeDOM)
    .attr("x", 1 + sysPadding.nodeHorizontal + node.textW / 2)
    .attr("y", 1 + sysPadding.nodeVertical + node.textH / 2);
}

function setSubtext(start, end) {
  const lane = start.lane;
  const labelSpace = 12;
  var color = laneColors.User;

  if (lane === "Manager Admin") {
    color = laneColors.Admin;
  }
  if (lane === "Sales App") {
    color = laneColors.App;
  }
  if (lane === "Back End Algorithm") {
    color = laneColors.BackEnd;
  }

  const startLabel = renderSubtext(start.label, newSys, color);
  const startW = startLabel.node().getBBox().width;
  startLabel
    .attr("x", start.x + start.width + labelSpace)
    .attr("y", start.y + start.height / 2);

  const endLabel = renderSubtext(end.label, newSys, color);
  const endW = endLabel.node().getBBox().width;
  endLabel
    .attr("x", end.x - endW - labelSpace)
    .attr("y", end.y + end.height / 2);
}
