
// import { best_move } from './engine/othello_engine_api.js';

const boardSize = 8;
const htmlBoard = document.getElementById('board');
let board = new Array(boardSize);
for (var i = 0; i<boardSize; i++) {
    board[i] = new Array(boardSize);
}

function getSquareSize() {
    return htmlBoard.rows[0].offsetHeight;
}

const SquareState = {
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2
}
for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    const row = htmlBoard.insertRow();
    for (let j = 0; j < boardSize; j++) {
        const cell = row.insertCell();
        //cell.setAttribute("tabIndex", "0");
        cell.addEventListener('keypress', function(e) {
        if (e.key === "Enter" || e.key === "Spacebar") {
            cell.click();
        }});
        if ((i === 3 && j === 3) || (i === 4 && j === 4)) {
            let size = getSquareSize();
            let size90 = Math.floor(size * 0.9);
            cell.innerHTML=`<svg role="img" height="${size}" width="${size}" title="white">
            <desc>white</desc>
            <circle cx="${Math.floor(size/2)}" cy="${Math.floor(size/2)}" r="${Math.floor(size90 / 2)}" stroke="white" stroke-width="3" fill="white" />
            </svg>`;
            cell.style.backgroundColor = 'green';
            board[i][j] = SquareState.WHITE;
}
            else 
            if ((i === 3 && j === 4) || (i === 4 && j === 3)) {
                let size = getSquareSize();
                let size90 = Math.floor(size * 0.9);
                cell.innerHTML=`<svg role="img" height="${size}" width="${size}" title="black">
                <desc>black</desc>
                <circle cx="${Math.floor(size / 2)}" cy="${Math.floor(size / 2)}" r="${Math.floor(size90 / 2)}" stroke="black" stroke-width="3" fill="black" />
                </svg>`;
                cell.style.backgroundColor = 'green';
                board[i][j] = SquareState.BLACK;
            }   
            else {
                cell.onclick = () => play(cell);
            }
        }
}

let currentPlayer = 'black';
document.getElementById("currentplayer").innerHTML = "Black to Go";

function play(cell) {
    
    const col = cell.cellIndex;
    // alert(`cell col = ${col}`);
    const row = cell.parentNode.rowIndex;
    if (cell.innerHTML !== "") {
        return;
    }
    let size = getSquareSize();
    let size90 = Math.floor(size * 0.9);
    cell.innerHTML=`<svg role="img" height="${size}" width="${size}" title="${currentPlayer}">
    <desc>${currentPlayer}</desc>
<circle cx="${Math.floor(size / 2)}" cy="${Math.floor(size / 2)}" r="${Math.floor(size90 / 2)}" stroke=${currentPlayer} stroke-width="3" fill=${currentPlayer} />
    </svg>`;
    //alert(`cell col = ${col} and row = ${row}`);
    cell.style.backgroundColor = 'green';
    if (currentPlayer === 'black') {
        board[col][row] = SquareState.BLACK; 
        currentPlayer = 'white';
        document.getElementById("currentplayer").innerHTML = "White to Go";
    }
    else {
        board[col][row] = SquareState.WHITE;
        currentPlayer = 'black';
        document.getElementById("currentplayer").innerHTML = "Black to Go";
    }

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