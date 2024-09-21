sysData.forEach((node) => {
  const nodeName = node.Name;
  const nextSteps = node["Next Step"]
    .split("), ")
    .filter((step) => step.trim() !== "");
  const prevSteps = node["Prev Step"]
    .split("), ")
    .filter((step) => step.trim() !== "");
  generateLinks(nodeName, nextSteps, prevSteps);
});

function generateLinks(nodeName, nextSteps, prevSteps) {
  if (nextSteps.length > 0) {
    nextSteps.forEach((step) => {
      // pushing next steps
      const targetName = step.split(" (https:")[0];
      pushSysLink(nodeName, targetName, "Forward");
    });
  }
  if (prevSteps.length > 0) {
    prevSteps.forEach((step) => {
      // pushing previous steps
      const sourceName = step.split(" (https:")[0];
      pushSysLink(sourceName, nodeName, "Backward");
    });
  }
}

function pushSysLink(sourceName, targetName, type) {
  const newLink = !slData.links.some(
    (link) => link.source === sourceName && link.target === targetName
  );
  if (newLink) {
    const src = findNodeByName(sourceName);
    const tar = findNodeByName(targetName);
    const sameBlock = src.journey === tar.journey && src.lov === tar.lov;
    const sameLane = src.lane === tar.lane;
    if (!sameBlock && !sameLane) {
      // only link if occupies in different grid
      slData.links.push({
        name: sourceName + "-" + targetName,
        source: sourceName,
        target: targetName,
        type: type,
      });
    }
    updateBidirectionalLinks();
  }
}

function updateBidirectionalLinks() {
  slData.links.forEach((link) => {
    // Look for the reverse link
    const reverseLinkIndex = slData.links.findIndex(
      (revLink) =>
        revLink.source === link.target && revLink.target === link.source
    );

    // If a reverse link is found, mark both as "Both"
    if (reverseLinkIndex !== -1) {
      link.type = "Both";
      slData.links[reverseLinkIndex].type = "Both";
    }
  });
}
