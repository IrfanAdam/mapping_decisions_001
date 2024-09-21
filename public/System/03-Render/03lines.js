function renderLine(lineName) {
  const getLineGMT = DOMGeometries.lines.find((n) => n.name === lineName);
  const point = setLinePoint(getLineGMT);
  const newLine = createRightAnglePath(
    getLineGMT.start,
    getLineGMT.end,
    getLineGMT.startOA,
    getLineGMT.endOA
  );
  paintLine(getLineGMT, newLine);
}

const linesContainer = newSys.insert("g", ":first-child");

function paintLine(getLineGMT, linePath) {
  if (linePath) {
    const roundedLine = createRoundedPath(linePath, sysRadius.lines);

    const lane = getLineGMT.lane;

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

    const theLine = linesContainer
      .append("path")
      .attr("d", roundedLine)
      .attr("stroke", color)
      .attr("fill", "none")
      .attr("stroke-width", sysSize.lineStroke)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("opacity", 0.2);

    var smartPathLength = theLine.node().getTotalLength();

    // Create a transition to animate the path
    theLine
      .attr("stroke-dasharray", smartPathLength)
      .attr("stroke-dashoffset", smartPathLength)
      .transition()
      .delay(300)
      .duration((200 * smartPathLength) / 50) // Adjust duration as needed
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }
}

function createRightAnglePath(start, end, startOrientation, endOrientation) {
  var midX = (start.x + end.x) / 2;
  var midY = (start.y + end.y) / 2;

  let points = [start];

  // Function to check if a point intersects an obstacle
  function isPointInObstacle(point, obstacle) {
    return (
      point.x >= obstacle.x &&
      point.x <= obstacle.x + obstacle.width &&
      point.y >= obstacle.y &&
      point.y <= obstacle.y + obstacle.height
    );
  }

  // Adjust midX and midY to avoid obstacles
  DOMGeometries.nodes.forEach((obstacle) => {
    if (startOrientation === "right" || startOrientation === "left") {
      // Check if horizontal segment intersects with the obstacle
      if (isPointInObstacle({ x: midX, y: start.y }, obstacle)) {
        // Adjust midX to avoid the obstacle
        midX = obstacle.x + obstacle.width + moveAvoid; // Move to the right of the obstacle
      }
      if (isPointInObstacle({ x: midX, y: end.y }, obstacle)) {
        // Adjust midY if the second control point intersects
        midY = obstacle.y + obstacle.height + moveAvoid; // Move below the obstacle
      }
    } else {
      // Check if vertical segment intersects with the obstacle
      if (isPointInObstacle({ x: start.x, y: midY }, obstacle)) {
        // Adjust midY to avoid the obstacle
        midY = obstacle.y - moveAvoid; // Move above the obstacle
      }
      if (isPointInObstacle({ x: end.x, y: midY }, obstacle)) {
        // Adjust midX if the second control point intersects
        midX = obstacle.x - moveAvoid; // Move left of the obstacle
      }
    }
  });

  if (startOrientation === "right" || startOrientation === "left") {
    points.push({ x: midX, y: start.y });
    points.push({ x: midX, y: end.y });
  } else {
    points.push({ x: start.x, y: midY });
    points.push({ x: end.x, y: midY });
  }

  points.push(end);

  return points;
}
