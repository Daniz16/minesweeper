'use strict'

console.log('Bdikaaaa')

var gBoard;
var gTimeElapsed;
var gTimerInterval;
var isFirstClick;

const FLAG = '🚩';
const MINE = '💣';
const LOSE = '🤯'
const WIN = '😎'



var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    bestTime: 0,
    life: 3,
    safeClick: 3,
};



var gLevel = {
    size: 4,
    mines: 2,

};

function initGame() {
    gGame.isOn = true;
    gGame.safeClick = 3;
    gGame.life = 3;
    gGame.shownCount = 0;
    gGame.markedCount = 0;

    gTimeElapsed = '00:00:00'
    gGame.bestTime = 0;

    if (window.localStorage.getItem('bestTime' + gLevel.size)) {

        var best = parseInt(window.localStorage.getItem('bestTime' + gLevel.size));

        var elBestTime = document.querySelector('.bestTime');
        elBestTime.innerHTML = 'Best Time : ' + new Date(best).toISOString().slice(14, -2);

    } else {
        var elBestTime = document.querySelector('.bestTime');
        elBestTime.innerHTML = 'Best Time : ' + new Date(0).toISOString().slice(14, -2);
    }

    clearInterval(gTimerInterval);


    var elTimer = document.querySelector('.timer');
    elTimer.innerText = 'Timer : ' + gTimeElapsed;

    isFirstClick = true;

    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerHTML = '😃';


    var elGameOver = document.querySelector('.gameover');
    elGameOver.style.display = 'none';

    var elHeart = document.querySelector('.hearts');
    elHeart.innerHTML = '❤️   ❤️   ❤️';

    var elSafe = document.querySelector('.safebtn');
    elSafe.innerHTML = '💊  💊  💊';



    gBoard = createBoard(gLevel);
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

    return board;
}



function createMines(startI, startJ) {
    var mines = gLevel.mines;
    while (mines !== 0) {
        var i = getRandom(0, gLevel.size - 1);
        var j = getRandom(0, gLevel.size - 1);
        if (!gBoard[i][j].isMine && (startI !== i && startJ !== j)) {
            gBoard[i][j].isMine = true;
            mines--;

        }
    }

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
            strHTML += '<td class ="' + cellClassName + ' square" onclick="cellOnClick( ' + i + ' , ' + j + ' , this)" oncontextmenu = "onCellRightClick(' + i + ' , ' + j + ' , this)"  >'

            if (currCell.isMark) {
                strHTML += FLAG;
            }
            else if (currCell.isShown && currCell.isMine) {
                strHTML += MINE;

            }
            else if (currCell.isShown && currCell.countMinesNext !== 0) {
                strHTML += currCell.countMinesNext;

            }
           

            strHTML += '</td>';
        }
        strHTML += '</tr>';

    }
    strHTML += '</tbody></table>';
    var elTable = document.querySelector('.container');
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
    if (gGame.isOn === false && currCell.isShown && currCell.isMark) {
        return
    }



    if (isFirstClick) {
        isFirstClick = false;
        startTimer();
        createMines(i, j);
        setMinesNegsCount(gBoard);

    }


    currCell.isShown = true;
    if (currCell.isMine) {
        gGame.life--;
        var elHeart = document.querySelector('.hearts');
        elHeart.innerHTML = '';


        for (var i = 0; i < gGame.life; i++) {
            elHeart.innerHTML += '❤️';

        }

        if (gGame.life !== 0) {
            renderBoard(gBoard);
            setTimeout(function () {
                currCell.isShown = false;
                renderBoard(gBoard);

            }, 1000);


        } else {
            GameOverLose();
            return;
        }




    } else if (currCell.countMinesNext !== 0) {
        gGame.shownCount++;
    } else if (currCell.countMinesNext === 0) {
        gGame.shownCount++;
        expandShown(gBoard, i, j);
    }
    GameOverVictory();
    renderBoard(gBoard)


}


