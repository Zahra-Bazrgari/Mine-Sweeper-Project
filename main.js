let board = [];

let columns = 9;
let rows = columns;
let mines = 0;

const starterPage = document.querySelector(".starter-page");
const startGameButton = document.querySelector(".start-button");
let isValidMines = false;

let flagSelected = false;
const flagButton = document.querySelector(".flag-button");
const flag = '<i class="fa fa-flag" style="color:red;"></i>';

let minesLocation = [];
const bomb = '<i class="fa fa-bomb"></i>';

let gameOver = false;
let cellClickedNumber = 0;

let win = false;
let flagsPlaced = 0;


// gets the number of columns and mines from the user. The columns should be between 2 and 20, and the number of mines should be at least 1 less than rows * columns. 
// working fine 
function validateMinesInput() {
  const columnsInput = document.querySelector(".columns").value;
  const minesInput = document.querySelector(".user-mines").value;
  const errorMessageContainer = document.querySelector(".error-message");

  const userColumns = parseInt(columnsInput, 10);
  const userMines = parseInt(minesInput, 10);

  
  if (isNaN(userColumns) || userColumns < 2 || userColumns > 20) {
      errorMessageContainer.innerHTML = "Number of columns must be between 2 and 20.";
      isValidMines = false;
      return;
  } else {
      errorMessageContainer.innerHTML = "";
  }

  
  if (userMines >= userColumns * userColumns) {
      errorMessageContainer.innerHTML = `Number of mines should be less than ${userColumns * userColumns}.`;
      isValidMines = false;
  } else {
      errorMessageContainer.innerHTML = ""; 
      isValidMines = true;
      columns = userColumns;
      mines = userMines;
      updateBoardDimensions();
  }
}

// prevents accepting e or any other letters in input boxes
// working fine
function restrictInputToNumbers(event) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
}

const columnsInputField = document.querySelector(".columns");
const minesInputField = document.querySelector(".user-mines");

columnsInputField.addEventListener("input", restrictInputToNumbers);
minesInputField.addEventListener("input", restrictInputToNumbers);

columnsInputField.addEventListener("input", validateMinesInput);
minesInputField.addEventListener("input", validateMinesInput);

minesInputField.addEventListener("blur", validateMinesInput);


startGameButton.addEventListener("click", function () {
  if (!isValidMines) {
    return;
  }
  startDisplays();
  createBoard();
});

// hides the starting page and display the game board
// working fine
function startDisplays() {
  const inputContainer = document.querySelector(".input-container");
  inputContainer.style.display = "none";
  const gameDisplayHtml = document.querySelector(".game-display");
  gameDisplayHtml.style.display = "block";
  const textArea = document.querySelector(".text-area");
  textArea.style.display = "block";
}

// spreads mines randomly throughout the board
// working fine
function minesShuffle() {
  while (minesLocation.length < mines) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = `${r}-${c}`;
    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
    }
  }
}


// creates the board with cells in it based on user's inputs 
// working fine
function createBoard() {
  minesDisplay();
  minesShuffle();

  const gameBoard = document.querySelector(".game-board");
  gameBoard.innerHTML = "";
  board = [];

  // Ensure the game board is a square grid
  const size = Math.max(rows, columns); // This ensures the board is a square

  // Calculate the cell size based on the board size and number of cells
  const cellSize = (500 / size) - 2;

  for (let r = 0; r < size; r++) {
    let row = [];
    for (let c = 0; c < size; c++) {
      let cell = createCell(r, c, cellSize);
      gameBoard.append(cell);
      row.push(cell);
    }
    board.push(row);
  }
}

// creats each cell with a specific id 
// working fine
function createCell(row, col, cellSize) {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cell.id = `${row}-${col}`;

  cell.style.width = `${cellSize}px`;
  cell.style.height = `${cellSize}px`;

  cell.addEventListener("click", clickedCell);
  return cell;
}

// idk if this one is still necessary but sure we will keep it
// and it's working fine
function updateBoardDimensions() {
  rows = columns;
  createBoard();
}

// updates the "mine" counter on page
// working fine
function minesDisplay() {
  if (flagSelected) {
    return;
  }
  let mineDisplay = document.querySelector(".mine-count");
  mineDisplay.innerText = mines;
}

// updates the "flag" counter on page
// working fine
function updateFlagCount() {
  const flagDisplay = document.querySelector(".flag-count");
  flagDisplay.innerText = flagsPlaced;
}

flagButton.addEventListener("click", function () {
  if (gameOver) {
    return;
  }
  flagButton.classList.toggle("flag-clicked");
  flagSelected = !flagSelected;
});

