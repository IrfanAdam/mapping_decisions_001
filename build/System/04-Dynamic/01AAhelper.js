// Global array to track path segments
const pathSegments = [];

// Helper function to calculate the distance between two points
function distanceBetweenPoints(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// Helper function to check if two line segments are "close" to each other
function areSegmentsClose(p1, p2, q1, q2, threshold) {
  // Check distance between the start and end points of the two segments
  const dist1 = distanceBetweenPoints(p1, q1);
  const dist2 = distanceBetweenPoints(p2, q2);
  const dist3 = distanceBetweenPoints(p1, q2);
  const dist4 = distanceBetweenPoints(p2, q1);

  return Math.min(dist1, dist2, dist3, dist4) < threshold;
}

// Function to check if a new segment overlaps with any logged segments
function checkSegmentOverlap(newSegmentStart, newSegmentEnd) {
  for (const segment of pathSegments) {
    const { start, end } = segment;
    if (
      areSegmentsClose(
        newSegmentStart,
        newSegmentEnd,
        start,
        end,
        overlapThreshold
      )
    ) {
      return true; // Overlap detected
    }
  }
  return false;
}

// Function to log path segments and detect overlaps
function logSegment(newSegmentStart, newSegmentEnd) {
  if (checkSegmentOverlap(newSegmentStart, newSegmentEnd)) {
    // console.log("Overlap detected:", newSegmentStart, newSegmentEnd);
    return true; // Overlap found
  }

  // No overlap, log the segment
  pathSegments.push({ start: newSegmentStart, end: newSegmentEnd });
  return false;
}

function filterPath(path) {
  const filteredPath = [path[0]];
  for (let i = 0; i < path.length - 2; i++) {
    const prev = path[i];
    const curr = path[i + 1];
    const next = path[i + 2];
    if (
      !(
        (prev.x === curr.x && curr.x === next.x) ||
        (prev.y === curr.y && curr.y === next.y)
      )
    ) {
      filteredPath.push(curr);
    }
  }
  filteredPath.push(path[path.length - 1]);
  return filteredPath;
}

function smoothenPath(path) {
  if (path.length === 0) return [];

  const smoothPath = [path[0]]; // Start with the initial point

  for (let i = 1; i < path.length; i++) {
    const prev = smoothPath[smoothPath.length - 1];
    const current = path[i];

    // If the direction has changed, add the current point to the simplified path
    if (
      (prev.x !== current.x && prev.y === current.y) || // Horizontal change
      (prev.x === current.x && prev.y !== current.y) // Vertical change
    ) {
      smoothPath.push(current);
    }
  }

  //round the values to remove unnecessary decimals
  const needsFilter = smoothPath.map((point) => ({
    x: Math.round(point.x),
    y: Math.round(point.y),
  }));

  return needsFilter;
}

class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift().element;
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}

function isInsideObstacle(point, obstacles) {
  return obstacles.some(
    (obs) =>
      point.x >= obs.x - avoidObs &&
      point.x < obs.x + obs.width + avoidObs &&
      point.y >= obs.y - avoidObs &&
      point.y < obs.y + obs.height + avoidObs
  );
}

function addFinalRightAnglePoint(path, end) {
  const lastPoint = path[path.length - 2];
  const onX = lastPoint.direction === "left" || lastPoint.direction === "right";
  const onY = lastPoint.direction === "up" || lastPoint.direction === "down";
  const xline = lastPoint.x === end.x;
  const yline = lastPoint.y === end.y;

  if (xline || yline) {
    // Last point already aligns with end point
    return path;
  }

  // Insert an intermediate point to align with x or y
  const newPoint = {
    x: lastPoint.x,
    y: lastPoint.y,
  };
  if (!xline) {
    newPoint.x = lastPoint.x;
    newPoint.y = end.y;
  }
  if (!yline) {
    newPoint.x = end.x;
    newPoint.y = lastPoint.y;
  }

  const index = path.length - 1;
  const pathWithoutEnd = path.slice(0, index);

  return [...pathWithoutEnd, newPoint, end];
}
