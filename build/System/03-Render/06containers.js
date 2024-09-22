function addBG() {
  const lovRects = lovOrder.slice(1);

  let accumY = sysPadding.container;

  const secSpc = sysSpacing.sectionsY;
  const colSpc = sysSpacing.columnsX;

  const gridW = sysMinSize.gridW;
  const gridH = sysMinSize.gridH;

  const allGridsX = jlen * gridW;
  const allGridsY = slen * gridH;

  const secSpacing = secSpc * (slen - 1);
  const colSpacing = colSpc * (jlen - 1);

  const secPadding = sysPadding.section * 2;
  const conPadding = sysPadding.container * 2;

  const secW = allGridsX + colSpacing + secPadding;
  const secH = sysMinSize.gridH;

  lovRects.forEach((element) => {
    const lovTrack = newSys.insert("g", ":first-child");
    const getTextDOM = renderLabels(element, lovTrack);
    const labelW = getTextDOM.node().getBBox().width;
    const labelH = getTextDOM.node().getBBox().height;
    lovTrack
      .insert("rect", ":first-child")
      .attr("fill", "#eee")
      .attr("width", secW)
      .attr("height", secH)
      .attr("opacity", 0.4)
      .attr("x", sysPadding.container)
      .attr("y", accumY)
      .attr("rx", gridH / 2)
      .attr("ry", gridH / 2);
    lovTrack
      .append("rect")
      .attr("fill", "#ddd")
      .attr("width", labelW + 8)
      .attr("height", labelH + 4)
      .attr("opacity", 0.4)
      .attr("x", sysPadding.container + 32)
      .attr("y", accumY - labelH / 2)
      .attr("rx", labelH / 2)
      .attr("ry", labelH / 2);
    getTextDOM
      .attr("x", sysPadding.container + 36 + labelW / 2)
      .attr("y", accumY + labelH / 4);

    accumY += secH + sysSpacing.sectionsY;
  });

  const MainW = newSys.node().getBBox().width;
  const MainH = newSys.node().getBBox().height;

  const nodePad = sysPadding.nodeVertical * 2;
  const nodeH = sysMinSize.textH + nodePad;

  newSys
    .insert("rect", ":first-child")
    .attr("fill", "white")
    .attr("width", sysMinSize.containerW)
    .attr(
      "height",
      (nodeH + secPadding) * slen + secSpc * (slen - 1) + conPadding
    )
    .attr("rx", (gridH + conPadding) / 2)
    .attr("ry", (gridH + conPadding) / 2);
}
