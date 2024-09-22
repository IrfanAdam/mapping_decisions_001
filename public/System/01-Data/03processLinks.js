let newLinkCounter = 0;
const processedLinks = new Map();

sysData.forEach((node) => {
  const nodeName = node.Name.trim();
  const nextSteps = node["Next Step"]
    .split("),")
    .map((step) => step.trim())
    .filter((step) => step !== "");
  const prevSteps = node["Prev Step"]
    .split("),")
    .map((step) => step.trim())
    .filter((step) => step !== "");
  generateLinks(node, nextSteps, prevSteps);
});

function generateLinks(node, nextSteps, prevSteps) {
  let nodeSources = [];
  let nodeTargets = [];
  nextSteps.forEach((step) => {
    const targetName = step.split(" (https:")[0].trim();
    nodeTargets.push(targetName);
    pushSysLink(node.Name, targetName);
  });

  prevSteps.forEach((step) => {
    const sourceName = step.split(" (https:")[0].trim();
    nodeSources.push(sourceName);
    pushSysLink(sourceName, node.Name);
  });

  // Check for intersection between sources and targets
  const hasMatch = nodeSources.some((source) => nodeTargets.includes(source));

  if (hasMatch) {
    // console.log(nodeSources, node.Name, nodeTargets);
  }
}

function pushSysLink(sourceName, targetName) {
  const forwardKey = `${sourceName}-${targetName}`;
  const backwardKey = `${targetName}-${sourceName}`;

  const src = findNodeByName(sourceName);
  const tar = findNodeByName(targetName);

  if (src && tar) {
    const sameBlock = src.journey === tar.journey && src.lov === tar.lov;
    const sameLane = src.lane === tar.lane;

    if (!sameBlock && !sameLane) {
      let newLink;
      let linkType = "Normal";

      if (processedLinks.has(backwardKey)) {
        const existingLink = processedLinks.get(backwardKey);
        existingLink.type = "Both";
        linkType = "Both";
        // console.log(
        //   `Updating to bidirectional: ${targetName} <-> ${sourceName}`
        // );
      }

      if (!processedLinks.has(forwardKey)) {
        // console.log(sourceName, targetName);
        newLink = {
          name: forwardKey,
          source: sourceName,
          target: targetName,
          type: linkType,
        };
        slData.links.push(newLink);
        processedLinks.set(forwardKey, newLink);
        newLinkCounter++;
        // console
        //   .log
        //   `New link added: ${sourceName} -> ${targetName} (Type: ${linkType})`
        //   ();
      } else {
        // console.log(`Link already exists: ${sourceName} -> ${targetName}`);
      }
    } else {
      // console.log(
      //   `Skipping link (same block or lane): ${sourceName} -> ${targetName}`
      // );
    }
  } else {
    // console.warn(`Node not found: ${!src ? sourceName : targetName}`);
  }
}
