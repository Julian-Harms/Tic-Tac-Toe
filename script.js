const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
const board = Array(9).fill(null);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] === null) {
        board[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        if (checkWinner()) {
            document.getElementById('winner-message').textContent = `${currentPlayer} wins!`;
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        } else if (board.every(cell => cell !== null)) {
            document.getElementById('winner-message').textContent = `It's a draw!`;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
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
