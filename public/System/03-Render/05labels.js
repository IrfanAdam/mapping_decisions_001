function renderSubtext(name, DOM, color) {
  const text = DOM.append("text")
    .style("font-family", "'Helvetica Neue', Helvetica, Arial, sans-serif")
    .attr("letter-spacing", "0.03em")
    .attr("font-size", sysFontSize.label) // Larger font size
    .attr("dominant-baseline", "middle") // set alignment-baseline attribute
    .text(name)
    .attr("stroke-width", 0.6)
    .attr("stroke", color)
    .attr("fill", color)
    .attr("text-anchor", "start");
  return text;
}

function renderLabels(name, DOM) {
  const text = DOM.append("text")
    .attr("fill", "rgba(25,25,25,0.6)")
    .style("text-transform", "uppercase")
    .style("font-family", "'Helvetica Neue', Helvetica, Arial, sans-serif")
    .attr("stroke", "rgba(25,25,25,0.6)") // set stroke attribute
    .attr("stroke-width", "1.2") // set stroke attribute
    .attr("letter-spacing", "0.1em")
    .attr("font-size", sysFontSize.lov) // Larger font size
    .attr("text-anchor", "middle") // set text-anchor attribute
    .attr("dominant-baseline", "middle") // set alignment-baseline attribute
    .text(name);
  return text;
}

function returnLabel(lane) {
  var labels = {};
  if (lane === "User") {
    labels = {
      start: "from onboarding +3 journeys",
      end: "to reporting +12 journeys",
    };
  }
  if (lane === "Sales App") {
    labels = {
      start: "from inactive state",
      end: "standby until launched again",
    };
  }
  if (lane === "Manager Admin") {
    labels = {
      start: "from regular monitoring",
      end: "checking real-time KPIs",
    };
  }
  if (lane === "Back End Algorithm") {
    labels = {
      start: "responds to updates",
      end: "continues parallel processing",
    };
  }
  return labels;
}
