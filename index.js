import './style.css';

const appNode = document.getElementById('app');
const boardNode = document.getElementById('board');
const turnNode = document.getElementById('turn');

let player = 'X';

let board = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' '],
];

function clearBoard() {
  while (boardNode.lastChild) {
    boardNode.lastChild.remove();
  }
}

function checkFor3InARow(player = player) {
  // ROWS
  for (let i = 0; i < board.length; i++) {
    if (
      board[i][0] === player &&
      board[i][1] === player &&
      board[i][2] === player
    ) {
      return true;
    }
  }

  // COLUMNS
  for (let i = 0; i < board[0].length; i++) {
    if (
      board[0][i] === player &&
      board[1][i] === player &&
      board[2][i] === player
    ) {
      return true;
    }
  }

  // DIAGONAL
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  ) {
    return true;
  }

  if (
    board[2][0] === player &&
    board[1][1] === player &&
    board[0][2] === player
  ) {
    return true;
  }

  return false;
}

function winner() {
  const backdropNode = document.createElement('div');
  backdropNode.className = 'backdrop';
  const h1Node = document.createElement('h1');
  h1Node.className = player.toLowerCase();
  h1Node.textContent = player;
  const h3Node = document.createElement('h3');
  h3Node.textContent = 'WINNER!';
  backdropNode.append(h1Node, h3Node);
  boardNode.append(backdropNode);
  turnNode.textContent = player;

  const buttonNode = document.createElement('button');
  buttonNode.textContent = 'Restart game';
  buttonNode.addEventListener('click', () => {
    board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' '],
    ];

    player = 'X';

    drawBoard();

    buttonNode.remove();
  });
  appNode.append(buttonNode);
}

function tie() {
  const backdropNode = document.createElement('div');
  backdropNode.className = 'backdrop';
  const h1Node = document.createElement('h1');
  const xNode = document.createElement('span');
  const oNode = document.createElement('span');
  xNode.className = 'x';
  oNode.className = 'o';
  xNode.textContent = 'X';
  oNode.textContent = 'O';
  h1Node.append(xNode, oNode);

  const h3Node = document.createElement('h3');
  h3Node.textContent = 'TIE GAME!';
  backdropNode.append(h1Node, h3Node);
  boardNode.append(backdropNode);
  turnNode.textContent = 'XO';

  const buttonNode = document.createElement('button');
  buttonNode.textContent = 'Restart game';
  buttonNode.addEventListener('click', () => {
    board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' '],
    ];

    player = 'X';

    drawBoard();

    buttonNode.remove();
  });
  appNode.append(buttonNode);
}

function checkForTie() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === ' ') return false;
    }
  }

  return true;
}

function getRandomEmptyCell() {
  const emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === ' ') {
        emptyCells.push({ row: i, col: j });
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

function findBestMove() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === ' ') {
        board[i][j] = 'O';
        if (checkFor3InARow('O')) {
          board[i][j] = ' ';
          return { row: i, col: j };
        }
        board[i][j] = ' ';
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === ' ') {
        board[i][j] = 'X';
        if (checkFor3InARow('X')) {
          board[i][j] = ' ';
          return { row: i, col: j };
        }
        board[i][j] = ' ';
      }
    }
  }

  // Otherwise, make a random move
  return getRandomEmptyCell();
}

function checkForWinner() {
  if (checkFor3InARow(player)) {
    winner(player);
  } else if (checkForTie()) {
    tie();
  } else {
    player = player === 'X' ? 'O' : 'X';

    if (player === 'O') {
      setTimeout(() => {
        const { row, col } = findBestMove();
        board[row][col] = 'O';
        drawBoard();

        checkForWinner();
      }, 500);
    }
  }
}

function drawBoard() {
  clearBoard();

  turnNode.textContent = `${player} turn`;

  for (let i = 0; i < board.length; i++) {
    const rowNode = document.createElement('div');
    rowNode.className = 'row';

    for (let j = 0; j < board[i].length; j++) {
      const colNode = document.createElement('div');

      colNode.addEventListener('click', () => {
        if (board[i][j] !== ' ' || player === 'O') return;

        board[i][j] = player;
        drawBoard();

        checkForWinner();
      });

      colNode.className = `col ${board[i][j].toLowerCase()}`;
      colNode.textContent = board[i][j];
      rowNode.append(colNode);
    }
    boardNode.append(rowNode);
  }
}

drawBoard();
