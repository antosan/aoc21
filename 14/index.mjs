import { readFile } from 'node:fs/promises';

// const input = await readFile(new URL('./sample.txt', import.meta.url), 'utf-8');
const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim().split('\n\n');
const polymerTemplate = puzzleInput[0];
const pairInsertionRules = puzzleInput[1]
  .split('\n')
  .map((line) => line.split(' -> '))
  .reduce((acc, cur) => {
    acc[cur[0]] = cur[1];
    return acc;
  }, {});

function answerPartOne() {
  let nextTemplate = polymerTemplate;

  for (let i = 0; i < 10; i++) {
    nextTemplate = insertPolymer(nextTemplate, pairInsertionRules);
  }

  const occurances = nextTemplate.split('').reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {});

  const answer = Math.max(...Object.values(occurances)) - Math.min(...Object.values(occurances));

  return answer; // 4517
}

function answerPartTwo() {
  let counts = {};

  for (let i = 0; i < polymerTemplate.length - 1; i++) {
    const key = `${polymerTemplate[i]}${polymerTemplate[i + 1]}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  for (let i = 0; i < 40; i++) {
    let stepCounts = {};
    for (const key of Object.keys(counts)) {
      // CH -> B becomes (CB, BH)
      stepCounts[`${key[0]}${pairInsertionRules[key]}`] =
        (stepCounts[`${key[0]}${pairInsertionRules[key]}`] || 0) + counts[key];

      stepCounts[`${pairInsertionRules[key]}${key[1]}`] =
        (stepCounts[`${pairInsertionRules[key]}${key[1]}`] || 0) + counts[key];
    }
    counts = stepCounts;
  }

  let occurances = {};

  for (const key of Object.keys(counts)) {
    occurances[key[0]] = (occurances[key[0]] || 0) + counts[key];
  }

  occurances[polymerTemplate[polymerTemplate.length - 1]] =
    (occurances[polymerTemplate[polymerTemplate.length - 1]] || 0) + 1;

  const answer = Math.max(...Object.values(occurances)) - Math.min(...Object.values(occurances));

  return answer; // 4704817645083
}

function insertPolymer(polymerTemplate, pairInsertionRules) {
  const pairs = polymerTemplate.split('').reduce((acc, cur, index) => {
    if (index !== 0) {
      acc.push(`${polymerTemplate[index - 1]}${cur}`);
    }
    return acc;
  }, []);

  const nextTemplate = pairs.reduce((acc, cur, index) => {
    const pair = cur.split('');
    const rule = pairInsertionRules[cur];
    return index === 0 ? `${acc}${pair[0]}${rule}${pair[1]}` : `${acc}${rule}${pair[1]}`;
  }, '');

  return nextTemplate;
}

console.log(
  'What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?',
  answerPartOne(),
);
console.log(
  'What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?',
  answerPartTwo(),
);
