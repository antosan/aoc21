import { readFile } from 'node:fs/promises';

// const input = await readFile(new URL('./sample.txt', import.meta.url), 'utf-8');
const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim().split('\n');

function answerPartOne() {
  const SYNTAX_ERROR_POINTS = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };
  const answer = getCorruptedLines(puzzleInput)
    .map((l) => l.char)
    .reduce((acc, cur) => acc + SYNTAX_ERROR_POINTS[cur], 0);

  return answer; // 469755
}

function answerPartTwo() {
  const SYNTAX_AUTOCOMPLETE_POINTS = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };
  const corruptedLines = getCorruptedLines(puzzleInput);
  const incompleteLines = puzzleInput.filter((pLine) => !corruptedLines.map((cLine) => cLine.line).includes(pLine));
  const closingCharacters = getUnclosedCharacters(incompleteLines).map((line) =>
    line.reverse().map(getClosingCharacter),
  );
  const completionScores = closingCharacters.map((line) =>
    line.reduce((acc, cur) => acc * 5 + SYNTAX_AUTOCOMPLETE_POINTS[cur], 0),
  );
  const middleIndex = Math.floor(completionScores.length / 2);

  const answer = completionScores.sort((a, b) => b - a)[middleIndex];

  return answer; // 2762335572
}

function getCorruptedLines(lines) {
  const corruptedLines = [];

  for (const line of lines) {
    const stack = [];
    let corruptedLine = null;

    for (const char of line) {
      if (char === '(' || char === '[' || char === '{' || char === '<') {
        stack.push(char);
      } else if (char === ')' || char === ']' || char === '}' || char === '>') {
        if (stack.length !== 0) {
          const last = stack.pop();
          if (last === '(' && char !== ')') {
            corruptedLine = { line: line, char: char };
          } else if (last === '[' && char !== ']') {
            corruptedLine = { line: line, char: char };
          } else if (last === '{' && char !== '}') {
            corruptedLine = { line: line, char: char };
          } else if (last === '<' && char !== '>') {
            corruptedLine = { line: line, char: char };
          }
        }
      }

      if (corruptedLine) {
        corruptedLines.push(corruptedLine);
        corruptedLine = null;
        break;
      }
    }
  }

  return corruptedLines;
}

function getUnclosedCharacters(lines) {
  const unclosedCharacters = [];

  for (const line of lines) {
    const stack = [];

    for (const char of line) {
      if (char === '(' || char === '[' || char === '{' || char === '<') {
        stack.push(char);
      } else if (char === ')' || char === ']' || char === '}' || char === '>') {
        if (stack.length !== 0) {
          stack.pop();
        }
      }
    }

    unclosedCharacters.push(stack);
  }

  return unclosedCharacters;
}

function getClosingCharacter(char) {
  switch (char) {
    case '(':
      return ')';
    case '[':
      return ']';
    case '{':
      return '}';
    case '<':
      return '>';
    default:
      return null;
  }
}

console.log('What is the total syntax error score for those errors?', answerPartOne());
console.log('What is the middle score?', answerPartTwo());
