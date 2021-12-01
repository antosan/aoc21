import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim().split('\n');

function answerPartOne() {
  const answer = puzzleInput.reduce((acc, cur, index, arr) => {
    if (index !== 0 && Number(cur) > Number(arr[index - 1])) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return answer;
}

function answerPartTwo() {
  const answer = puzzleInput.reduce((acc, cur, index, arr) => {
    const hasThreeMeasurements = Boolean(arr[index + 1] && arr[index + 2]);

    if (!hasThreeMeasurements) {
      return acc;
    }

    const curSum = Number(cur) + Number(arr[index + 1]) + Number(arr[index + 2]);
    const prevSum = Number(arr[index - 1]) + Number(cur) + Number(arr[index + 1]);

    if (index !== 0 && curSum > prevSum) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return answer;
}

console.log('How many measurements are larger than the previous measurement?', answerPartOne());
console.log('How many sums are larger than the previous sum?', answerPartTwo());
