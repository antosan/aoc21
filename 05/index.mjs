import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input
  .trim()
  .split('\n')
  .map((line) => line.split(' -> '))
  .map((segment) => [segment[0].split(',').map(Number), segment[1].split(',').map(Number)]);

function answerPartOne() {
  const filteredNearbyLines = puzzleInput.filter((line) => isHorizontalLine(line) || isVerticalLine(line));
  const coverage = getVentDiagram(filteredNearbyLines);
  const answer = Object.values(coverage).filter((value) => value >= 2).length;

  return answer; // 5698
}

function answerPartTwo() {
  const coverage = getVentDiagram(puzzleInput);
  const answer = Object.values(coverage).filter((value) => value >= 2).length;

  return answer; // 15463
}

function isHorizontalLine(line) {
  const [[, y1], [, y2]] = line;
  return y1 === y2;
}

function isVerticalLine(line) {
  const [[x1], [x2]] = line;
  return x1 === x2;
}

function getVentDiagram(nearbyLines) {
  const diagram = {};

  nearbyLines.forEach((line) => {
    const points = pointsCovered(line);

    points.forEach((point) => {
      diagram[point] = diagram[point] ?? 0;
      diagram[point]++;
    });
  });

  return diagram;
}

function pointsCovered(line) {
  const [[x1, y1], [x2, y2]] = line;
  const [startX, endX] = [x1, x2].sort((a, b) => a - b);
  const [startY, endY] = [y1, y2].sort((a, b) => a - b);
  const points = [];

  if (x1 === x2 || y1 === y2) {
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        points.push([x, y]);
      }
    }
  } else {
    const slope = (y2 - y1) / (x2 - x1);
    const b = y1 - slope * x1; // y intercept -> y = mx + b

    for (let x = startX; x <= endX; x++) {
      const y = slope * x + b;
      points.push([x, y]);
    }
  }

  return points;
}

console.log('At how many points do at least two lines overlap?', answerPartOne());
console.log('At how many points do at least two lines overlap?', answerPartTwo());