// checks if the cell contains bomb or is near a bomb or else
//working fine
function clickedCell() {
  let cell = this; // clicked cell

  if (gameOver || cell.classList.contains("cell-clicked")) {
    return;
  }

  if (flagSelected) {
    if (cell.innerHTML === "") {
      cell.innerHTML = flag;
      flagsPlaced += 1;
    } else if (cell.innerHTML === flag) {
      cell.innerHTML = "";
      flagsPlaced -= 1;
    }
    updateFlagCount();
    return;
  }

  if (minesLocation.includes(cell.id)) {
    cell.innerHTML = bomb;
    cell.classList.add("bombed");
    gameOver = true;
    document.querySelectorAll(".cell").forEach(c => c.classList.add("default-hover"));
    bombDisplay();
    finalMessage();
    return;
  }

  let location = cell.id.split("-");
  let row = parseInt(location[0]);
  let column = parseInt(location[1]);
  let bombNumber = bombCheck(row, column);

  if (bombNumber > 0) {
    cell.innerText = bombNumber;
    cell.classList.add(`text-${bombNumber}`);
  } else {
    cell.innerText = "";
    cell.classList.add("empty");
    revealEmptyCells(row, column);
  }

  if (cellClickedNumber == rows * columns - mines) {
    document.querySelector(".mine-count").innerText = "Clear";
    gameOver = true;
    win = true;
    bombDisplay();
    finalMessage();
    return;
  }
}

// supposed to reset the game with the same costume settings 
// works ok
function resetButton() {
  board = [];
  minesLocation = [];
  cellClickedNumber = 0;
  gameOver = false;
  win = false;
  flagsPlaced = 0;
  updateFlagCount();

  if (flagSelected) {
    flagButton.classList.remove("flag-clicked");
    flagSelected = false;
  }

  const mineDisplay = document.querySelector(".mine-count");
  mineDisplay.innerText = mines;

  const finalMessageContainer = document.querySelector(".final-message-container");
  finalMessageContainer.style.display = "none";

  const finalText = document.querySelector(".final-message");
  finalText.innerText = "";
}

function returnMenu(){
  resetButton();

  const gameDisplayHtml = document.querySelector(".game-display");
  gameDisplayHtml.style.display = "none";

  const inputContainer = document.querySelector(".input-container");
  inputContainer.style.display = "block";

  document.querySelector(".columns").value = ""
  document.querySelector(".user-mines").value = ""
}

document.querySelector(".reset-game").addEventListener("click", function () {
  resetButton();
  createBoard();
});

document.querySelector(".return-starter-page").addEventListener("click", function () {
  returnMenu();
});

// this function checks on the number of bombs around a cell
// working fine
function bombCheck(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return 0;
  }

  if (board[r][c].classList.contains("cell-clicked")) {
    return 0;
  }

  board[r][c].classList.add("cell-clicked");
  cellClickedNumber += 1;

  let bombCount = 0;

  for (let i = r - 1; i <= r + 1; i++) {
    for (let j = c - 1; j <= c + 1; j++) {
      if (i >= 0 && i < rows && j >= 0 && j < columns) {
        if (minesLocation.includes(`${i}-${j}`)) {
          bombCount += 1;
        }
      }
    }
  }

  return bombCount;
}

// if user clickes on an empty cell this function is going to search for the nearest bomb around
// working fine
function revealEmptyCells(r, c) {
  for (let i = r - 1; i <= r + 1; i++) {
    for (let j = c - 1; j <= c + 1; j++) {
      if (i >= 0 && i < rows && j >= 0 && j < columns) {
        let emptyCell = board[i][j];

        if (
          !emptyCell.classList.contains("cell-clicked") &&
          emptyCell.innerHTML !== flag
        ) {
          let bombNumber = bombCheck(i, j);
          if (bombNumber > 0) {
            emptyCell.innerText = bombNumber;
            emptyCell.classList.add(`text-${bombNumber}`);
          } else if (!minesLocation.includes(`${i}-${j}`)) {
            emptyCell.innerText = "";
            emptyCell.classList.add("empty");
            revealEmptyCells(i, j);
          }
        }
      }
    }
  }
}

// this function shows all the bombs on the board on lose or win
// works fine
function bombDisplay() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let cell = board[r][c];
      if (minesLocation.includes(cell.id)) {
        cell.innerHTML = bomb;
        if (win) {
          cell.classList.add("win");
        } else {
          cell.classList.add("bombed");
        }
      }
    }
  }
}


function showConfetti() {
  const confettiElement = document.createElement('div');
  confettiElement.classList.add('confetti');
  document.body.appendChild(confettiElement);

  setTimeout(() => {
      confettiElement.remove();
  }, 3000);
}

function finalMessage() {

  const finalMessageContainer = document.querySelector(".final-message-container");
  const finalText = document.querySelector(".final-message");
  
  if (win) {
    finalText.innerText = "Congratulations! You won!";
    finalText.classList.add("wining-message");
  } else {
    finalText.innerText = "Game Over! You lost.";
    finalText.classList.remove("wining-message");
  }

  finalMessageContainer.style.display = "flex";

  if (win) {
    startConfetti();
  }

  document.querySelector(".play-again").addEventListener("click", function() {
    win = false;
    resetButton();
    createBoard();
  });

  document.querySelector(".go-back").addEventListener("click", function() {
    win = false;
    returnMenu();
  });
}

function startConfetti() {
  if (typeof confetti === 'undefined') {
    console.warn('Confetti library is not loaded.');
    return;
  }

  const end = Date.now() + 1000; 
  const colors = ['rgb(85, 227, 199)', 'rgb(252, 123, 164)'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}


