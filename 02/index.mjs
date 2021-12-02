import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input
  .trim()
  .split('\n')
  .map((line) => {
    const [direction, distance] = line.split(' ');
    return { direction, distance: Number(distance) };
  });

function answerPartOne() {
  const position = { horizontal: 0, depth: 0 };

  for (let i = 0; i < puzzleInput.length; i++) {
    const element = puzzleInput[i];

    if (element.direction === 'forward') {
      position.horizontal += element.distance;
    }
    if (element.direction === 'down') {
      position.depth += element.distance;
    }
    if (element.direction === 'up') {
      position.depth -= element.distance;
    }
  }

  const answer = position.horizontal * position.depth;

  return answer;
}

function answerPartTwo() {
  const position = { horizontal: 0, depth: 0, aim: 0 };

  for (let i = 0; i < puzzleInput.length; i++) {
    const element = puzzleInput[i];

    if (element.direction === 'forward') {
      position.horizontal += element.distance;
      if (position.aim > 0) {
        position.depth += position.aim * element.distance;
      }
    }
    if (element.direction === 'down') {
      position.aim += element.distance;
    }
    if (element.direction === 'up') {
      position.aim -= element.distance;
    }
  }

  const answer = position.horizontal * position.depth;

  return answer;
}

console.log('What do you get if you multiply your final horizontal position by your final depth?', answerPartOne());
console.log('What do you get if you multiply your final horizontal position by your final depth?', answerPartTwo());
