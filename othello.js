
// import { best_move } from './engine/othello_engine_api.js';

const SquareState = {
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2
};

const htmlBoard = document.getElementById('board');
const board = createBoard();
setupHtmlBoard();

let currentPlayer = 'black';
document.getElementById('currentplayer').innerHTML = 'Black to Go';

function getSquareSize() {
    return htmlBoard.rows[0].offsetHeight;
}

function diskSvg(color) {
    let size = getSquareSize();
    let size90 = Math.floor(size * 0.9);
    return `<svg role="img" height="${size}" width="${size}" title="${color}">
            <desc>${color}</desc>
            <circle cx="${Math.floor(size/2)}" cy="${Math.floor(size/2)}" r="${Math.floor(size90 / 2)}" stroke="${color}" stroke-width="1" fill="${color}" />
            </svg>`;
}

function createBoard() {
    let result = Array.from({length: 8},
        () => Array.from({length: 8}, () => SquareState.EMPTY));
    console.log(result);
    result[3][3] = result[4][4] = SquareState.WHITE;
    result[3][4] = result[4][3] = SquareState.BLACK;
    return result;
}

function getCell(row, col) {
    return htmlBoard.rows[row].cells[col];
}

function placeDisk(row, col, color) {
    cell = getCell(row, col);
    cell.innerHTML = diskSvg(color);
    cell.style.backgroundColor = 'green';
}

function setupHtmlBoard() {
    for (let i = 0; i < 8; i++) {
        const row = htmlBoard.insertRow();
        for (let j = 0; j < 8; j++) {
            const cell = row.insertCell();
            cell.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === 'Spacebar') {
                    cell.click();
                }});
            cell.onclick = () => play(cell);
        }
    }
    placeDisk(3, 3, 'white');
    placeDisk(4, 4, 'white');
    placeDisk(3, 4, 'black');
    placeDisk(4, 3, 'black');
}

function otherPlayer(player) {
    if (player === 'black') {
        return 'white';
    } else if (player === 'white') {
        return 'black';
    } else {
        throw new Error(`Invalid argument ${player}, expected 'black' or 'white'.`);
    }
}

function stringToSquareState(player) {
    if (player === 'black') {
        return SquareState.BLACK;
    } else if (player === 'white') {
        return SquareState.BLACK;
    } else {
        throw new Error(`Invalid argument ${player}, expected 'black' or 'white'.`);
    }
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function play(cell) {
    const col = cell.cellIndex;
    const row = cell.parentNode.rowIndex;
    if (board[row][col] !== SquareState.EMPTY) {
        return;
    }
    cell.innerHTML = diskSvg(currentPlayer);
    cell.style.backgroundColor = 'green';
    board[row][col] = stringToSquareState(currentPlayer);
    currentPlayer = otherPlayer(currentPlayer);
    document.getElementById('currentplayer').innerHTML = `${currentPlayer} to Go`;
}
    
function gameSettingsButtonClick(e) {
    const dialog = document.querySelector("dialog");
    const closeButton = document.querySelector("dialog button");
    dialog.showModal();
    closeButton.addEventListener("click", () => {
        e.preventDefault();
        dialog.close();
    });
}
