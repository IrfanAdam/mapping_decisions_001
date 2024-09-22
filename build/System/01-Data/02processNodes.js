const journeys = [];

journData.forEach((value) => {
  if (!journeys.some((j) => j.name === value.Name)) {
    journeys.push({
      name: value.Name,
      number: value.Step,
    });
  }
});

journeys.sort((a, b) => a.number - b.number);

const firstStep = { name: "Start", number: 0 }; // Adjust 'name' and 'number' as needed
const lastStep = { name: "End", number: journeys.length + 1 }; // Adjust 'number' as needed

journeys.unshift(firstStep);
journeys.push(lastStep);
const jlen = journeys.length;

const slData = {
  nodes: [],
  links: [],
};

// conditions before pushing data
sysData.forEach((node) => {
  const nodeName = node.Name;
  if (!slData.nodes.some((node) => node.name === nodeName)) {
    const nextSteps = node["Next Step"]
      .split("), ")
      .filter((step) => step.trim() !== "");
    const prevSteps = node["Prev Step"]
      .split("), ")
      .filter((step) => step.trim() !== "");
    pushSysNode(node);
  }
});

// pushing nodes
function pushSysNode(node) {
  const nodeId = slData.nodes.length + 1;
  slData.nodes.push({
    id: nodeId,
    name: node.Name,
    type: node["Step Type"],
    lane: node["Swimlane"].split(" (https:")[0],
    journey: node["Journeys"].split(" (https:")[0],
    lov: node["Line of Visibility"],
    label: "",
  });
}

// ways to find nodes
// ....
function findNodeByID(nodeID) {
  return slData.nodes.find((node) => node.id === nodeID);
}

function findNodeByName(name) {
  const returnNode = slData.nodes.find((node) => node.name === name);
  return returnNode;
}

function findNodesByJourneyAndLOV(journey, lov) {
  return slData.nodes.filter(
    (node) => node.journey === journey && node.lov === lov
  );
}
