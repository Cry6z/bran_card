// --- MINI GAMES LOGIC ---
const gamesOverlay = document.getElementById('games-overlay');
const gamesBtn = document.getElementById('games-btn');

if (gamesBtn) {
    gamesBtn.onclick = openGames;
}

function openGames() {
    gamesOverlay.style.display = 'flex';
    setTimeout(() => gamesOverlay.classList.add('visible'), 10);
    resetTTT();
}

function closeGames() {
    gamesOverlay.classList.remove('visible');
    setTimeout(() => {
        gamesOverlay.style.display = 'none';
        stopSnake();
    }, 400);
}

function switchGame(gameId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    document.querySelectorAll('.game-content').forEach(content => content.classList.remove('active'));
    document.getElementById('game-' + gameId).classList.add('active');

    if (gameId === 'tictactoe') resetTTT();
    if (gameId === 'snake') resetSnake();
    if (gameId === 'chess') resetChess();

    if (gameId !== 'snake') stopSnake();
}

// --- TIC TAC TOE ---
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttActive = true;
let tttPlayer = 'X';
let tttDifficulty = 'easy';
let chessDifficulty = 'medium';

function toggleTTTDropdown() {
    document.getElementById('ttt-difficulty-container').classList.toggle('active');
    const chessCont = document.getElementById('chess-difficulty-container');
    if (chessCont) chessCont.classList.remove('active');
}

function changeTTTDifficulty(value, label) {
    tttDifficulty = value;
    document.getElementById('ttt-difficulty-label').innerText = label;
    document.getElementById('ttt-difficulty-container').classList.remove('active');
    resetTTT();
}

function toggleChessDropdown() {
    document.getElementById('chess-difficulty-container').classList.toggle('active');
    const tttCont = document.getElementById('ttt-difficulty-container');
    if (tttCont) tttCont.classList.remove('active');
}

function changeChessDifficulty(value, label) {
    chessDifficulty = value;
    document.getElementById('chess-difficulty-label').innerText = label;
    document.getElementById('chess-difficulty-container').classList.remove('active');
    resetChess();
}

window.addEventListener('click', function (e) {
    const tttContainer = document.getElementById('ttt-difficulty-container');
    if (tttContainer && !tttContainer.contains(e.target)) {
        tttContainer.classList.remove('active');
    }
    const chessContainer = document.getElementById('chess-difficulty-container');
    if (chessContainer && !chessContainer.contains(e.target)) {
        chessContainer.classList.remove('active');
    }
});

function resetTTT() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttActive = true;
    tttPlayer = 'X';
    const status = document.getElementById('ttt-status');
    if (status) status.innerText = "Your Turn";
    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach(cell => {
        cell.className = 'ttt-cell';
        cell.onclick = (e) => tttClick(parseInt(e.target.dataset.index));
    });
}

function tttClick(index) {
    if (!tttActive || tttBoard[index] !== '') return;

    makeMove(index, 'X');
    if (tttActive) {
        document.getElementById('ttt-status').innerText = "AI is thinking...";
        setTimeout(tttAI, 400);
    }
}

function makeMove(index, player) {
    tttBoard[index] = player;
    const cell = document.querySelector(`.ttt-cell[data-index="${index}"]`);
    if (cell) cell.classList.add(player.toLowerCase() + '-marker');

    if (checkWin(tttBoard)) {
        document.getElementById('ttt-status').innerText = (player === 'X' ? "You win!" : "AI wins!");
        tttActive = false;
    } else if (tttBoard.every(c => c !== '')) {
        document.getElementById('ttt-status').innerText = "It's a draw!";
        tttActive = false;
    } else {
        tttPlayer = (player === 'X' ? 'O' : 'X');
        document.getElementById('ttt-status').innerText = (tttPlayer === 'X' ? "Your Turn" : "AI Turn");
    }
}

function tttAI() {
    if (!tttActive) return;
    let move;

    if (tttDifficulty === 'easy') {
        move = getRandomMove();
    } else if (tttDifficulty === 'medium') {
        move = getMediumMove();
    } else {
        move = getHardMove();
    }

    if (move !== undefined) makeMove(move, 'O');
}

function getRandomMove() {
    let available = tttBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    return available[Math.floor(Math.random() * available.length)];
}

