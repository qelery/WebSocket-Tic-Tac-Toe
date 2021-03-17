/*
const gridDiv = document.querySelector('.grid');
const message = document.querySelector('.status__message');
const player1Score = document.querySelector('#player1 .player__score');
const player2Score = document.querySelector('#player2 .player__score');
const tieCount = document.querySelector('#tie .player__score');

let gameOver = false;
let activeMarker = 'X';
message.innerText = `Waiting on Player ${activeMarker}...`;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const squares = [...gridDiv.children];

squares.forEach((square, ind) => {
    square.addEventListener('click', async () => {
        if (!square.innerText && !gameOver) {
            markSquare(square, ind);
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
    message.innerText = `Waiting on Player ${activeMarker}...`;
    gameOver = false;
}

function markSquare(square) {
    square.innerText = activeMarker;
    square.classList.remove('red-marker', 'blue-marker');
    square.classList.add(activeMarker === 'X' ? 'red-marker' : 'blue-marker');
}

function clearSquares() {
    squares.forEach(square => {
        square.classList.remove('red-marker', 'blue-marker', 'blink');
        square.innerText = '';
    })
}

function updateActiveMarker() {
    activeMarker = activeMarker === 'X' ? 'O' : 'X';
    message.innerText = `Waiting on Player ${activeMarker}...`;
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

    for (let combo of winningCombinations) {

        let markers = combo.map(position => squares[position].innerText)
        if (markers.every(marker => marker && marker === markers[0])) {
            gameOver = true;
            handleGameOver(markers[0]);
            await blink(combo);
            return;
        }
    }

    // check tie
    if (squares.every(square => square.innerText)) {
        gameOver = true;
        handleGameOver(null);
        await blink([...Array(9).keys()]);
    }

}

async function blink(positionsToBlink) {
    positionsToBlink.forEach(position => squares[position].classList.add('blink'));
    await sleep(5000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}*/
