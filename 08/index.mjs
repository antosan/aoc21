import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input
  .trim()
  .split('\n')
  .map((line) => line.split(' | '));

function answerPartOne() {
  let answer = 0;

  for (let i = 0; i < puzzleInput.length; i++) {
    const [, outputValuesString] = puzzleInput[i];
    const outputValues = outputValuesString.split(' ');

    const count = outputValues.reduce((acc, cur) => {
      if ([2, 3, 4, 7].includes(cur.length)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    answer += count;
  }

  return answer; // 352
}

function answerPartTwo() {
  let answer = 0;

  for (let i = 0; i < puzzleInput.length; i++) {
    const segments = [];
    const [inputValuesString, outputValuesString] = puzzleInput[i];
    const inputValues = inputValuesString.split(' ').sort((a, b) => a.length - b.length);
    const outputValues = outputValuesString.split(' ').map((value) => value.split('').sort().join(''));

    // [index/length] [0/2],[1/3],[2/4],[3/5],[4/5],[5/5],[6/6],[7/6],[8/6],[9/7]

    segments[1] = inputValues[0]; // number 1 has length 2
    segments[4] = inputValues[2]; // number 4 has length 4
    segments[7] = inputValues[1]; // number 7 has length 3
    segments[8] = inputValues[9]; // number 8 has length 7
    // 3 has 1
    segments[3] = inputValues.slice(3, 6).find((value) => hasSubstring(value, segments[1]));
    // 6 does not have 1
    segments[6] = inputValues.slice(6, 9).find((value) => !hasSubstring(value, segments[1]));
    // 9 has 3
    segments[9] = inputValues.slice(6, 9).find((value) => hasSubstring(value, segments[3]));
    // 6 has 5
    segments[5] = inputValues.slice(3, 6).find((value) => hasSubstring(segments[6], value));
    // 8 has 0
    segments[0] = inputValues
      .slice(6, 9)
      .find((value) => hasSubstring(segments[8], value) && !segments.includes(value));
    // Remaining value is for 2
    segments[2] = inputValues.slice(3, 6).find((value) => !segments.includes(value));

    const sortedSegments = segments.map((value) => value.split('').sort().join(''));

    const decodedDigits = outputValues.reduce((acc, cur) => {
      return acc + sortedSegments.indexOf(cur);
    }, '');

    answer += Number(decodedDigits);
  }

  return answer; // 936117
}

function hasSubstring(str, sub) {
  return sub.split('').every((char) => str.includes(char));
}

console.log('In the output values, how many times do digits 1, 4, 7, or 8 appear?', answerPartOne());
console.log('What do you get if you add up all of the output values?', answerPartTwo());
