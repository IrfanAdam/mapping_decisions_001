// Find the nodes to connect
const node1 = findNodeByName("Explore Data");
const node2 = findNodeByName("Finalize");

if (node1 && node2) {
  const pos1 = getNodePosition(node1);
  const pos2 = getNodePosition(node2);

  // Create a stepped path
  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveStepBefore);

  // Calculate control point for the curve
  const controlPoint = {
    x: 32 + (pos1.x + pos2.x) / 2,
    y: Math.min(pos1.y, pos2.y), // Adjust this value to change the curve
  };

  const controlPoint2 = {
    x: 32 + (pos1.x + pos2.x) / 2,
    y: Math.min(pos1.y, pos2.y) + 171, // Adjust this value to change the curve
  };

  // Create a path element
  const path = svgSys
    .append("path")
    .attr("d", line([pos1, controlPoint, controlPoint2, pos2]))
    .attr("stroke", "gray")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("stroke-dashoffset", 0);

  // Animate the path and arrow
  const totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(totalLength * 4)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .on("end", function () {
      d3.select(this)
        .attr("stroke-dasharray", null)
        .attr("stroke-dashoffset", null);
    });

  // Create a curved path with rounded corners
  const pathData = createRoundedPath(
    pos1,
    controlPoint,
    controlPoint2,
    pos2,
    16
  );
  const path2 = svgSys
    .append("path")
    .attr("d", pathData)
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round");

  const p2Length = path2.node().getTotalLength();
  path2
    .attr("stroke-dasharray", p2Length)
    .attr("stroke-dashoffset", p2Length)
    .transition()
    .duration(p2Length * 6)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .on("end", function () {
      d3.select(this)
        .attr("stroke-dasharray", null)
        .attr("stroke-dashoffset", null);
    });

  // Function to generate a path with rounded corners
  function createRoundedPath(start, control1, control2, end, radius) {
    return `
      M ${start.x},${start.y}
      L ${control1.x - radius},${control1.y}
      A ${radius},${radius} 0 0 1 ${control1.x},${control1.y + radius}
      L ${control2.x},${control2.y - radius}
      A ${radius},${radius} 0 0 1 ${control2.x - radius},${control2.y}
      L ${end.x},${end.y}
    `;
  }

  //experiment for creating arrow
  const path3a = "M 10 50 L 150 50 M 150 50 L 150 50 L 150 50";
  const path3b = "M 10 50 L 150 50 M 145 45 L 150 50 L 145 55";

  const path3 = svgSys
    .append("path")
    .attr("d", path3a)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("stroke-dasharray", 240)
    .attr("stroke-dashoffset", 240);

  path3
    .transition()
    .duration(900)
    .ease(d3.easeCubicInOut)
    .attr("stroke-dashoffset", 0)
    .on("end", function () {
      d3.select(this).transition().duration(240).attr("d", path3b);
    });
}

// /,,,, some old code÷
function newLink(params) {
  // Function to generate a path with rounded corners
  const start = 0;
  const control1 = 0;
  // const pathCompute = "
  //     M ${start.x},${start.y}
  //     L ${control1.x - radius},${control1.y}
  //     A ${radius},${radius} 0 0 1 ${control1.x},${control1.y + radius}
  //     L ${control2.x},${control2.y - radius}
  //     A ${radius},${radius} 0 0 1 ${control2.x - radius},${control2.y}
  //     L ${end.x},${end.y}
  //   ";

  const path3a = "M 10 50 L 150 50 M 150 50 L 150 50 L 150 50";
  const path3b = "M 10 50 L 150 50 M 145 45 L 150 50 L 145 55";

  const path3 = svgSys
    .append("path")
    .attr("d", path3a)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("stroke-dasharray", 240)
    .attr("stroke-dashoffset", 240);

  path3
    .transition()
    .duration(900)
    .ease(d3.easeCubicInOut)
    .attr("stroke-dashoffset", 0)
    .on("end", function () {
      d3.select(this).transition().duration(240).attr("d", path3b);
    });
}
