function appendCirc(point, color) {
  newSys
    .append("circle")
    .attr("cx", point.x)
    .attr("cy", point.y)
    .attr("r", 0.4) // Adjust the radius as needed
    .style("fill", color); // Adjust the fill color as needed
}

function renderLink(link, gmtDom1, gmtDom2) {
  const relativeY = gmtDom2.y - gmtDom1.y;
  const startSide = relativeY > 0 ? "bottom" : "top";
  const endSide = relativeY > 0 ? "top" : "bottom";

  const startXpos = adjustlLinkEndPoints(link, startSide, gmtDom1);
  const endXpos = adjustlLinkEndPoints(link, endSide, gmtDom2);

  const updatePos = {
    start: setLinkPoint(gmtDom1, startSide, startXpos),
    end: setLinkPoint(gmtDom2, endSide, endXpos),
  };

  // appendCirc(updatePos.start, "blue"); //... use for bidirectional
  // appendCirc(updatePos.end, "red");
  updateLinkGeometry(link, updatePos);
  paintPath(link.name, endSide);
}

const linkObstacles = [];

function paintPath(linkName, endPos) {
  const gmtLinkDOM = DOMGeometries.links.find((l) => l.name === linkName);
  const linkPath = findPath(
    gmtLinkDOM.start,
    gmtLinkDOM.end,
    DOMGeometries.nodes,
    sysMinSize.containerW,
    sysMinSize.containerH
  );
  linkObstacles.push(linkPath);
  if (linkPath) {
    const foundDOM = SBPlinks.filter((d) => d.name === linkName);
    const arrBlade = 5;
    const end = linkPath[linkPath.length - 1];
    var arrowY = end.y + (endPos === "bottom" ? arrBlade : -arrBlade);
    const startArrow = `
        ${createRoundedPath(linkPath, sysRadius.links)} 
        L ${end.x},${end.y} 
        M ${end.x},${end.y}
        L ${end.x},${end.y} 
        `;
    const endArrow = `
        ${createRoundedPath(linkPath, sysRadius.links)} 
        L ${end.x - arrBlade},${arrowY} 
        M ${end.x},${end.y}
        L ${end.x + arrBlade},${arrowY} 
        `;

    const lane = slData.nodes.find(
      (n) => n.name === gmtLinkDOM.source.name
    ).lane;
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

    const thepath = foundDOM
      .attr("d", startArrow)
      .attr("stroke", color)
      .attr("fill", "none")
      .attr("stroke-width", sysSize.linkStroke)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("opacity", 0.5);

    var smartPathLength = thepath.node().getTotalLength() + 12;

    // Create a transition to animate the path
    thepath
      .attr("stroke-dasharray", smartPathLength)
      .attr("stroke-dashoffset", smartPathLength)
      .transition()
      .delay(400)
      .duration(1200) // Adjust duration as needed
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0)
      .on("end", function () {
        d3.select(this).transition().duration(240).attr("d", endArrow);
      });
  }
}

function createRoundedPath(points, radius) {
  if (points.length < 2) return "";

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);

    const segmentLength1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const segmentLength2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    const min_segment_length = Math.min(segmentLength1, segmentLength2);
    const actual_radius = Math.min(radius, min_segment_length / 2);

    const x1 = curr.x - actual_radius * Math.cos(angle1);
    const y1 = curr.y - actual_radius * Math.sin(angle1);
    const x2 = curr.x + actual_radius * Math.cos(angle2);
    const y2 = curr.y + actual_radius * Math.sin(angle2);

    path += ` L ${x1},${y1}`;
    path += ` Q ${curr.x},${curr.y} ${x2},${y2}`;
  }

  path += ` L ${points[points.length - 1].x},${points[points.length - 1].y}`;

  return path;
}
