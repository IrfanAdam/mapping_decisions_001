//...............................................................


var drag = d3.drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended)

// Update the nodes selection to apply the drag behavior only to journey nodes
nodes.filter(function(d) { 
  return d.group === 0; 
}).call(drag)

var simulation = d3.forceSimulation(sortedNodes)
  .force("link", d3.forceLink().id(function(d) { return d.name; }))
  .force("charge", d3.forceManyBody().strength(-50))
  .force("center", d3.forceCenter(margin.left + width / 2, height / 2));

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.offsetX = d3.event.x - xPositions[d.name]
  d.offsetY = d3.event.y - yPositions[d.name]
  d.x = d3.event.x 
  d.y = d3.event.y
  d.fx = xPositions[d.name]
  d.fy = yPositions[d.name]
}

function dragged(d) {
  d.fx = d3.event.x - d.offsetX
  d.fy = d3.event.y - d.offsetY
  nodes.filter(function(node) { return node.name === d.name; })
    .attr("cx", d.fx)
    .attr("cy", d.fy)
  // Update position of associated label
  labels.filter(function(label) { return label.name === d.name; })
    .attr("x", d.fx + fontSizeL)
    .attr("y", d.fy + 2)
    .attr("transform", "rotate(-90," + d.fx + "," + d.fy + ")")
  // Update links connected to this node
  links.filter(function(l) { return l.source === d.name || l.target === d.name; })
    .attr('d', function(l) {
      var startX = l.source === d.name ? d.fx : xPositions[idToNode[l.source].name];
      var startY = l.source === d.name ? d.fy : yPositions[idToNode[l.source].name];
      var endX = l.target === d.name ? d.fx : xPositions[idToNode[l.target].name];
      var endY = l.target === d.name ? d.fy : yPositions[idToNode[l.target].name];
      var radii = Math.abs(startY - endY) / 2;
      var midY = (startY + endY) / 2;
      var controlX1 = startX + 10;
      var controlX2 = endX + 10;
      return `M ${startX},${startY} C ${controlX1},${midY} ${controlX2},${midY} ${endX},${endY}`;
    });
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.offsetX = null
  d.offsetY = null
  xPositions[d.name] = d.fx
  yPositions[d.name] = d.fy
}

function resetPositions() {
  setNodePositions(groupedNodes)
  nodesPos(nodes)
  linksPos(links)
  labelsPos(labels)
  // Update simulation alpha
  simulation.alphaTarget(0);
}