function getMediumMove() {
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'O';
            if (checkWin(tttBoard)) { tttBoard[i] = ''; return i; }
            tttBoard[i] = '';
        }
    }
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'X';
            if (checkWin(tttBoard)) { tttBoard[i] = ''; return i; }
            tttBoard[i] = '';
        }
    }
    return getRandomMove();
}

function getHardMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'O';
            let score = tttMinimax(tttBoard, 0, false);
            tttBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function checkWinPlayer(board, player) {
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return wins.some(w => board[w[0]] === player && board[w[1]] === player && board[w[2]] === player);
}

function tttMinimax(board, depth, isMaximizing) {
    if (checkWinPlayer(board, 'O')) return 10 - depth;
    if (checkWinPlayer(board, 'X')) return depth - 10;
    if (board.every(c => c !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = tttMinimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = tttMinimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(board) {
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return wins.some(w => board[w[0]] && board[w[0]] === board[w[1]] && board[w[0]] === board[w[2]]);
}

// --- SNAKE ---
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [];
let food = {};
let score = 0;
let snakeDir;
let snakeTimer;

function resetSnake() {
    stopSnake();
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 14 + 1) * box,
        y: Math.floor(Math.random() * 14 + 1) * box
    };
    score = 0;
    snakeDir = null;
    document.getElementById('snake-score').innerText = "Score: 0";
    drawSnake();
}

function startSnake() {
    resetSnake();
    snakeDir = "RIGHT";
    if (snakeTimer) clearInterval(snakeTimer);
    snakeTimer = setInterval(updateSnake, 150);

    document.addEventListener('keydown', direction);

    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });

    canvas.addEventListener('touchend', function (e) {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;

        let dx = touchEndX - touchStartX;
        let dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30 && snakeDir != "LEFT") snakeDir = "RIGHT";
            else if (dx < -30 && snakeDir != "RIGHT") snakeDir = "LEFT";
        } else {
            if (dy > 30 && snakeDir != "UP") snakeDir = "DOWN";
            else if (dy < -30 && snakeDir != "DOWN") snakeDir = "UP";
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });
}

function stopSnake() {
    if (snakeTimer) clearInterval(snakeTimer);
    document.removeEventListener('keydown', direction);
}

function direction(event) {
    const key = event.keyCode;
    const char = String.fromCharCode(key).toUpperCase();

    if ((key == 37 || char == 'A') && snakeDir != "RIGHT") snakeDir = "LEFT";
    else if ((key == 38 || char == 'W') && snakeDir != "DOWN") snakeDir = "UP";
    else if ((key == 39 || char == 'D') && snakeDir != "LEFT") snakeDir = "RIGHT";
    else if ((key == 40 || char == 'S') && snakeDir != "UP") snakeDir = "DOWN";
}

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#fff" : "rgba(255,255,255,0.5)";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ff4444";
    ctx.fillRect(food.x, food.y, box, box);
}

