import { readFile } from 'node:fs/promises';

// const input = await readFile(new URL('./sample.txt', import.meta.url), 'utf-8');
const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim().split('\n\n');
const dots = puzzleInput[0].split('\n').map((line) => line.split(',').map(Number));
const foldInstructions = puzzleInput[1].split('\n').map((line) => line.replace(/fold along /, ''));

function answerPartOne() {
  let width = Math.max(...dots.map((dot) => dot[0])) + 1;
  let height = Math.max(...dots.map((dot) => dot[1])) + 1;
  const [firstFoldDirection, firstFoldCoordinate] = foldInstructions[0].split('=');
  const { foldedDots } = fold(dots, width, height, firstFoldDirection, firstFoldCoordinate);

  const answer = foldedDots.size;

  return answer; // 682
}

function answerPartTwo() {
  let width = Math.max(...dots.map((dot) => dot[0])) + 1;
  let height = Math.max(...dots.map((dot) => dot[1])) + 1;
  let foldedDots = new Set();
  let currentDots = [...dots];

  for (const foldInstruction of foldInstructions) {
    const [foldDirection, foldCoordinate] = foldInstruction.split('=');
    ({ foldedDots, width, height } = fold(currentDots, width, height, foldDirection, foldCoordinate));
    currentDots = Array.from(foldedDots).map((dot) => dot.split(',').map(Number));
  }

  for (let row = 0; row < height; row++) {
    const rowDots = [];
    for (let col = 0; col < width; col++) {
      rowDots.push(foldedDots.has(`${col},${row}`) ? '#' : ' ');
    }
    console.log(rowDots.join(''));
  }

  // FAGURZHE

  // ####  ##   ##  #  # ###  #### #  # ####
  // #    #  # #  # #  # #  #    # #  # #
  // ###  #  # #    #  # #  #   #  #### ###
  // #    #### # ## #  # ###   #   #  # #
  // #    #  # #  # #  # # #  #    #  # #
  // #    #  #  ###  ##  #  # #### #  # ####
}

function fold(dots, width, height, foldDirection, foldCoordinate) {
  const foldedDots = new Set();

  if (foldDirection === 'x') {
    for (const dot of dots) {
      if (dot[0] < Number(foldCoordinate)) {
        foldedDots.add(`${dot[0]},${dot[1]}`);
      } else {
        foldedDots.add(`${width - dot[0] - 1},${dot[1]}`);
      }
    }
    width = (width - 1) / 2;
  }

  if (foldDirection === 'y') {
    for (const dot of dots) {
      if (dot[1] < Number(foldCoordinate)) {
        foldedDots.add(`${dot[0]},${dot[1]}`);
      } else {
        foldedDots.add(`${dot[0]},${height - dot[1] - 1}`);
      }
    }
    height = (height - 1) / 2;
  }

  return { foldedDots, width, height };
}

console.log(
  'How many dots are visible after completing just the first fold instruction on your transparent paper?',
  answerPartOne(),
);
console.log('What code do you use to activate the infrared thermal imaging camera system?', answerPartTwo());
