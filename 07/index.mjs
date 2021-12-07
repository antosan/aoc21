import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim().split(',').map(Number);

function answerPartOne() {
  const horizontalPositions = puzzleInput.reduce((acc, cur) => {
    if (acc[cur]) {
      acc[cur]++;
    } else {
      acc[cur] = 1;
    }
    return acc;
  }, {});

  const totalFuel = Object.entries(horizontalPositions).reduce((acc, cur, index, arr) => {
    const [pos] = cur;
    const fuel = arr
      .filter((_, posIndex) => posIndex !== index)
      .reduce((acc, cur) => {
        return acc + Math.abs(Number(cur[0]) - pos) * cur[1];
      }, 0);
    acc[pos] = fuel;
    return acc;
  }, {});

  const leastFuel = Object.entries(totalFuel).reduce(
    (acc, cur) => {
      const [pos, fuel] = cur;
      if (fuel < acc[1]) {
        acc = [pos, fuel];
      }
      return acc;
    },
    [0, Infinity],
  );

  const answer = leastFuel[1];

  return answer; // 355521
}

function answerPartTwo() {
  const horizontalPositions = puzzleInput.reduce((acc, cur) => {
    if (acc[cur]) {
      acc[cur]++;
    } else {
      acc[cur] = 1;
    }
    return acc;
  }, {});

  const [minPos, maxPos] = [
    Math.min(...Object.keys(horizontalPositions)),
    Math.max(...Object.keys(horizontalPositions)),
  ];
  let totalFuel = {};

  for (let i = minPos; i <= maxPos; i++) {
    const fuel = puzzleInput
      .filter((pos) => pos !== i)
      .reduce((acc, cur) => {
        return acc + increment(Math.abs(Number(cur) - i));
      }, 0);
    totalFuel[i] = fuel;
  }

  const leastFuel = Object.entries(totalFuel).reduce(
    (acc, cur) => {
      const [pos, fuel] = cur;
      if (fuel < acc[1]) {
        acc = [pos, fuel];
      }
      return acc;
    },
    [0, Infinity],
  );

  const answer = leastFuel[1];

  return answer; // 100148777
}

function increment(n) {
  if (n === 1) return 1;
  return n + increment(n - 1);
}

console.log('How much fuel must they spend to align to that position?', answerPartOne());
console.log('How much fuel must they spend to align to that position?', answerPartTwo());
