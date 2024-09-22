const newData = {
  groups: [],
  nodes: [],
  links: [],
};

const journeyOrder = [
  "Alert or Initiate",
  "View Progress",
  "Study & Reflect",
  "Planning",
  "Sales",
  "Review",
];

// Extract relevant data and create groups
featuresData.forEach((feature) => {
  const solutionsArray = feature.Solutions.split("), ");
  solutionsArray.forEach((solution) => {
    const truncatedSolution = solution.split(" (https:")[0];
    addLink(feature["Feature Name"], truncatedSolution);
    addUniqueNode(feature["Feature Name"], "Features", 3);
    addUniqueNode(truncatedSolution, "Solutions", 4);
  });
});

// Extract relevant data and create groups
opposData.forEach((oppo) => {
  const opportunityName = oppo["Opportunity Name"];
  const featuresString = oppo["Needed Features"];
  const journeysString = oppo["Used In Journeys"];
  const researchNote = oppo["Note"];
  addUniqueNode(opportunityName, "Opportunities", 2);
  featuresString.split("), ").forEach((feature) => {
    const featureName = feature.split(" (https:")[0];
    addLink(opportunityName, featureName);
  });
  journeysString.split("), ").forEach((journey) => {
    const journeyName = journey.split(" (https:")[0];
    addLink(journeyName, opportunityName);
    addUniqueNode(journeyName, "Journeys", 0);
  });
  researchNote.split("), ").forEach((research) => {
    const researchName = research.split(" (https:")[0];
    addLink(researchName, opportunityName);
    addUniqueNode(researchName, "Research", 1);
  });
});

function addUniqueNode(nodeName, groupName, group) {
  if (!newData.nodes.some((node) => node.name === nodeName)) {
    if (group === 0) {
      // Check for "Journeys" group
      const nodeIndex = journeyOrder.indexOf(nodeName);
      newData.nodes.splice(nodeIndex, 0, {
        name: nodeName,
        groupName: groupName,
        group: group,
      });
    } else {
      newData.nodes.push({
        name: nodeName,
        groupName: groupName,
        group: group,
      });
    }
  }
}

function addLink(source, target) {
  newData.links.push({
    source: source,
    target: target,
    color: function () {
      // Find the source node in sortedNodes
      const sourceNode = sortedNodes.find((node) => node.name === source);
      if (sourceNode) {
        return color(sourceNode.group); // Use color scale based on source node group
      } else {
        return "grey"; // Fallback color if source node not found
      }
    },
  });
}

// Sort nodes by group
var sortedNodes = newData.nodes.sort(function (a, b) {
  return a.group - b.group;
});

// Manually group nodes by group
var groupedNodes = {};
sortedNodes.forEach((node) => {
  if (!groupedNodes[node.group]) {
    groupedNodes[node.group] = [];
  }
  groupedNodes[node.group].push(node);
});
//...............................................................
