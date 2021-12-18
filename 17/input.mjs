import { readFile } from 'node:fs/promises';

// const input = await readFile(new URL('./sample.txt', import.meta.url), 'utf-8');
const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim();

const regex = /target area: x=(?<x0>-?\d+)\.\.(?<x1>-?\d+), y=(?<y0>-?\d+)\.\.(?<y1>-?\d+)/;
const { groups } = puzzleInput.match(regex);

const targetArea = Object.keys(groups).reduce((acc, cur) => {
  acc[cur] = Number(groups[cur]);
  return acc;
}, {});

function answerPartOne() {
  const { highestY } = bruteForce(targetArea);

  const answer = highestY;

  return answer; // 9730
}

function answerPartTwo() {
  const { velocities } = bruteForce(targetArea);

  const answer = velocities;

  return answer; // 4110
}

function bruteForce(targetArea) {
  let highestY = 0;
  let velocities = 0;

  for (let DX = 0; DX <= 200; DX++) {
    for (let DY = -150; DY <= 1000; DY++) {
      let done = false;
      let x = 0;
      let y = 0;
      let maxYPos = 0;
      let dx = DX;
      let dy = DY;

      // ON EACH STEP, PROBE's:
      // x pos increases by its x velocity
      // y pos increases by its y velocity
      // (drag) x velocity decreases by 1 if >0; increases by 1 if <0; does not change if 0
      // (gravity) y velocity decreases by 1

      for (let i = 0; i < 1000; i++) {
        x += dx;
        y += dy;

        if (y > maxYPos) {
          maxYPos = y;
        }

        if (dx > 0) {
          dx--;
        } else if (dx < 0) {
          dx++;
        }

        dy--;

        if (x >= targetArea.x0 && x <= targetArea.x1 && y >= targetArea.y0 && y <= targetArea.y1) {
          done = true;
        }
      }

      if (done) {
        velocities++;
        if (maxYPos > highestY) {
          highestY = maxYPos;
          console.log(`${DX},${DY} - ${highestY}`);
        }
      }
    }
  }

  return { highestY, velocities };
}

console.log('What is the highest y position it reaches on this trajectory?', answerPartOne());
console.log(
  'How many distinct initial velocity values cause the probe to be within the target area after any step?',
  answerPartTwo(),
);
