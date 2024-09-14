// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("viewBox", `0 0 ${viewPortW} ${viewPortH}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("width", "100vw")
  .attr("height", "100vh")
  .append("g");

// Add the links first, to maintain order
var links = svg.selectAll("mylinks").data(newData.links).enter().append("path");

// Position links
function linksPos(links) {
  links.attr("d", function (d) {
    var startX = xPositions[idToNode[d.source].name];
    var endX = xPositions[idToNode[d.target].name];
    var startY = yPositions[idToNode[d.source].name];
    var endY = yPositions[idToNode[d.target].name];
    if (idToNode[d.source].group === 0) {
      // Vertical arc for "Journeys" links
      var radii = Math.abs(startY - endY) / 2;
      var midY = (startY + endY) / 2;
      var controlX1 = startX + 10; // Shift to the right slightly for the curve
      var controlX2 = endX + 10; // Shift to the right slightly for the curve

      return `M ${startX},${startY} C ${controlX1},${midY} ${controlX2},${midY} ${endX},${endY}`;
    } else {
      // Horizontal arc for other links
      var radii = (startX - endX) / 2;
      var arcFlag = startX < endX ? 0 : 1;
      return `M ${startX},${startY} A ${radii},${radii} 0 0 ${arcFlag} ${endX},${endY}`;
    }
  });
}

function styleLinks(links) {
  return links
    .style("fill", "none")
    .attr("stroke", "#b8b8b8")
    .style("stroke-width", 0.5)
    .attr("opacity", 1);
}

linksPos(links);
styleLinks(links);

links.classed("link-animation", true);

// Load nodes
var nodes = svg
  .selectAll("mynodes")
  .data(sortedNodes)
  .enter()
  .append("circle")
  .classed("node", true);

// Update node position
function nodesPos(nodes) {
  nodes
    .attr("cx", function (d) {
      return xPositions[d.name];
    })
    .attr("cy", function (d) {
      return yPositions[d.name];
    })
    .attr("r", function (d) {
      return size(d.group === 0 ? nodeSizeL : nodeSizeM); // Slightly larger for Journeys
    });
}

// Update node styles
function styleNodes(nodes) {
  return nodes
    .style("fill", function (d) {
      return color(d.group);
    })
    .attr("stroke", "white")
    .style("cursor", "pointer")
    .attr("opacity", 1);
}

nodesPos(nodes);
styleNodes(nodes);

// Aadd label
var labels = svg
  .selectAll("mylabels")
  .data(sortedNodes)
  .enter()
  .append("text")
  .text(function (d) {
    return d.name;
  });

// Postion label
function labelsPos(labels) {
  labels
    .attr("x", function (d) {
      return xPositions[d.name] + fontSizeL;
    })
    .attr("y", function (d) {
      return yPositions[d.name] + 2; // Position above the nodes
    })
    .attr("transform", function (d) {
      return (
        "rotate(-90," + xPositions[d.name] + "," + yPositions[d.name] + ")"
      );
    });
}

function styleLabels(labels) {
  return labels
    .style("text-anchor", "start")
    .attr("font-family", "Helvetica")
    .style("font-size", fontSizeM)
    .attr("opacity", 1);
}

labelsPos(labels);
styleLabels(labels);

//...............................................................
