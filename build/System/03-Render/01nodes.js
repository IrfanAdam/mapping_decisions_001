function renderBubble(node) {
  const lane = node.lane;
  var color = laneColors.User;

  if (lane === "Manager Admin") {
    color = laneColors.Admin;
  }
  if (lane === "Sales App") {
    color = laneColors.App;
  }
  if (lane === "Back End Algorithm") {
    color = laneColors.BackEnd;
  }
  const findDOM = findNodeDOM(node);
  const gmtDom = getNodeGeometry(node);
  const newBubble = findDOM
    .attr("transform", `translate(${gmtDom.x}, ${gmtDom.y})`)
    .append("rect")
    .attr("fill", color) // set fill attribute
    .attr("stroke", "rgba(255,255,255,0.32)") // set stroke attribute
    .attr("stroke-width", 4) // set stroke-width attribute
    .attr("width", gmtDom.width)
    .attr("height", gmtDom.height)
    .attr("rx", gmtDom.height / 2)
    .attr("ry", gmtDom.height)
    .attr("opacity", 0.94);
}

function renderText(node) {
  const findDOM = findNodeDOM(node);
  const gmtDom = getNodeGeometry(node);
  const newText = renderTextFirst(node.name, findDOM)
    .attr("x", 1 + sysPadding.nodeHorizontal + gmtDom.textW / 2)
    .attr("y", 1 + sysPadding.nodeVertical + gmtDom.textH / 2);
}

// Function to detect the browser
function getBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Chrome")) return "Chrome";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  else if (userAgent.includes("Firefox")) return "Firefox";
  else return "Other";
}

const browser = getBrowser();

function renderTextFirst(name, DOM) {
  const nodeText = DOM.append("text")
    .attr("fill", "#fff")
    .style("text-transform", "uppercase")
    .style("font-family", "'Helvetica Neue', Helvetica, Arial, sans-serif")
    .style("text-rendering", "geometricPrecision")
    .attr("stroke", "rgba(255,255,255,0.9)") // set stroke attribute
    .attr("letter-spacing", "0.06em")
    .attr("font-size", sysFontSize.node) // Larger font size
    .attr("text-anchor", "middle") // set text-anchor attribute
    .attr("dominant-baseline", "middle") // set alignment-baseline attribute
    .text(name);

  console.log();

  // Apply stroke width based on the detected browser
  const strokeWidth =
    browser === "Safari" ? "0" : browser === "Chrome" ? "0.9" : "0.6"; // Default

  nodeText.attr("stroke-width", strokeWidth);

  return nodeText;
}
