import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input
  .trim()
  .split('\n')
  .map((row) => row.split('').map(Number));

function answerPartOne() {
  const lowPoints = [];

  for (let row = 0; row < puzzleInput.length; row++) {
    for (let col = 0; col < puzzleInput[row].length; col++) {
      const currentValue = puzzleInput[row][col];
      if (!isHigherThanAdjascent(row, col, currentValue)) {
        lowPoints.push(currentValue);
      }
    }
  }

  const answer = lowPoints.reduce((acc, cur) => acc + cur + 1, 0);

  return answer; // 448
}

function answerPartTwo() {
  const lowPoints = [];

  for (let row = 0; row < puzzleInput.length; row++) {
    for (let col = 0; col < puzzleInput[row].length; col++) {
      const currentValue = puzzleInput[row][col];
      if (!isHigherThanAdjascent(row, col, currentValue)) {
        lowPoints.push({ row, col, value: currentValue });
      }
    }
  }

  const basins = [];

  for (const lowPoint of lowPoints) {
    const basinSize = getBasin(lowPoint);
    basins.push(basinSize);
  }

  const answer = basins
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, cur) => acc * cur, 1);

  return answer; // 1417248
}

function isHigherThanAdjascent(row, col, currentValue) {
  const adjascentPositions = getAdjascentPositions(row, col);
  const isHigher = adjascentPositions.some((position) => currentValue >= puzzleInput[position.row][position.col]);

  return isHigher;
}

function getAdjascentPositions(row, col) {
  const top = getSafePosition(row - 1, col);
  const bottom = getSafePosition(row + 1, col);
  const left = getSafePosition(row, col - 1);
  const right = getSafePosition(row, col + 1);

  return [top, bottom, left, right].filter((value) => value !== undefined);
}

function getSafePosition(row, col, direction) {
  if (!puzzleInput[row]) return undefined;
  if (puzzleInput[row][col] || puzzleInput[row][col] === 0) {
    return { row, col, value: puzzleInput[row][col], direction };
  }
  return undefined;
}

function getBasin(startLowPoint) {
  const width = puzzleInput[0].length;
  const height = puzzleInput.length;
  const visitedLocations = new Set();

  const queue = [startLowPoint];

  while (queue.length > 0) {
    const first = queue.shift();

    if (visitedLocations.has(`${first.row},${first.col}`)) {
      continue;
    }

    visitedLocations.add(`${first.row},${first.col}`);

    const neighbours = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ].map((p) => ({ x: p[0], y: p[1] }));

    neighbours.forEach((neighbour) => {
      const nextX = first.col + neighbour.x;
      const nextY = first.row + neighbour.y;
      if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height && puzzleInput[nextY][nextX] < 9) {
        queue.push({ col: nextX, row: nextY });
      }
    });
  }

  return visitedLocations.size;
}

console.log('What is the sum of the risk levels of all low points on your heightmap?', answerPartOne());
console.log('What do you get if you multiply together the sizes of the three largest basins?', answerPartTwo());
