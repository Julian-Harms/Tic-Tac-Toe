const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let board = Array(9).fill(null);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    let index = e.target.dataset.index;
    if (board[index] === null) {
        board[index] = currentPlayer;
        e.target.textContent = currentPlayer;

        if (isGameOver()) return; // Stop if game ends

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (currentPlayer === 'O') {
            aiMove(); // Small delay for better UX
        }
    }
}

function aiMove() {
    let bestMove = getBestMove();
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    isGameOver();
    currentPlayer = 'X'; // Switch turn back
}

function getBestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) return result === 'X' ? -10 + depth : result === 'O' ? 10 - depth : 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return winner ('X' or 'O')
        }
    }

    return board.includes(null) ? null : 'draw'; // Return 'draw' if no empty spaces
}

function isGameOver() {
    let result = checkWinner();
    if (result) {
        document.getElementById('winner-message').textContent =
            result === 'draw' ? "It's a draw!" : `${result} wins!`;
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        return true;
    }
    return false;
}

function resetBoard() {
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleCellClick);
    });
    currentPlayer = 'X';
    document.getElementById('winner-message').textContent = '';
}