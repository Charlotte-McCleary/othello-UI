
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
        rank %= 4;
        const shift = 8 * rank + file;
        if (board[rank][file] == SquareState.WHITE) {
            return [1 << shift, 0];
        } else if (board[rank][file] == SquareState.BLACK) {
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
            whiteMigh |= wMask;
            blackHigh |= bMask;
        }
    }
    let move;
    if (currentPlayer == "black") {
        move = engineBestMove(whiteHigh, whiteLow, blackHigh, blackLow, depth);
    } else {
        move = engineBestMove(blackHigh, blackLow, whiteHigh, whiteLow, depth);
    }
    const resultRank = Math.floor(move / 8);
    const resultFile = move % 8;
    return [resultRank, resultFile];
}

function inBounds(rank, file) {
    return (0 <= rank && rank < 8 && 0 <= file && file < 8);
}
