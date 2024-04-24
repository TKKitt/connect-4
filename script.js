// Initializing constants
const tokenDropSound = new Audio("token-drop.wav");
const gameWinSound = new Audio("winner.wav");

const PLAYER1 = 1;
const PLAYER2 = 2;

const GAME_ON = "on";
const GAME_TIE = "tie";
const GAME_WIN = "win";

// Setting the game
let board = Array(6)
  .fill()
  .map(() => Array(7).fill(0));
let gameStatus = GAME_ON;
let currentPlayer = PLAYER1;

// Getting the reset button and adding event listeners to all cells
document.getElementById("reset-button").addEventListener("click", resetGame);
let cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
  cell.addEventListener("mouseover", (event) => {
    let id = parseInt(event.target.id);
    let col = id % 7;
    let row = findLowestEmptyCell(col);
    if (row !== -1) {
      highlightCell(row, col);
    }
  });
  cell.addEventListener("mouseout", (event) => {
    let id = parseInt(event.target.id);
    let col = id % 7;
    let row = findLowestEmptyCell(col);
    if (row !== -1) {
      removeHighlight(row, col);
    }
  });
});

// Function to handle click events
function handleClick(event) {
  if (gameStatus !== "on") {
    return;
  }
  let id = parseInt(event.target.id);
  let col = id % 7;
  let row;

  for (let i = 5; i >= 0; i--) {
    if (board[i][col] === 0) {
      row = i;
      break;
    }
  }

  if (row === undefined) {
    console.log("Invalid move");
    return;
  }

  board[row][col] = currentPlayer;
  let cell = document.getElementById(row * 7 + col);
  cell.classList.add(`player-${currentPlayer}`);
  checkWin(row, col);

  if (gameStatus === GAME_WIN) {
    gameWinSound.play();
  } else if (checkTie()) {
    gameStatus = GAME_TIE;
  } else {
    tokenDropSound.play();
    switchPlayer();
  }
}

// Function to check for a win
function checkWin(row, col) {
  const directions = [
    [
      [0, -1],
      [0, 1],
    ], //horizontal
    [
      [-1, 0],
      [1, 0],
    ], //vertical
    [
      [-1, -1],
      [1, 1],
    ], //diagonal from top-left to bottom-right
    [
      [-1, 1],
      [1, -1],
    ], //diagonal from top-right to bottom-left
  ];

  for (const direction of directions) {
    let count = 1;
    const winningCells = [[row, col]];
    for (let i = 0; i < 2; i++) {
      let currentRow = row;
      let currentCol = col;
      while (
        isWithinBoardAndBelongsToCurrentPlayer(
          currentRow + direction[i][0],
          currentCol + direction[i][1],
          board[row][col]
        )
      ) {
        currentRow += direction[i][0];
        currentCol += direction[i][1];
        count++;
        winningCells.push([currentRow, currentCol]);
      }
    }
    if (count >= 4) {
      highlightWinningCells(winningCells);
      gameStatus = GAME_WIN;
      gameWinSound.play();
      document.getElementById("reset-button").style.visibility = "visible";
      return;
    }
  }
}

// Function to check for a tie
function checkTie() {
  for (let row of board) {
    for (let cell of row) {
      if (cell === 0) {
        return false;
      }
    }
  }
  gameStatus = GAME_TIE;
  document.getElementById("reset-button").style.visiblity = "visible";
  return true;
}

// Function to switch to the next player
function switchPlayer() {
  currentPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
  updateStatusBar();
}

// Function to check if a move belongs to the current player and is within the bounds of the board
function isWithinBoardAndBelongsToCurrentPlayer(row, col, currentPlayer) {
  return (
    row >= 0 &&
    row < 6 &&
    col >= 0 &&
    col < 7 &&
    board[row][col] === currentPlayer
  );
}

// Function to find the lowest empty cell in a column
function findLowestEmptyCell(col) {
  for (let i = 5; i >= 0; i--) {
    if (board[i][col] === 0) {
      return i;
    }
  }
  return -1;
}

// Function to highlight the lowest empty cell in a column
function highlightCell(row, col) {
  let cell = document.getElementById(row * 7 + col);
  cell.classList.add("highlight");
}

// Function to remove the highlight
function removeHighlight(row, col) {
  let cell = document.getElementById(row * 7 + col);
  cell.classList.remove("highlight");
}

// Function to highlight the winning cells
function highlightWinningCells(cells) {
  for (let cell of cells) {
    let domCell = document.getElementById(cell[0] * 7 + cell[1]);
    domCell.classList.add("winning-cell");
  }
}

// Function to reset the game
function resetGame() {
  board = Array(6)
    .fill()
    .map(() => Array(7).fill(0));
  currentPlayer = PLAYER1;
  gameStatus = GAME_ON;
  document.getElementById("reset-button").style.visibility = "hidden";

  let cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.className = "cell";
  });
  updateStatusBar();
}

// Function  to update the status bar
function updateStatusBar() {
  document.getElementById("player-1-status").classList.remove("current-player");
  document.getElementById("player-2-status").classList.remove("current-player");
  document
    .getElementById(`player-${currentPlayer}-status`)
    .classList.add("current-player");
}
