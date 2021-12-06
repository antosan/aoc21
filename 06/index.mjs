import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim().split(',').map(Number);

function answerPartOne() {
  let state = [...puzzleInput];
  let day = 0;

  while (day < 80) {
    day++;
    state = state.reduce((acc, cur, index) => {
      if (cur === 0) {
        acc[index] = 6;
        acc.push(8);
      } else {
        acc[index]--;
      }

      return acc;
    }, state);
  }

  const answer = state.length;

  return answer; // 362740
}

function answerPartTwo() {
  let counts = Array.from({ length: 9 }, () => 0);

  puzzleInput.forEach((value) => {
    counts[value]++;
  });

  for (let i = 0; i < 256; i++) {
    const [zeros, ...ticked] = counts;
    ticked[6] += zeros;
    ticked[8] = zeros;
    counts = ticked;
  }

  const answer = counts.reduce((acc, cur) => acc + cur, 0);

  return answer; // 1644874076764
}

console.log('How many lanternfish would there be after 80 days?', answerPartOne());
console.log('How many lanternfish would there be after 256 days?', answerPartTwo());
