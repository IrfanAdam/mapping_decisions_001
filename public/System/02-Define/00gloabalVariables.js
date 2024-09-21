//...............................................................
// declaring styles for container to scale
var actualW = 2800;
var actualH = 300;
var svgWidthWeb = "99vw";
var svgHeightWeb = "32vh";
var svgWidth = 2764;
var svgHeight = 200;

// defining gloabal variables to access anytime
var sysPadding = {
    nodeVertical: 8,
    nodeHorizontal: 12,
    subtextX: 4,
    subtextY: 2,
    rowX: 0,
    rowY: 0,
    section: 20,
    container: 24,
  },
  sysSpacing = {
    nodesX: -12,
    columnsX: 72,
    sectionsY: 32,
    rowsY: 50,
  },
  sysRadius = {
    nodesX: 250,
    columnsY: 50,
    rowsY: 50,
    left: 50,
    links: 24,
    lines: 60,
  },
  sysSize = {
    actualW: 2800,
    actualH: 300,
    svgWidthWeb: "100vw",
    svgHeightWeb: "20vw",
    svgWidth: 2764,
    svgHeight: 277,
    lineStroke: 20,
    linkStroke: 2.6,
  },
  sysFontSize = {
    node: 14,
    lov: 10,
    label: 14,
  },
  sysMinSize = {
    textH: 12,
    nodeH: 28,
    nodeW: 30,
    gridW: 360,
    gridH: 20,
    sectionW: 0,
    sectionH: 0,
    containerW: 0,
    containerH: 0,
  };

// here all the DOM attributed will be pushed
const DOMGeometries = {
  nodes: [],
  links: [],
  lines: [],
  pseudoNodes: [],
};

const searchStep = 12;
const avoidObs = 8;
const overlapThreshold = 4;
const gapMargin = 12; //used for lines
const moveAvoid = 12; //used for lines

// Initial creation of node objects
function createNodeGeometry(n) {
  const node = {
    id: n.id,
    name: n.name,
  };
  DOMGeometries.nodes.push(node);
}

var laneColors = {
  App: "#FF4B4B",
  User: "#A54BFF",
  Admin: "#FFB01E",
  BackEnd: "#8D8D8D",
};

// rendering base svg container
const newSys = d3
  .select("#sbp")
  .append("svg")
  .attr("fill", "white")
  .attr("viewBox", `0 0 ${sysMinSize.containerW} ${sysMinSize.containerH}`)
  .attr("width", svgWidthWeb)
  .attr("height", svgHeightWeb)
  .append("g");

function setContainerSize() {
  // setting global values
  sysMinSize.gridH =
    sysMinSize.textH + (sysPadding.nodeVertical + sysPadding.section) * 2;

  //edit variable
  const secSpc = sysSpacing.sectionsY;
  const colSpc = sysSpacing.columnsX;

  const gridW = sysMinSize.gridW;
  const gridH = sysMinSize.gridH;

  const allGridsX = jlen * gridW;
  const colSpacing = colSpc * (jlen - 1);

  const allGridsY = slen * gridH;
  const secSpacing = secSpc * (slen - 1);

  const secPadding = sysPadding.section * 2;
  const conPadding = sysPadding.container * 2;

  const allPadding = secPadding + conPadding;

  // setting global values
  sysMinSize.containerW = allGridsX + colSpacing + allPadding;
  sysMinSize.containerH = allGridsY + secSpacing + allPadding;

  // Update the SVG container attributes to reflect the new dimensions
  d3.select("#sbp svg").attr(
    "viewBox",
    `0 0 ${sysMinSize.containerW} ${sysMinSize.containerH}`
  );
}
