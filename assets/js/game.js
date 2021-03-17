const gridDiv = document.querySelector('.grid');
const message = document.querySelector('.status__message');
const player1Name = document.querySelector('#player1 .player__name');
const player1Score = document.querySelector('#player1 .player__score');
const player2Name = document.querySelector('#player2 .player__name');
const player2Score = document.querySelector('#player2 .player__score');
const tieCount = document.querySelector('#tie .player__score');

let gameOver = false;
let activeMarker = 'X';
message.innerText = `Waiting on player ${activeMarker}...`

const squares = [...gridDiv.children];

squares.forEach(square => {
    square.addEventListener('click', async () => {
        if (!square.innerText && !gameOver) {
            markSquare(square);
            updateActiveMarker();
            await checkForWin();
            if (gameOver) {
                resetGame();
                // let wantsRestart = promptForRestart();
                // if (wantsRestart) {
                //     resetGame();
                // }
            }
        }
    });
});

function resetGame() {
    clearSquares();
    activeMarker = 'X';
    message.innerText = `Waiting on player ${activeMarker}...`;
    gameOver = false;
}

function markSquare(square) {
    square.innerText = activeMarker;
    square.classList.remove('red-marker', 'blue-marker');
    square.classList.add(activeMarker === 'X' ? 'red-marker' : 'blue-marker');
}

function clearSquares() {
    squares.forEach(square => {
        square.classList.remove('red-marker', 'blue-marker');
        square.innerText = '';
    })
}

function updateActiveMarker() {
    activeMarker = activeMarker === 'X' ? 'O' : 'X';
    message.innerText = `Waiting on player ${activeMarker}...`
}

function handleGameOver(winningMarker) {
    if (winningMarker === 'X') {
        player1Score.innerText = +player1Score.innerText + 1;
        message.innerText = `Player ${winningMarker} won!`
    } else if (winningMarker === 'O') {
        player2Score.innerText = +player2Score.innerText + 1;
        message.innerText = `Player ${winningMarker} won!`
    }  else {
        tieCount.innerText = +tieCount.innerText + 1;
        message.innerText = `Draw...`;
    }
}

async function checkForWin() {

    // check horizontal
    for (let i = 0; i < 9; i += 3) {
        let row = squares.slice(i, i + 3);
        if (row.every(sq => sq.innerText && sq.innerText === row[0].innerText)) {
            gameOver = true;
            handleGameOver(row[0].innerText);
            await blink(row);
        }
    }

    // check vertical
    for (let i = 0; i < 3; i++) {
        let col = [];
        for (let j = 0; j < 3; j++) {
            col.push(squares[i + (j * 3)])
        }
        if (col.every(sq => sq.innerText && sq.innerText === col[0].innerText)) {
            gameOver = true;
            handleGameOver(col[0].innerText);
            await blink(col);
        }
    }

    // check diagonal
    let leftDiagonal = [squares[0], squares[4], squares[8]];
    if (leftDiagonal.every(sq => sq.innerText && sq.innerText === leftDiagonal[0].innerText)) {
        gameOver = true;
        handleGameOver(leftDiagonal[0].innerText);
        await blink(leftDiagonal);
    }

    let rightDiagonal = [squares[2], squares[4], squares[6]];
    if (rightDiagonal.every(sq => sq.innerText && sq.innerText === rightDiagonal[2].innerText)) {
        gameOver = true;
        handleGameOver(rightDiagonal[0].innerText);
        await blink(rightDiagonal);
    }

    // check tie
    if (squares.every(e => e.innerText)) {
        gameOver = true;
        handleGameOver(null);
        await blink(squares);
    }

}

async function blink(squaresToBlink) {
    squaresToBlink.forEach(sq => sq.classList.add('blink'));
    await sleep(5000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}