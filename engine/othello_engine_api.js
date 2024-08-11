
import Module from './othello_engine.js';

const oth_best_move = await Module().then(engine => {
    return engine.cwrap("oth_best_move", "number",
        ["number", "number", "number", "number", "number", "number"]);
})

const SquareState = {
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2
}

export function best_move(board, current_player, depth) {
    let white_high = 0, white_low = 0, black_high = 0, black_low = 0;
    
    const get_masks = (rank, file) => {
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
            const [w_mask, b_mask] = get_masks(rank, file);
            white_low |= w_mask;
            black_low |= b_mask;
        }
    }
    for (let rank = 4; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const [w_mask, b_mask] = get_masks(rank, file);
            white_high |= w_mask;
            black_high |= b_mask;
        }
    }
    let move = oth_best_move(white_low, white_high, black_low, black_high,
        current_player, depth);
    const result_rank = Math.floor(move / 8);
    const result_file = move % 8;
    return [result_rank, result_file];
}

function in_bounds(rank, file) {
    return (0 <= rank && rank < 8 && 0 <= file && file < 8);
}
