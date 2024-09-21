function downloadSVG() {
  const svg = d3.select("#sbp").select("svg");
  const clonedSvg = svg.node().cloneNode(true);

  // Ensure all defs are properly cloned
  const defs = svg.select("defs");
  if (defs.size() > 0) {
    const clonedDefs = defs.node().cloneNode(true);
    clonedSvg.insertBefore(clonedDefs, clonedSvg.firstChild);
  }

  // Remove any remaining animation properties
  d3.select(clonedSvg)
    .selectAll("path")
    .attr("stroke-dasharray", null)
    .attr("stroke-dashoffset", null);

  const svgString = new XMLSerializer().serializeToString(clonedSvg);

  // Create a data URL with a more specific MIME type
  const dataUrl =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);

  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "journey_map.svg";

  link.textContent = "Download SVG";
  document.body.appendChild(link);
}

setTimeout(downloadSVG, 2400);
