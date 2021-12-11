import { readFile } from 'node:fs/promises';

// const input = await readFile(new URL('./sample.txt', import.meta.url), 'utf-8');
const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');

const neighbours = [
  [-1, -1], // top left
  [-1, 0], // top
  [-1, 1], // top right
  [0, -1], // left
  [0, 1], // right
  [1, -1], // bottom left
  [1, 0], // bottom
  [1, 1], // bottom right
].map((p) => ({ dRow: p[0], dCol: p[1] }));

function answerPartOne() {
  const { energyLevels, width, height } = getEnergyLevels(input);
  const steps = 100;
  let answer = 0;

  for (let i = 0; i < steps; i++) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        energyLevels[row][col] += 1;
      }
    }

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (energyLevels[row][col] === 10) {
          answer = flash(row, col, width, height, energyLevels, answer);
        }
      }
    }

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (energyLevels[row][col] === -1) {
          energyLevels[row][col] = 0;
        }
      }
    }
  }

  return answer; // 1594
}

function answerPartTwo() {
  const { energyLevels, width, height } = getEnergyLevels(input);
  let done = false;
  let answer = 0;

  while (true) {
    answer += 1;

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        energyLevels[row][col] += 1;
      }
    }

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (energyLevels[row][col] === 10) {
          flash(row, col, width, height, energyLevels);
        }
      }
    }

    done = true;

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (energyLevels[row][col] === -1) {
          energyLevels[row][col] = 0;
        } else {
          done = false;
        }
      }
    }

    if (done) {
      break;
    }
  }

  return answer; // 437
}

function getEnergyLevels(input) {
  const energyLevels = input
    .trim()
    .split('\n')
    .map((row) => row.split('').map(Number));
  const width = energyLevels[0].length;
  const height = energyLevels.length;

  return { energyLevels, width, height };
}

function flash(row, col, width, height, energyLevels, count = 0) {
  count += 1;
  energyLevels[row][col] = -1; // mark as flashed

  neighbours.forEach(({ dRow, dCol }) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width && energyLevels[newRow][newCol] !== -1) {
      energyLevels[newRow][newCol] += 1;

      if (energyLevels[newRow][newCol] >= 10) {
        count = flash(newRow, newCol, width, height, energyLevels, count);
      }
    }
  });

  return count;
}

console.log('How many total flashes are there after 100 steps?', answerPartOne());
console.log('What is the first step during which all octopuses flash?', answerPartTwo());