function updateSnake() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeDir == "LEFT") snakeX -= box;
    if (snakeDir == "UP") snakeY -= box;
    if (snakeDir == "RIGHT") snakeX += box;
    if (snakeDir == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        document.getElementById('snake-score').innerText = "Score: " + score;
        food = {
            x: Math.floor(Math.random() * 14 + 1) * box,
            y: Math.floor(Math.random() * 14 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(snakeTimer);
        document.getElementById('snake-score').innerText = "Game Over! Score: " + score;
        return;
    }

    snake.unshift(newHead);
    drawSnake();
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

// --- CHESS ---
let chessBoard = [];
let selectedSquare = null;
let chessTurn = 'white';
let chessGameActive = true;

const piecesTable = {
    'white': { 'p': '♙', 'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔' },
    'black': { 'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚' }
};

const pieceValues = { 'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900 };

function resetChess() {
    chessBoard = [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
    chessTurn = 'white';
    selectedSquare = null;
    chessGameActive = true;
    renderChess();
}

function renderChess() {
    const boardEl = document.getElementById('chess-board');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    
    let whiteInCheck = isKingInCheck('w', chessBoard);
    let blackInCheck = isKingInCheck('b', chessBoard);
    
    if (chessGameActive) {
        let currentMoves = getAllMoves(chessTurn, chessBoard);
        if (currentMoves.length === 0) {
            chessGameActive = false;
            let inCheck = (chessTurn === 'white' && whiteInCheck) || (chessTurn === 'black' && blackInCheck);
            document.getElementById('chess-status').innerText = inCheck ? (chessTurn === 'white' ? "Checkmate! AI Wins!" : "Checkmate! You Win!") : "Stalemate!";
        } else {
            let inCheck = (chessTurn === 'white' && whiteInCheck) || (chessTurn === 'black' && blackInCheck);
            document.getElementById('chess-status').innerText = inCheck ? "CHECK! " + (chessTurn === 'white' ? "Your Turn" : "AI Turn") : (chessTurn === 'white' ? "Your Turn" : "AI Turn");
        }
    }

    const validMoves = selectedSquare ? getValidMoves(selectedSquare.r, selectedSquare.c) : [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.className = `chess-square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;

            const isValidMove = validMoves.some(m => m.r === r && m.c === c);
            if (isValidMove) square.classList.add('valid-move');

            const piece = chessBoard[r][c];
            if (piece) {
                const pieceEl = document.createElement('span');
                pieceEl.className = 'chess-piece';
                pieceEl.innerText = piecesTable[piece[0] === 'w' ? 'white' : 'black'][piece[1]];
                
                if (piece === 'wk' && whiteInCheck) square.style.backgroundColor = 'rgba(255, 60, 60, 0.7)';
                if (piece === 'bk' && blackInCheck) square.style.backgroundColor = 'rgba(255, 60, 60, 0.7)';
                
                square.appendChild(pieceEl);
            }

            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                square.classList.add('selected');
            }

            square.onclick = () => chessClick(r, c);
            boardEl.appendChild(square);
        }
    }
}

function chessClick(r, c) {
    if (!chessGameActive || chessTurn !== 'white') return;

    const clickedPiece = chessBoard[r][c];
    const validMoves = selectedSquare ? getValidMoves(selectedSquare.r, selectedSquare.c) : [];
    const isValidMove = validMoves.some(m => m.r === r && m.c === c);

    if (isValidMove) {
        executeMove(selectedSquare.r, selectedSquare.c, r, c);
        selectedSquare = null;
        setTimeout(chessAI, 600);
    } else if (clickedPiece && clickedPiece[0] === 'w') {
        selectedSquare = { r, c };
    } else {
        selectedSquare = null;
    }
    renderChess();
}

function executeMove(fromR, fromC, toR, toC) {
    chessBoard[toR][toC] = chessBoard[fromR][fromC];
    chessBoard[fromR][fromC] = '';
    chessTurn = (chessTurn === 'white' ? 'black' : 'white');
}

function getLegalMoves(r, c, b = chessBoard) {
    const piece = b[r][c];
    if (!piece) return [];
    const type = piece[1];
    const color = piece[0];
    const moves = [];

    const dirs = {
        'r': [[0, 1], [0, -1], [1, 0], [-1, 0]],
        'b': [[1, 1], [1, -1], [-1, 1], [-1, -1]],
        'q': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
        'k': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
        'n': [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]]
    };

    if (type === 'p') {
        const forward = (color === 'w' ? -1 : 1);
        if (r + forward >= 0 && r + forward < 8 && b[r + forward][c] === '') {
            moves.push({ r: r + forward, c: c });
            if ((color === 'w' && r === 6) || (color === 'b' && r === 1)) {
                if (b[r + forward][c] === '' && b[r + 2 * forward][c] === '') moves.push({ r: r + 2 * forward, c: c });
            }
        }
        [[forward, 1], [forward, -1]].forEach(d => {
            const nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                const target = b[nr][nc];
                if (target !== '' && target[0] !== color) moves.push({ r: nr, c: nc });
            }
        });
    } else if (dirs[type]) {
        const limit = (type === 'k' || type === 'n' ? 1 : 8);
        dirs[type].forEach(d => {
            for (let i = 1; i <= limit; i++) {
                const nr = r + d[0] * i, nc = c + d[1] * i;
                if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
                const target = b[nr][nc];
                if (target === '') {
                    moves.push({ r: nr, c: nc });
                } else {
                    if (target[0] !== color) moves.push({ r: nr, c: nc });
                    break;
                }
            }
        });
    }
    return moves;
}

function getValidMoves(r, c, b = chessBoard) {
    const moves = getLegalMoves(r, c, b);
    const validMoves = [];
    const color = b[r][c][0];
    for (let m of moves) {
        let tempBoard = copyBoard(b);
        tempBoard[m.r][m.c] = tempBoard[r][c];
        tempBoard[r][c] = '';
        if (!isKingInCheck(color, tempBoard)) validMoves.push(m);
    }
    return validMoves;
}

function isKingInCheck(color, b = chessBoard) {
    let kr = -1, kc = -1;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c] === color + 'k') { kr = r; kc = c; break; }
        }
        if (kr !== -1) break;
    }
    if (kr === -1) return false;
    let opp = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c].startsWith(opp)) {
                let moves = getLegalMoves(r, c, b);
                if (moves.some(m => m.r === kr && m.c === kc)) return true;
            }
        }
    }
    return false;
}

function chessAI() {
    if (!chessGameActive || chessTurn !== 'black') return;

    let allMoves = getAllMoves('black', chessBoard);
    if (allMoves.length === 0) return;

    let bestMove = null;

    if (chessDifficulty === 'easy') {
        let captures = allMoves.filter(m => chessBoard[m.to.r][m.to.c] !== '');
        if (captures.length > 0 && Math.random() > 0.5) {
            bestMove = captures[Math.floor(Math.random() * captures.length)];
        } else {
            bestMove = allMoves[Math.floor(Math.random() * allMoves.length)];
        }
    } else if (chessDifficulty === 'medium') {
        let bestScore = -Infinity;
        for (let m of allMoves) {
            let tempBoard = copyBoard(chessBoard);
            applyMove(tempBoard, m);
            let score = chessMinimax(tempBoard, 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        }
    } else {
        let bestScore = -Infinity;
        allMoves.sort((a, b) => {
            let valA = chessBoard[a.to.r][a.to.c] ? pieceValues[chessBoard[a.to.r][a.to.c][1]] : 0;
            let valB = chessBoard[b.to.r][b.to.c] ? pieceValues[chessBoard[b.to.r][b.to.c][1]] : 0;
            return valB - valA;
        });

        for (let m of allMoves) {
            let tempBoard = copyBoard(chessBoard);
            applyMove(tempBoard, m);
            let score = chessMinimax(tempBoard, 2, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        }
    }

    if (!bestMove && allMoves.length > 0) bestMove = allMoves[0];

    if (bestMove) {
        executeMove(bestMove.from.r, bestMove.from.c, bestMove.to.r, bestMove.to.c);
        renderChess();
    }
}

function chessMinimax(board, depth, alpha, beta, isMaximizing) {
    if (depth === 0) return evaluateBoard(board);

    let moves = getAllMoves(isMaximizing ? 'black' : 'white', board);
    if (moves.length === 0) {
        let inCheck = isKingInCheck(isMaximizing ? 'b' : 'w', board);
        if (inCheck) {
            return isMaximizing ? -9000 - depth : 9000 + depth;
        }
        return 0;
    }

    moves.sort((a, b) => {
        let valA = board[a.to.r][a.to.c] ? pieceValues[board[a.to.r][a.to.c][1]] : 0;
        let valB = board[b.to.r][b.to.c] ? pieceValues[board[b.to.r][b.to.c][1]] : 0;
        return valB - valA;
    });

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let m of moves) {
            let tempBoard = copyBoard(board);
            applyMove(tempBoard, m);
            let ev = chessMinimax(tempBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let m of moves) {
            let tempBoard = copyBoard(board);
            applyMove(tempBoard, m);
            let ev = chessMinimax(tempBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function getAllMoves(color, b) {
    let m = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c].startsWith(color[0])) { getValidMoves(r, c, b).forEach(l => m.push({ from: { r, c }, to: l })); }
        }
    }
    return m;
}

function copyBoard(b) { return b.map(row => [...row]); }
function applyMove(b, m) { b[m.to.r][m.to.c] = b[m.from.r][m.from.c]; b[m.from.r][m.from.c] = ''; }

const pawnEvalBlack = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

const knightEval = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];

const centerBonus = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 0, 10, 20, 20, 10, 0, -10],
    [-10, 0, 10, 20, 20, 10, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
];

function evaluateBoard(b) {
    let s = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let piece = b[r][c];
            if (piece) {
                let isBlack = piece[0] === 'b';
                let type = piece[1];
                let val = pieceValues[type];
                if (type === 'p') {
                    let rank = isBlack ? r : 7 - r;
                    val += pawnEvalBlack[rank][c];
                } else if (type === 'n') {
                    val += knightEval[r][c];
                } else {
                    val += centerBonus[r][c];
                }
                s += (isBlack ? val : -val);
            }
        }
    }
    return s;
}
