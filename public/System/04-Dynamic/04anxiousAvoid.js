function findPath(start, end, obstacles, containerW, containerH) {
  function getNeighbors(point, prevDirection) {
    const directions = [
      { dx: searchStep, dy: 0, dir: "right" },
      { dx: -searchStep, dy: 0, dir: "left" },
      { dx: 0, dy: searchStep, dir: "down" },
      { dx: 0, dy: -searchStep, dir: "up" },
    ];

    // Prioritize the previous direction
    if (prevDirection) {
      directions.sort((a, b) => (a.dir === prevDirection ? -1 : 1));
    }

    return directions
      .map((d) => ({
        x: point.x + d.dx,
        y: point.y + d.dy,
        direction: d.dir,
      }))
      .filter(
        (p) =>
          p.x >= 0 &&
          p.x <= containerW &&
          p.y >= 0 &&
          p.y <= containerH &&
          !isInsideObstacle(p, obstacles)
      );
  }

  function heuristic(a, b) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y); // Manhattan distance
  }

  const openSet = new PriorityQueue();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  openSet.enqueue({ ...start, direction: null }, 0);
  gScore.set(JSON.stringify(start), 0);
  fScore.set(JSON.stringify(start), heuristic(start, end));

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    const isInrange =
      Math.abs(current.x - end.x) < 20 && Math.abs(current.y - end.y) < 20;
    const onX = current.direction === "left" || current.direction === "right";
    const onY = current.direction === "up" || current.direction === "down";
    const xline = current.x === end.x;
    const yline = current.y === end.y;
    if (isInrange) {
      const path = [end];
      let currentKey = JSON.stringify(current);
      while (cameFrom.has(currentKey)) {
        const prev = cameFrom.get(currentKey);
        path.unshift(prev);
        currentKey = JSON.stringify(prev);
      }

      const adjustedPath = addFinalRightAnglePoint(path, end);
      const smoothPath = smoothenPath(adjustedPath);

      // Check and log each segment
      for (let i = 0; i < smoothPath.length - 1; i++) {
        const overlap = logSegment(smoothPath[i], smoothPath[i + 1]);
        if (overlap) {
          // console.log("Path overlaps:", smoothPath[i], smoothPath[i + 1]);
        }
      }

      const filteredPath = filterPath(smoothPath);
      return filteredPath;
    }

    for (const neighbor of getNeighbors(current, current.direction)) {
      const tentativeGScore = gScore.get(JSON.stringify(current)) + searchStep;
      const neighborKey = JSON.stringify(neighbor);

      if (
        !gScore.has(neighborKey) ||
        tentativeGScore < gScore.get(neighborKey)
      ) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        const f = tentativeGScore + heuristic(neighbor, end);
        fScore.set(neighborKey, f);
        openSet.enqueue(neighbor, f);
      }
    }
  }
  return null; // No path found
}
