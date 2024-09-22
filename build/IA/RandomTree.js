var canvas = d3.select(".tree").append("svg")
  .attr("width", 1200)
  .attr("height", 600);

// Sample data
const data = {
  "name": "Root Node",
  "children": [
    {
      "name": "Child 1",
      "children": [
        { "name": "Grandchild 1.1" },
        { "name": "Grandchild 1.2" }
      ]
    },
    { 
      "name": "Child 2" ,
      "children": [
        { "name": "Grandchild 2.1" },
        { "name": "Grandchild 2.2" }
      ]
    },
    {
      "name": "Child 3",
      "children": [
        { "name": "Grandchild 3.1" },
        { "name": "Grandchild 3.2" },
        { "name": "Grandchild 1.2" },
        { "name": "Grandchild 1.2" },
        { "name": "Grandchild 1.1" },
        { "name": "Grandchild 1.1" }
      ]
    }
  ]
};

// data to a tree hierarchy using d3
const root = d3.hierarchy(data);

// calculate node size and link positions
const nodeSize = [12, 12];
const marginT = { top: 20, right: 120, bottom: 20, left: 120 };
const widthT = 500 - marginT.left - marginT.right;
const heightT = 500 - marginT.top - marginT.bottom;

// Adjust x-coordinate for node centering
const link = d3.linkHorizontal()
  .x(d => d.y + nodeSize[0] / 4) 
  .y(d => d.x);

// Create a group element for the tree structure
const treeG = canvas.append("g")
  .attr("transform", `translate(50, 50)`);

const elementsByName = {};
root.descendants().forEach(d => {
  if (!elementsByName[d.data.name]) {
    elementsByName[d.data.name] = [];
  }
  elementsByName[d.data.name].push(d);
});

// Define arc generator
const arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(nodeSize[0] / 1.5);

// Render the tree using d3.tree
d3.tree()
  .nodeSize(nodeSize)
  .size([widthT, heightT])
  (root);

// Draw links
treeG.selectAll(".link")
  .data(root.links())
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", link)
  .attr("fill", "none")
  .attr("stroke", "#ddd");

// Draw arcs for same-named elements
treeG.append("g")
  .selectAll(".same-name-link")
  .data(root.descendants().filter(d => elementsByName[d.data.name].length > 1)) 
  .enter()
  .append("line")
  .attr("class", "same-name-link")
  .attr("stroke", "rgba(0,0,0,0.1)")
  .attr("stroke-width", 2)
  .attr("d", d => {
    const sourceX = elementsByName[d.data.name][0].y;
    const sourceY = elementsByName[d.data.name][0].x;
    const targetX = d.y;
    const targetY = d.x;

    // Simplified link function logic (optional)
    return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  });

// define nodes 
const nodeG = treeG.selectAll(".node")
  .data(root.descendants())
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", d => `translate(${d.y}, ${d.x})`)
  .style("z-index", 10);;

// Draw labels
nodeG.append("text") 
  .attr("dx", "8px")
  .attr("dy", "-4px")
  .attr("text-anchor", "left")
  .text(d => d.data.name)
  .attr("fill", "black") 
  .attr("font-size", "10px") 
  .attr("font-weight", "medium");

// represent as circles
nodeG.append("circle")
  .attr("r", nodeSize[1] / 4) // Radius based on node size
  .attr("fill", "lightgreen")
  .attr("stroke", "black");

// ... (rest of your code)

// Create a new group for additional links
const sameNameLabelG = treeG.append("g");