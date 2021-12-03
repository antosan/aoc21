import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim().split('\n');

function answerPartOne() {
  const acc = Array.from({ length: puzzleInput[0].length }, () => [0, 0]);

  for (const num of puzzleInput) {
    num.split('').forEach((bit, index) => {
      acc[index][bit]++;
    });
  }

  const rate = acc.reduce(
    (acc, cur) => {
      const [zeros, ones] = Object.values(cur);
      return {
        gamma: `${acc.gamma}${zeros > ones ? '0' : '1'}`,
        epsilon: `${acc.epsilon}${zeros > ones ? '1' : '0'}`,
      };
    },
    { gamma: '', epsilon: '' },
  );

  const answer = parseInt(rate.gamma, 2) * parseInt(rate.epsilon, 2);

  return answer; // 3009600
}

function answerPartTwo() {
  const rating = { oxygen: puzzleInput, co2: puzzleInput };

  for (let index = 0; index < puzzleInput[0].length; index++) {
    const [oxygenZeros, oxygenOnes] = rating.oxygen.reduce(
      (acc, cur) => {
        return [acc[0] + (cur[index] === '0' ? 1 : 0), acc[1] + (cur[index] === '1' ? 1 : 0)];
      },
      [0, 0],
    );
    const [co2Zeros, co2Ones] = rating.co2.reduce(
      (acc, cur) => {
        return [acc[0] + (cur[index] === '0' ? 1 : 0), acc[1] + (cur[index] === '1' ? 1 : 0)];
      },
      [0, 0],
    );
    const mostCommonValue = oxygenZeros === oxygenOnes ? '1' : oxygenZeros > oxygenOnes ? '0' : '1';
    const leastCommonValue = co2Zeros === co2Ones ? '0' : co2Zeros > co2Ones ? '1' : '0';

    if (rating.oxygen.length > 1) {
      rating.oxygen = rating.oxygen.filter((bit) => bit[index] === mostCommonValue);
    }

    if (rating.co2.length > 1) {
      rating.co2 = rating.co2.filter((bit) => bit[index] === leastCommonValue);
    }
  }

  const answer = parseInt(rating.oxygen, 2) * parseInt(rating.co2, 2);

  return answer; // 6940518
}

console.log('What is the power consumption of the submarine?', answerPartOne());
console.log('What is the life support rating of the submarine?', answerPartTwo());
