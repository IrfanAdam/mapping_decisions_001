// iterating through loops to get the right grid pos
// here it iterates through lov first then journeys
function processNodes(allDOMNodes, callback) {
  for (const lov in allDOMNodes) {
    if (lov !== "Evidence") {
      //iterates through lov
      const groupedByLov = allDOMNodes[lov];
      for (const journey in groupedByLov) {
        //iterates through journeys
        const nodesInJourney = groupedByLov[journey];
        declareNodes(nodesInJourney);
        renderNodesStack(nodesInJourney);
        checkNumNodes(groupedByLov); // keeping this here to check for rows later
      }
    }
  }
  callback();
}

processNodes(groupedSysNodes, () => {
  loadLines();
  loadConnections();
  addBG();
});

function declareNodes(nodes) {
  let accumulateX = 0;
  nodes.forEach((node) => {
    setTextDimension(node);
    setPosNodeDOM(node, accumulateX);
    accumulateX += getNodeGeometry(node).width + sysSpacing.nodesX;
    if (sysMinSize.gridW < accumulateX) {
      sysMinSize.gridW = accumulateX;
    }
  });
}

function renderNodesStack(nodes) {
  declareNodes(nodes);
  nodes.forEach((node) => {
    renderBubble(node);
    renderText(node);
  });
}

function setTextDimension(node) {
  const finddDOM = SBPnodes.filter((d) => d.name === node.name);
  const DOMObj = finddDOM.node();

  const newText = renderTextFirst(node.name, finddDOM);

  const textSize = {
    textW: newText.node().getBBox().width,
    textH: newText.node().getBBox().height,
  };

  sysMinSize.textH = textSize.textH;

  updateNodeGeometry(node, textSize);

  newText.remove();
}

// Function to create a new node and add it to the data structure
function setPosNodeDOM(node, accumulateX) {
  const gmtDOM = getNodeGeometry(node);
  // positions in grid
  const colPos = journeys.findIndex((j) => j.name === node.journey);
  const secPos = lovOrder.indexOf(node.lov) - 1;

  // define coordinates
  const startY = sysPadding.container + sysPadding.section;
  const x = colPos * (sysMinSize.gridW + sysSpacing.columnsX) + accumulateX;
  const y = secPos * (sysMinSize.gridH + sysSpacing.sectionsY);
  const updateAttr = {
    x: x,
    y: startY + y,
    section: secPos,
    column: colPos,
    width: gmtDOM.textW + sysPadding.nodeHorizontal * 2,
    height: gmtDOM.textH + sysPadding.nodeVertical * 2,
    lane: node.lane,
  };
  setContainerSize();
  updateNodeGeometry(node, updateAttr);
}

function positionText(n) {
  const findDOM = findNodeDOM(node);
  const gmtDom = getNodeGeometry(node.__data__.name);
  const newText = findDOM
    // .attr("transform", `translate(${12 + nodeWidth / 2}, ${nodeHeight / 2})`);
    .attr("x", sysPadding.nodeHirizontal + gmtDom.width / 2)
    .attr("y", sysPadding.nodeVertical + gmtDom.height / 2);
}

function updateNodeGeometry(node, updateAttr) {
  const nodeGeometry = DOMGeometries.nodes.find((n) => n.name === node.name);
  if (nodeGeometry) {
    Object.assign(nodeGeometry, updateAttr);
  }
}

// these are random checks + but can be used to set minH, width of grids
function checkNumNodes(groupedByLov) {
  const allJourneys = Object.values(groupedByLov);
  const firstGroup = allJourneys[0]; // nodes in first stack of lov
  const lastGroup = allJourneys[Object.keys(groupedByLov).length - 1]; // nodes in last stack of lov
  checkNumLanes(firstGroup, lastGroup);
}

function checkNumLanes(firstGroup, lastGroup) {
  // lanes at begining and end
  const uniqLanesStart = new Set(firstGroup.map((node) => node.lane)).size;
  const uniqLanesEnd = new Set(lastGroup.map((node) => node.lane)).size;
}

function findNodeOne(lane) {
  let [minX, maxX, minXNode, maxXNode] = [Infinity, -Infinity, null, null];

  DOMGeometries.nodes.forEach((node) => {
    if (node.lane === lane) {
      if (node.x < minX) {
        minX = node.x;
        minXNode = node;
      }
      if (node.x > maxX) {
        maxX = node.x;
        maxXNode = node;
      }
    }
  });

  return {
    left: minXNode,
    right: maxXNode,
  };
}

function setTextD(data, side) {
  var newNode = newSys.append("g").classed("Bubblenodes", true);
  const newText = renderTextFirst(data.name, newNode);
  var nodeGeometry = {};
  nodeGeometry = DOMGeometries.pseudoNodes.find(
    (n) => n.id === data.id && n.lane === data.lane
  );

  const textSize = {
    textW: newText.node().getBBox().width,
    textH: newText.node().getBBox().height,
  };

  var width = textSize.textW + sysPadding.nodeHorizontal * 2;
  var height = textSize.textH + sysPadding.nodeVertical * 2;

  // define coordinates
  const startXY = sysPadding.container + sysPadding.section;
  var x = 0;
  var y = 0;

  if (side === "Start") {
    x = startXY + data.column * (sysMinSize.gridW + sysSpacing.columnsX);
    y = startXY + data.section * (sysMinSize.gridH + sysSpacing.sectionsY);
  }
  if (side === "End") {
    var slideRight = sysMinSize.gridW - width;
    x =
      slideRight +
      startXY +
      data.column * (sysMinSize.gridW + sysSpacing.columnsX);
    y = startXY + data.section * (sysMinSize.gridH + sysSpacing.sectionsY);
  }

  const updateAttr = {
    x: x,
    y: y,
    width: width,
    height: height,
    textW: textSize.textW,
    textH: textSize.textH,
  };

  if (nodeGeometry) {
    Object.assign(nodeGeometry, updateAttr);
    renderPseudoNode(nodeGeometry, newNode);
  }

  newText.remove();
}
