import { readFile } from 'node:fs/promises';

// const input = await readFile(new URL('./sample.txt', import.meta.url), 'utf-8');
const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input
  .trim()
  .split('\n')
  .map((line) => line.split('').map(Number));

function answerPartOne() {
  const answer = shortestPath(puzzleInput);

  return answer; // 824
}

function answerPartTwo() {
  const map = Array.from({ length: puzzleInput.length * 5 }).map((_, row) => {
    return Array.from({ length: puzzleInput[0].length * 5 }).map((_, col) => {
      const value = puzzleInput[row % puzzleInput.length][col % puzzleInput[0].length];
      const tileRow = Math.trunc(row / puzzleInput.length);
      const tileCol = Math.trunc(col / puzzleInput[0].length);
      const increasedValue = value - 1 + tileRow + tileCol;
      const wrappedValue = 1 + (increasedValue % 9);

      return wrappedValue;
    });
  });

  const answer = shortestPath(map);

  return answer; // 3063
}

function shortestPath(map) {
  const neighbours = [
    [-1, 0], // top
    [0, -1], // left
    [0, 1], // right
    [1, 0], // bottom
  ].map((p) => ({ dRow: p[0], dCol: p[1] }));
  const queue = [{ pos: [0, 0], cost: 0 }];
  const visited = new Set();

  while (queue.length) {
    const {
      pos: [row, col],
      cost,
    } = queue.shift();

    if (row === map.length - 1 && col === map[0].length - 1) {
      return cost;
    }

    neighbours
      .map(({ dRow, dCol }) => [row + dRow, col + dCol])
      .filter(([row, col]) => map[col]?.[row])
      .filter((pos) => !visited.has(pos.toString()))
      .forEach((pos) => {
        visited.add(pos.toString());
        queue.push({ pos, cost: cost + map[pos[1]][pos[0]] });
      });
    queue.sort((a, b) => a.cost - b.cost);
  }
}

console.log('What is the lowest total risk of any path from the top left to the bottom right?', answerPartOne());
console.log(
  'Using the full map, what is the lowest total risk of any path from the top left to the bottom right?',
  answerPartTwo(),
);
