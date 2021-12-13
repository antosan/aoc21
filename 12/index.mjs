import { readFile } from 'node:fs/promises';

// const input = await readFile(new URL('./sample.txt', import.meta.url), 'utf-8');
const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input
  .trim()
  .split('\n')
  .map((line) => line.split('-'));

function answerPartOne() {
  const sortOrder = ['start'];
  const startingConnections = puzzleInput
    .filter((connection) => connection.includes('start'))
    .map((connection) => connection.sort((a, b) => sortOrder.indexOf(b) - sortOrder.indexOf(a)));
  const intermediateConnections = puzzleInput.filter((connection) => !connection.includes('start'));
  const paths = new Set();
  let done = false;

  for (const connection of startingConnections) {
    paths.add(connection.join(','));
  }

  while (true) {
    done = true;

    for (const path of Array.from(paths)) {
      const previousCave = path.split(',').pop();

      if (previousCave === 'end') {
        continue;
      }

      const validConnections = intermediateConnections.filter((connection) => connection.includes(previousCave));

      for (const validConnection of validConnections) {
        const nextCave = validConnection.filter((conn) => conn !== previousCave)[0];

        paths.delete(path);

        if (isSmallCave(nextCave) && path.includes(nextCave)) {
          continue;
        }

        paths.add(`${path},${nextCave}`);
        done = false;
      }
    }

    if (done) {
      break;
    }
  }

  const answer = paths.size;

  return answer; // 4707
}

function answerPartTwo() {
  const sortOrder = ['start'];
  const startingConnections = puzzleInput
    .filter((connection) => connection.includes('start'))
    .map((connection) => connection.sort((a, b) => sortOrder.indexOf(b) - sortOrder.indexOf(a)));
  const intermediateConnections = puzzleInput.filter((connection) => !connection.includes('start'));
  const paths = new Set();
  let done = false;

  for (const connection of startingConnections) {
    paths.add(connection.join(','));
  }

  while (true) {
    done = true;

    for (const path of Array.from(paths)) {
      const previousCave = path.split(',').pop();

      if (previousCave === 'end') {
        continue;
      }

      const validConnections = intermediateConnections.filter((connection) => connection.includes(previousCave));

      for (const validConnection of validConnections) {
        const nextCave = validConnection.filter((conn) => conn !== previousCave)[0];

        paths.delete(path);

        const smallCavesInPath = path
          .split(',')
          .filter((cave) => isSmallCave(cave) && !['start', 'end'].includes(cave))
          .sort();
        const singleSmallCaveVisitedTwice = new Set(smallCavesInPath).size !== smallCavesInPath.length;

        if (isSmallCave(nextCave) && singleSmallCaveVisitedTwice && path.includes(nextCave)) {
          continue;
        }

        paths.add(`${path},${nextCave}`);
        done = false;
      }
    }

    if (done) {
      break;
    }
  }

  const answer = paths.size;

  return answer; // 130493
}

function isSmallCave(cave) {
  return cave.toLowerCase() === cave;
}

console.log('How many paths through this cave system are there that visit small caves at most once?', answerPartOne());
console.log('Given these new rules, how many paths through this cave system are there?', answerPartTwo());
