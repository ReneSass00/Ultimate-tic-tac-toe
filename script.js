const boards = document.querySelectorAll('.board');
const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let currentBoard = -1; // -1 bedeutet, dass der Spieler in ein beliebiges kleines Feld spielen kann
const boardStatus = Array(9).fill(null).map(() => Array(9).fill(null)); // Status aller kleinen Felder
const metaBoard = Array(9).fill(null); // Status des großen Meta-Spielfelds

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

function handleClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));
    const boardIndex = parseInt(cell.parentElement.getAttribute('data-index'));

    if (boardStatus[boardIndex][cellIndex] !== null || (currentBoard !== -1 && currentBoard !== boardIndex)) {
        return;
    }

    boardStatus[boardIndex][cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin(boardStatus[boardIndex])) {
        metaBoard[boardIndex] = currentPlayer;
        cell.parentElement.classList.add(currentPlayer === 'X' ? 'win-x' : 'win-o');
        if (checkWin(metaBoard)) {
            setTimeout(() => {
                alert(`${currentPlayer} gewinnt das Spiel!`);
                resetGame();
            }, 100);
            return;
        }
    }

    if (boardStatus[boardIndex].every(cell => cell !== null)) {
        metaBoard[boardIndex] = 'tie'; // Unentschieden im kleinen Feld
    }

    currentBoard = cellIndex;
    if (metaBoard[currentBoard] !== null) {
        currentBoard = -1; // Falls das gewählte kleine Feld bereits gewonnen ist, darf der Spieler in ein beliebiges Feld spielen
    }
    updateActiveBoard();


    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function updateActiveBoard() {
    boards.forEach((board, index) => {
        if (currentBoard === -1 || index === currentBoard) {
            board.classList.add('active');
        } else {
            board.classList.remove('active');
        }
        if (metaBoard[index] !== null) {
            board.classList.remove('active');
        }

    });
}

function checkWin(board) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}

function resetGame() {
    boardStatus.forEach(board => board.fill(null));
    metaBoard.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    boards.forEach(board => {
        board.classList.remove('win-x', 'win-o', 'active');
    });
    currentPlayer = 'X';
    currentBoard = -1;
    updateActiveBoard();
}

// Initiales Setzen des aktiven Boards
updateActiveBoard();
