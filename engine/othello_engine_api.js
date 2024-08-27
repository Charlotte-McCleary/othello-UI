
import Module from './othello_engine.js';

const engineBestMove = await Module().then(engine => {
    return engine.cwrap("best_move_pack32", "number",
        ["number", "number", "number", "number", "number"]);
})

const SquareState = {
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2
}

export function bestMove(board, currentPlayer, depth) {
    let whiteHigh = 0, whiteLow = 0, blackHigh = 0, blackLow = 0;
    
    const getMasks = (rank, file) => {
        const shift = 8 * (rank % 4) + file;
        if (board[rank][file] === SquareState.WHITE) {
            return [1 << shift, 0];
        } else if (board[rank][file] === SquareState.BLACK) {
            return [0, 1 << shift];
        } else {
            return [0, 0];
        }
    }
    
    for (let rank = 0; rank < 4; rank++) {
        for (let file = 0; file < 8; file++) {
            const [wMask, bMask] = getMasks(rank, file);
            whiteLow |= wMask;
            blackLow |= bMask;
        }
    }
    for (let rank = 4; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const [wMask, bMask] = getMasks(rank, file);
            whiteHigh |= wMask;
            blackHigh |= bMask;
        }
    }
    let move;
    if (currentPlayer === "black") {
        move = engineBestMove(whiteHigh, whiteLow, blackHigh, blackLow, depth);
    } else {
        move = engineBestMove(blackHigh, blackLow, whiteHigh, whiteLow, depth);
    }
    const resultRank = Math.floor(move / 8);
    const resultFile = move % 8;
    console.log(move, resultRank, resultFile);
    return [resultRank, resultFile];
}


function inBounds(rank, file) {
    return (0 <= rank && rank < 8 && 0 <= file && file < 8);
}

function oppositeColor(player) {
    if (player === "black") {
        return SquareState.WHITE;
    } else if (player === "white") {
        return SquareState.BLACK;
    } else {
        throw new Error("Invalid player string.");
    }
}

function currentColor(player) {
    if (player === "black") {
        return SquareState.BLACK;
    } else if (player === "white") {
        return SquareState.WHITE;
    } else {
        throw new Error("Invalid player string.");
    }
}

function isValidDirection(board, currentPlayer, rank, file, rankDelta, fileDelta) {
    if (!inBounds(rank, file) ||
        !inBounds(rank + rankDelta, file + fileDelta)) {
        return false;
    }
    if (board[rank + rankDelta][file + fileDelta] != oppositeColor(currentPlayer)) {
        return false;
    }
    rank += rankDelta;
    file += fileDelta;
    while (inBounds(rank, file) &&
            board[rank][file] === oppositeColor(currentPlayer)) {
        rank += rankDelta;
        file += fileDelta;
    }
    if (inBounds(rank, file) &&
            board[rank][file] === currentColor(currentPlayer)) {
        return true;
    } else {
        return false;
    }
}

export function isValidMove(board, currentPlayer, rank, file) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i === 0 && j === 0) && isValidDirection(board, currentPlayer, rank, file, i, j)) {
                return true;
            }
        }
    }
    return false;
}

export function makeMove(board, currentPlayer, rank, file) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i == 0 && j == 0)) {
                flipDirection(board, currentPlayer, rank, file, i, j);
            }
        }
    }
    board[rank][file] = currentColor(currentPlayer);
    return board;
}

function flipDirection(board, currentPlayer, rank, file, rankDelta, fileDelta) {
    if (!isValidDirection(board, currentPlayer, rank, file, rankDelta, fileDelta)) {
        return false;
    }
    rank += rankDelta;
    file += fileDelta;
    while (inBounds(rank, file) &&
           board[rank][file] == oppositeColor(currentPlayer)) {
        board[rank][file] = currentColor(currentPlayer);
        rank += rankDelta;
        file += fileDelta;
    }
    return true;
}