function onCellRightClick(i, j, cell) {

    if (gGame.isOn === false) {
        return;
    }
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();

    }, false);

    if (isFirstClick) {
        isFirstClick = false;
        startTimer();
        createMines(-1, -1);
        setMinesNegsCount(gBoard);

    }

    var currCell = gBoard[i][j];

    if (!currCell.isMark && !currCell.isShown) {
        currCell.isMark = true;
        gGame.markedCount++

    } else {
        currCell.isMark = false;
        gGame.markedCount--;
    }
    renderBoard(gBoard)
    GameOverVictory();
}





function safeClick() {
    if (gGame.safeClick < 1 || !gGame.isOn) return;
    
    var hiddenCells = [];
    
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var cell = gBoard[i][j];
            if (!cell.isShown && !cell.isMine && !cell.isMarked) {
                hiddenCells.push({ i: i, j: j });
            }
        }
    }

    if ( hiddenCells.length === 0 ) return;

    gGame.safeClick--;
    
    var idx = getRandom(0, hiddenCells.length - 1);

    var elSafe = document.querySelector('.safebtn');
    elSafe.innerHTML = '';
    
    for (var i = 0; i < gGame.safeClick; i++) {
        elSafe.innerHTML += '💊';
        
    }


    var cell = hiddenCells[idx];
    var elCell = document.querySelector('.square' + cell.i + '' + cell.j);

    elCell.style.backgroundColor = 'red';


    setTimeout(function () {

        elCell.style.backgroundColor = 'wheat';

    }, 1000);


}









function expandShown(board, rowIdx, collJdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = collJdx - 1; j <= collJdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === rowIdx && j === collJdx) continue;

            if (board[i][j].isMark) continue;
            if (board[i][j].countMinesNext !== 0 && !board[i][j].isShown) {
                board[i][j].isShown = true;
                gGame.shownCount++;

            }
            if (board[i][j].countMinesNext === 0 && !board[i][j].isShown) {
                board[i][j].isShown = true
                gGame.shownCount++;

                expandShown(board, i, j);
            }
        }
    }
    renderBoard(gBoard);

}










function GameOverLose() {
    gGame.isOn = false;
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerHTML = LOSE;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
            }

        }

    }
    renderBoard(gBoard);
    var elGameLose = document.querySelector('.gameover');
    elGameLose.innerHTML = 'YOU LOST!';
    elGameLose.style.display = 'block';

    

    clearInterval(gTimerInterval);


}




function GameOverVictory() {
    if (gGame.shownCount >= ((gLevel.size * gLevel.size) - gLevel.mines) && gGame.markedCount === gLevel.mines) {
        gGame.isOn = false;
        var elSmiley = document.querySelector('.smiley');
        elSmiley.innerHTML = WIN;



        renderBoard(gBoard);
        var elGameWin = document.querySelector('.gameover');
        elGameWin.innerHTML = 'YOU WON!';
        elGameWin.style.display = 'block';




        clearInterval(gTimerInterval);

        if ((!window.localStorage.getItem('bestTime' + gLevel.size)) || (parseInt(window.localStorage.getItem('bestTime' + gLevel.size)) > gGame.bestTime)) {

            window.localStorage.setItem('bestTime' + gLevel.size, gGame.bestTime);
        }


        var best = parseInt(window.localStorage.getItem('bestTime' + gLevel.size));

        var elBestTime = document.querySelector('.bestTime');
        elBestTime.innerHTML = 'Best Time : ' + new Date(best).toISOString().slice(14, -2);






    }


}


function timer(time) {
    var elTimer = document.querySelector('.timer');

    gGame.bestTime = time;


    gTimeElapsed = new Date(gGame.bestTime).toISOString().slice(14, -2);
    elTimer.innerText = 'Time ' + gTimeElapsed;

}




function startTimer() {
    var milSecElapsed = 0;
    gTimerInterval = setInterval(function () {
        milSecElapsed += 50;
        timer(milSecElapsed);
    }, 50);

}


