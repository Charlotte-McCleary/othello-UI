#include "game_state.h"
#include "minmax.h"
#include <stdint.h>

enum square_state **board_from_int32(int32_t white_high, int32_t white_low,
                                     int32_t black_high, int32_t black_low)  {
    enum square_state **board = board_alloc();
    int64_t white = white_high;
    int64_t black = black_high;
    white = (white << 32) | white_low;
    black = (black << 32) | black_low;
    for (uint8_t rank = 0; rank < 8; rank++) {
        for (uint8_t file = 0; file < 8; file++) {
            int64_t mask = 1LL << (8 * rank + file);
            if (white & mask) {
                board[rank][file] = SQUARE_WHITE;
            } else if (black & mask) {
                board[rank][file] = SQUARE_BLACK;
            } else {
                board[rank][file] = SQUARE_EMPTY;
            }
        }
    }
    return board;
}

extern int32_t oth_best_move(
    int32_t white_high, int32_t white_low, int32_t black_high,
    int32_t black_low, int32_t current_player, int32_t depth) {

    enum square_state **board = board_from_int32(white_high, white_low,
        black_high, black_low);
    struct square_index best = best_move(board, current_player, (size_t)depth);
    int32_t result = 8 * best.rank + best.file;
    board_free(board);
    return result;
}