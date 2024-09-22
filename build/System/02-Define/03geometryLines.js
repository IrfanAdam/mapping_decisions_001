function loadLines() {
  const nodesByLane = groupByLanes(slData.nodes);
  // Iterate over each lane and its nodes
  for (const lane in nodesByLane) {
    const nodeSorted = sortLaneByJourney(nodesByLane[lane]);
    const getEndNodes = findNodeOne(lane);
    pushPseudoNode(getEndNodes.left, getEndNodes.right);
    nodeSorted.forEach((node, index) => {
      // Access previous node (except for the first element)
      var nextNode = nodesByLane[lane][index + 1];
      if (index > -1 && nextNode) {
        const sameJou = node.journey === nextNode.journey;
        const sameLov = node.lov === nextNode.lov;
        const gmtDom1 = DOMGeometries.nodes.find((n) => n.name === node.name);
        const gmtDom2 = DOMGeometries.nodes.find(
          (n) => n.name === nextNode.name
        );
        if (!sameJou || !sameLov) {
          setLineDOM(lane, gmtDom1, gmtDom2);
          renderLine(`${gmtDom1.name}-${gmtDom2.name}`);
        }
      }
    });
  }
}

function sortLaneByJourney(nodes) {
  const nodeSorted = nodes.sort((a, b) => {
    const journeyIndexA = journeys.findIndex((j) => j.name === a.journey);
    const journeyIndexB = journeys.findIndex((j) => j.name === b.journey);

    // Handle missing journey matches by pushing them to the end
    const adjustedIndexA =
      journeyIndexA !== -1 ? journeyIndexA : Number.MAX_SAFE_INTEGER;
    const adjustedIndexB =
      journeyIndexB !== -1 ? journeyIndexB : Number.MAX_SAFE_INTEGER;

    return adjustedIndexA - adjustedIndexB;
  });
  return nodeSorted;
}

function updateLineGeometry(lineName, updateAttr) {
  const lineGeometry = DOMGeometries.lines.find((l) => l.name === lineName);
  if (lineGeometry) {
    Object.assign(lineGeometry, updateAttr);
  } else {
    DOMGeometries.lines.push(updateAttr);
  }
}

function setLineDOM(lane, gmtDom1, gmtDom2) {
  const updateAttr = {
    name: `${gmtDom1.name}-${gmtDom2.name}`,
    lane: lane,
    source: gmtDom1,
    target: gmtDom2,
  };
  updateLineGeometry(`${gmtDom1.name}-${gmtDom2.name}`, updateAttr);
}

function groupByLanes(nodes) {
  const nodesByLane = {};
  nodes.forEach((node) => {
    if (!nodesByLane[node.lane]) {
      nodesByLane[node.lane] = [];
    }
    if (node.lov !== "Evidence") {
      nodesByLane[node.lane].push(node);
    }
  });

  return nodesByLane;
}

function pseudoLines() {
  const firstJourney = Object.keys(groupedByLov)[0];
  const firstLane = groupedByLov[firstJourney][0].lane;
  const firstBubble = pseudoNodes(firstLane, firstLane, lov, "Start");
  const lastBubble = pseudoNodes(">", firstLane, lov, "End");
  function pseudoNodes(name, lane, lov, place) {
    const pseudoNode = {
      id: lane,
      name: name,
      type: place,
      lane: lane,
      journey: place,
      lov: lov,
    };
  }
}

function setLinePoint(lineGMT) {
  const src = lineGMT.source;
  const tar = lineGMT.target;

  const relativeY = tar.y - src.y;
  const startSide = relativeY > 0 ? "bottom" : relativeY < 0 ? "top" : null;
  const endSide = relativeY > 0 ? "top" : relativeY < 0 ? "bottom" : null;

  var startX = src.x + src.width + gapMargin;
  var startY = src.y + src.height / 2;
  var endX = tar.x - gapMargin;
  var endY = tar.y + tar.height / 2;
  var startOA = "right";
  var endOA = "left";

  if (startSide === "bottom") {
    startX = src.x + src.width - gapMargin;
    startY = src.y + src.height + gapMargin;
    startOA = "down";
  }
  if (startSide === "bottom" && src.column < tar.column) {
    startX = src.x + src.width + gapMargin;
    startY = src.y + src.height / 2;
    startOA = "right";
  }
  if (endSide === "top") {
    endX = tar.x + gapMargin;
    endY = tar.y - gapMargin;
    endOA = "up";
  }
  if (endSide === "top" && src.column < tar.column) {
    endX = tar.x - gapMargin;
    endY = tar.y + tar.height / 2;
    endOA = "left";
  }
  if (endSide === "bottom") {
    endX = tar.x + gapMargin;
    endY = tar.y + tar.height + gapMargin;
  }
  if (endSide === "bottom" && src.column < tar.column) {
    endX = tar.x - gapMargin;
    endY = tar.y + tar.height / 2;
    endOA = "left";
  }
  const point = {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    startOA: startOA,
    endOA: endOA,
  };
  const updateAttr = {
    start: point.start,
    end: point.end,
    startOA: startOA,
    endOA: endOA,
  };
  updateLineGeometry(`${src.name}-${tar.name}`, updateAttr);
  return point;
}
