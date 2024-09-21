// Add the highlighting functionality
nodes.on("click", function (d) {
  findLinks(d.name);
  highlightNodes(d.name);
  highlightLabels(d.name);
  highlightLinks(d.name);
});

function resetStyles() {
  styleNodes(nodes);
  styleLinks(links);
  styleLabels(labels);
}

const cascadeNodes = [];

const groupedNodesNested = d3
  .nest()
  .key(function (d) {
    return d.group;
  })
  .entries(sortedNodes);

// Create dropdown selections for each group
groupedNodesNested.forEach(function (group) {
  // Create a container div for each dropdown and its label
  var dropdownContainer = d3
    .select("#sidebar")
    .append("div")
    .attr("class", "dropdown-container")
    .style("display", "flex")
    .style("gap", "20px") // Adjust gap between dropdowns as needed
    .style("margin-bottom", "10px");

  // Add a label for each dropdown
  dropdownContainer
    .append("label")
    .attr("for", "node-dropdown-" + group.key)
    .text(group.values[0].groupName + ": ") // Use group name as label text
    .style("margin-right", "15px")
    .style("color", "center")
    .style("color", color(group.key))
    .style("width", "100px");
  // Create the dropdown inside the container
  var dropdown = dropdownContainer
    .append("select")
    .attr("id", "node-dropdown-" + group.key) // Unique ID for each dropdown
    .attr("class", "node-dropdown")
    .style("display", "block")
    .style("margin-bottom", "5px"); // Common class for all dropdowns

  // Populate the dropdown with nodes from the group
  dropdown
    .selectAll("option")
    .data(group.values)
    .enter()
    .append("option")
    .text(function (d) {
      return d.name;
    })
    .attr("value", function (d) {
      return d.name;
    });

  dropdown.on("change", function () {
    var selectedNode = d3.select(this).property("value");
    var selectedDropdownId = this.id; // Get the ID of the selected dropdown
    var selectedGroup = groupedNodesNested.find(
      (group) => "node-dropdown-" + group.key === selectedDropdownId
    );
    findLinks(selectedNode);
    highlightNodes(selectedNode);
    highlightLabels(selectedNode);
    highlightLinks(selectedNode);
  });
});

function findLinks(node) {
  cascadeNodes.length = 0; //resets
  linkSources(node);
  linkTargets(node);
}

function linkSources(node) {
  links.each(function (l) {
    var sourceFound = l.target === node && !cascadeNodes.includes(l.source);
    if (sourceFound) {
      cascadeNodes.push(l.source);
      linkSources(l.source);
    }
  });
}

function linkTargets(node) {
  var hackSources = [];
  links.each(function (l) {
    var targetFound = l.source === node && !cascadeNodes.includes(l.target);
    var inResearch = idToNode[l.source]?.groupName === "Research";
    if (targetFound) {
      cascadeNodes.push(l.target);
      linkTargets(l.target);
      if (!hackSources.includes(l.target)) {
        hackSources.push(l.target);
      }
    }
    if (hackSources.includes(l.target) && inResearch) {
      cascadeNodes.push(l.target);
      linkSources(l.target);
    }
  });
}

function highlightNodes(node) {
  nodes.each(function (d) {
    var isSelected = d.name === node;
    var related = cascadeNodes.includes(d.name);
    d3.select(this)
      .attr("opacity", related || isSelected ? 1 : 0.2)
      .attr("stroke", isSelected ? "black" : "white");
  });
}

function highlightLabels(node) {
  labels.each(function (d) {
    var isSelected = cascadeNodes.includes(d.name) || d.name === node;
    d3.select(this)
      .style("font-size", isSelected ? fontSizeL : fontSizeM)
      .attr("opacity", isSelected ? 1 : 0.2);
  });
}

function highlightLinks(node) {
  var group = {};
  links.each(function (l) {
    var hasSource = cascadeNodes.includes(l.source);
    var hasTarget = cascadeNodes.includes(l.target);
    var direct = l.source === node || l.target === node;
    var cascades = (hasSource && hasTarget) || direct;
    d3.select(this)
      .attr("stroke", cascades ? l.color : "#b8b8b8")
      .attr("opacity", cascades ? 1 : 0.3)
      .style("stroke-width", cascades ? 3 : 0.5);
  });
}

function downloadSVG() {
  var svgString = new XMLSerializer().serializeToString(svg.node());
  var blob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  var url = window.URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = "my_dataviz.svg";
  link.click();
}

var sidebar = document.getElementById("sidebar");

function toggleSidebar() {
  sidebar.classList.toggle("open");
}

sidebar.addEventListener("mouseleave", function () {
  sidebar.classList.remove("open");
});

// .....zoom function

const zoom = d3
  .zoom()
  .scaleExtent([0.2, 5]) // Set the minimum and maximum zoom levels
  .on("zoom", zoomed);

const svg4Zoom = d3.select("#my_dataviz");

svg4Zoom.call(zoom);

function zoomed() {
  // Maintain the x position centered while zooming
  const transform = d3.zoomTransform(this);
  const g = svg4Zoom.selectAll("g");

  // Calculate the new x translation to keep it centered
  const xTranslation = transform.x + (1 - transform.k) * (mainXoff / 2);

  // Apply the new transform with x centered and the regular y translation
  g.attr(
    "transform",
    `translate(${xTranslation}, ${transform.y}) scale(${transform.k})`
  );
}

function zoomOut() {
  svg4Zoom.selectAll("g").attr("transform", d3.zoomTransform(0));
}
