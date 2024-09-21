// manually defining order of line of visibility
const lovOrder = [
  "Evidence",
  "Main Action",
  "Front Stage",
  "Back Stage",
  "Support",
];
const slen = lovOrder.length - 1;

var SBPnodes = newSys
  .selectAll("SysNodes")
  .data(slData.nodes)
  .enter()
  .append("g")
  .classed("Bubblenodes", true);

// helps stacking the nodes per row after pushing the extracted data in DOM
const groupedSysNodes = lovOrder.reduce((groups, lov) => {
  if (lov !== "Evidence") {
    const nodesInLov = SBPnodes.filter((d) => d.lov === lov).nodes();

    // Create an array for journeys within this LoV
    groups[lov] = [];

    // Group nodes by journeys within the LoV
    nodesInLov.forEach((node) => {
      const nodeData = node.__data__;
      const journey = nodeData.journey; // Use __data__ to access bound data
      const jIndex = journeys.findIndex((j) => j.name === journey);
      if (jIndex !== -1) {
        groups[lov][journey] = groups[lov][journey] || [];
        groups[lov][journey].push(nodeData);
        createNodeGeometry(nodeData);
      }
    });
  }
  return groups;
}, {});

function findNodeDOM(node) {
  const foundDOM = SBPnodes.filter((d) => d.name === node.name);
  const DOMObj = foundDOM.node();
  return foundDOM;
}

function getNodeGeometry(node) {
  const gmtDOM = DOMGeometries.nodes.find((n) => n.name === node.name);
  return gmtDOM;
}
