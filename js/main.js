'use strict'

console.log('daniel')
// const CELL = '<img src = "img/square.jpg">'

var gBoard;
var gTimeElapsed
const EMPTY_CELL = "$";
const FLAG = '🚩';
const MINE = '💣';



var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    time: 0,

    // score: 0,
    // time: 0,
};



var gLevel = {
    size: 4,
    mines: 12,

};

function initGame() {
    gGame.isOn = true;
    gBoard = createBoard(gLevel);
    setMinesNegsCount(gBoard)
    renderBoard(gBoard);

}



function setLevel(level) {
    gLevel = level;
    initGame();
}



function createBoard(level) {
    var board = [];
    for (var i = 0; i < level.size; i++) {
        board[i] = [];
        for (var j = 0; j < level.size; j++) {
            var cell = {
                countMinesNext: 0,
                isShown: false,
                isMine: false,
                isMark: false,
            };
            board[i][j] = cell;
        }

    }
    var mines = level.mines;
    while (mines !== 0) {
        var i = getRandom(0, level.size - 1);
        var j = getRandom(0, level.size - 1);
        if (!board[i][j].isMine) {
            board[i][j].isMine = true;
            mines--;

        }
    }
    return board;
}




function renderBoard(board) {

    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>";
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];
            var cellClassName = 'square' + i + j;

            if (currCell.isShown) {
                cellClassName = cellClassName + ' shown';
            }
            strHTML += '<td class ="' + cellClassName + ' square" onclick="cellOnClick( ' + i + ' , ' + j + ' , this)" >'

            if (currCell.isShown && currCell.isMine) {
                strHTML += MINE;

            }
            if (currCell.isShown && currCell.countMinesNext !== 0) {
                strHTML += currCell.countMinesNext;

            }
            if (currCell.isFlag) {
                strHTML += FLAG;
            }

            strHTML += '</td>';
        }
        strHTML += '</tr>';

    }
    strHTML += '</tbody></table>';
    var elTable = document.querySelector('.container');
    console.log(strHTML);
    elTable.innerHTML = strHTML;

    console.log(elTable)

}





function countNextCell(rowIdx, collJdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= gBoard.length) continue;

        for (var j = collJdx - 1; j <= collJdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === rowIdx && j === collJdx) continue;
            if (gBoard[i][j].isMine) count++;
        }
    }
    return count;
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];
            currCell.countMinesNext = countNextCell(i, j)

        }
    }
}



function getRandom(min, max) {

    return Math.floor(Math.random() * (max - min + 1) + min);

}



function cellOnClick(i, j, cell) {
    var currCell = gBoard[i][j];
    currCell.isShown = true;
    if (currCell.isMine) {
        cell.innerHTML = MINE;
    }
    if (currCell.isMark) {
        cell.innerHTML = FLAG;
    }

    if (gGame.isOn = false) {
        return
    }

}




// function checkGameOver() {



// }


// function expandShown(board, cell, i, j) {



// }



function TimeElapsed(time) {
    var elTimer = document.querySelector('.timer');
    gTimeElapsed = new Date(time).toISOString().slice(15, -1);
    elTimer.innerText = 'Time: ' + gTimeElapsed;
    gGame.time = gTimeElapsed;

}


function stopTimer() {


}
