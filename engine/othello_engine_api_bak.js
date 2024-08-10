
import Module from './othello_engine.js';

module = new Module();

const SquareState = {
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2
}

export function best_move(board, current_player, depth) {
    oth_best_move = Module.cwrap("oth_best_move", "number",
        ["number", "number", "number", "number", "number", "number"]);
    let white_high = 0, white_low = 0, black_high = 0, black_low = 0;
    
    const get_masks = (rank, file) => {
        shift = 8 * rank + file;
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
    const result_file = result % 8;
    return [result_rank, result_file];
}

function in_bounds(rank, file) {
    return (0 <= rank && rank < 8 && 0 <= file && file < 8);
}

function opposite_color(color) {
    if (color == "B") {
        return "W";
    } else {
        return "B";
    }
}


// function is_valid_direction(board, current_player, rank, file, rank_delta, file_delta) {
//    if (!in_bounds(rank, file) ||
//        !in_bounds(rank + rank_delta, file + file_delta)) {
//        return false;
    // }
    // if (board[rank + rank_delta][file + file_delta] != opposite_color(current_player)) {
        // return false;
    // }
    // rank += rank_delta;
    // file += file_delta;
    // while (in_bounds(rank, file) &&
           // board[rank][file] == opposite_color(current_player)) {
        // rank += rank_delta;
        // file += file_delta;
    // }
    // if (in_bounds(rank, file) &&
        // board[rank][file] == current_color(current_player)) {
        // return true;
    // } else {
        // return false;
    // }
// }

function is_valid_move(board, current_player, rank, file) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i == 0 && j == 0) && is_valid_direction(board, current_player, rank, file, i, j)) {
                return true;
            }
        }
    }
    return false;
}

function make_move(board, current_player, rank, file) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i == 0 && j == 0)) {
                flip_direction(board, current_player, rank, file, i, j);
            }
        }
    }
    board[rank][file] = current_color(current_player);
    return board;
}

function flip_direction(board, current_player, rank, file, rank_delta, file_delta) {
    if (!is_valid_direction(board, current_player, rank, file, rank_delta, file_delta)) {
        return false;
    }
    rank += rank_delta;
    file += file_delta;
    while (in_bounds(rank, file) &&
           board[rank][file] == opposite_color(current_player)) {
        board[rank][file] = current_color(current_player);
        rank += rank_delta;
        file += file_delta;
    }
    return true;
}
