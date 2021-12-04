import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim().split('\n\n');

const numbers = puzzleInput[0].split(',').map(Number);
const puzzleBoards = puzzleInput.slice(1).map((board) =>
  board.split('\n').map((row) =>
    row
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((value) => [Number(value), false]),
  ),
);

function answerPartOne() {
  const boards = [...puzzleBoards];
  let winningBoard = null;
  let winningNumber = null;

  for (let index = 0; index < numbers.length; index++) {
    const numberDrawn = numbers[index];

    for (let k = 0; k < boards.length; k++) {
      const board = boards[k];
      const markedBoard = markBoard(board, numberDrawn);

      if (boardWins(markedBoard)) {
        winningBoard = k;
        winningNumber = numberDrawn;
        break;
      }

      boards[k] = markedBoard;
    }

    if (winningBoard !== null) {
      break;
    }
  }

  const sum = unmarkedNumbersSum(boards[winningBoard]);
  const answer = sum * winningNumber;

  return answer; // 71708
}

function answerPartTwo() {
  let boards = [...puzzleBoards];
  let winningBoards = new Set();
  let winningNumber = null;
  let lastBoardToWin = null;

  for (let index = 0; index < numbers.length; index++) {
    const numberDrawn = numbers[index];

    for (let k = 0; k < boards.length; k++) {
      const board = boards[k];
      const markedBoard = markBoard(board, numberDrawn);

      if (boardWins(markedBoard)) {
        winningBoards.add(k);
        if (winningBoards.size === boards.length) {
          lastBoardToWin = k;
          winningNumber = numberDrawn;
          break;
        }
      }

      boards[k] = markedBoard;
    }

    if (lastBoardToWin !== null) {
      break;
    }
  }

  const sum = unmarkedNumbersSum(boards[lastBoardToWin]);
  const answer = sum * winningNumber;

  return answer; // 34726
}

function markBoard(board, numberDrawn) {
  const markedBoard = [...board];

  for (let row = 0; row < markedBoard.length; row++) {
    for (let col = 0; col < markedBoard[row].length; col++) {
      if (markedBoard[row][col][0] === numberDrawn) {
        markedBoard[row][col][1] = true;
      }
    }
  }

  return markedBoard;
}

function boardWins(board) {
  const rowWin = board.some((row) => row.every(([, marked]) => marked));
  const colWin = board[0].some((_, colIndex) => board.every((row) => row[colIndex][1]));

  return rowWin || colWin;
}

function unmarkedNumbersSum(board) {
  return board.reduce((sum, row) => {
    return (
      sum +
      row.reduce((rowSum, [value, marked]) => {
        return rowSum + (marked ? 0 : value);
      }, 0)
    );
  }, 0);
}

console.log('What will your final score be if you choose that board?', answerPartOne());
console.log('Once it wins, what would its final score be?', answerPartTwo());
