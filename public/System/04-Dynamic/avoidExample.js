// Usage example:
// rendering base svg container

const svgWidthA = 500;
const svgHeightA = 500;

const smartPath = d3
  .select("#mindfulPath")
  .append("svg")
  .attr("width", svgWidthA)
  .attr("height", svgHeightA)
  .append("g");

// Example start and end points
const start = { x: 50, y: 50 };
const end = { x: 450, y: 450 };

// ... (rest of your code)

// Add circles for start and end points
smartPath
  .append("circle")
  .attr("cx", start.x)
  .attr("cy", start.y)
  .attr("r", 2)
  .attr("fill", "blue");

smartPath
  .append("circle")
  .attr("cx", end.x)
  .attr("cy", end.y)
  .attr("r", 2)
  .attr("fill", "green");

// Example obstacles that don't block the path
const obstacles = [
  { x: 0, y: 100, width: 120, height: 50 },
  { x: 100, y: 170, width: 100, height: 50 },
  { x: 100, y: 100, width: 50, height: 50 },
  { x: 300, y: 100, width: 50, height: 50 },
  { x: 200, y: 300, width: 50, height: 50 },
];

obstacles.forEach((obstacle) => {
  smartPath
    .append("rect")
    .attr("x", obstacle.x)
    .attr("y", obstacle.y)
    .attr("width", obstacle.width)
    .attr("height", obstacle.height)
    .attr("fill", "gray"); // Adjust fill color as needed
});

const pathKnows = findPath(start, end, obstacles, svgWidthA, svgHeightA);

function paintPath(pathKnows) {
  if (pathKnows) {
    const lineGenerator = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y);

    const thepath = smartPath
      .append("path")
      .attr("d", lineGenerator(pathKnows))
      .attr("stroke", "red")
      .attr("fill", "none");

    var smartPathLength = thepath.node().getTotalLength();

    // Create a transition to animate the path
    thepath
      .attr("stroke-dasharray", smartPathLength)
      .attr("stroke-dashoffset", smartPathLength)
      .transition()
      .duration(1200) // Adjust duration as needed
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }
}
