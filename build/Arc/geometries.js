//...............................................................

// set the dimensions and margins of the graph
var margin = {
    top: 250,
    right: 50,
    bottom: 50,
    left: 50
  },
  width = 2200,
  height = 1800,
  viewPortW = 2200,
  viewPortH = 1000,
  fontSizeM = 8,
  fontSizeL = 12

var mainYoff = 120 // Y position for Journeys nodes
var childYoff = 420 // Y position for other nodes
var mainXoff = 540 // Y position for Journeys nodes
var childXoff = 0 // Y position for other nodes

// Adjust this value for more/less space between nodes within a group
var nodeSizeL = 16
var nodeSizeM = 10
var nodeSpacingC = 24
var nodeSpacingM = 32

var groupSpacingMap = {
  0: -120, // Spacing for Journeys
  1: -120, // Spacing for group 1
  2: 60, // Spacing for group 2
  3: 360, // Spacing for group 3
  4: 20  // Spacing for group 4
}

var xPositions = {};
var yPositions = {};

// Calculate x and y positions
function setNodePositions(groupedNodes) {
  var currentX = 0
  Object.keys(groupedNodes).forEach(group => {
    var groupWidthC = (groupedNodes[group].length) * nodeSpacingC
    var groupWidthM = (groupedNodes[group].length) * nodeSpacingM
    groupedNodes[group].forEach(node => {
      if (node.group === 0) {
        xPositions[node.name] = mainXoff + currentX + groupWidthM / 2
        yPositions[node.name] = mainYoff
        currentX += nodeSpacingM
      } else {
        xPositions[node.name] =  childXoff + currentX + groupWidthC / 2
        yPositions[node.name] = childYoff
        currentX += nodeSpacingC
      }
    })
    currentX += groupSpacingMap[group]
  })
}

setNodePositions(groupedNodes)

// List of groups
var allGroups = Object.keys(groupedNodes);

// A color scale for groups
var color = d3.scaleOrdinal()
  .domain(allGroups)
  .range(d3.schemePaired);

// A linear scale for node size
var size = d3.scaleLinear()
  .domain([16, 1])
  .range([10, 2]);

// In my input data, links are provided between nodes -id-, NOT between node names.
// So I have to do a link between this id and the name
var idToNode = {};
sortedNodes.forEach(function(n) {
  idToNode[n.name] = n;
});

//...............................................................