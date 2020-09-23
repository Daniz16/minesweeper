'use strict'

console.log('daniel')

var gBoard;
const CELL = '<img src = "img/square.jpg">'

var gGame = {
    score: 0,
    time: 0,
    isOn: false,
};


function init(difficulty) {
    gBoard = createBoard(difficulty);
    gGame.isOn = true;
    renderBoard(gBoard);


    var elTable = document.querySelector('.container');
    elTable.style.display = 'block';
    // console.log(elTable)
}



function createBoard(difficulty) {
    var board = [];
    for (var i = 0; i < difficulty; i++) {
        board[i] = [];
        for (var j = 0; j < difficulty; j++) {
            board[i][j] = CELL;
        }
    }
    return board;
}



function renderBoard(board) {

    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>";
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            var className = 'cell' + i + j;
            strHTML += '<td class = "' + className + '"> ' + cell + '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elTable = document.querySelector('.container')
    elTable.innerHTML = strHTML;

}

