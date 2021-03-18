/*

    Contains the UserInterface class plus Helper Functions.



    > UserInterface class - manipulates the DOM per instructions from the controller

    > Help functions - for various animations

 */


class UserInterface {
    constructor() {
        this.gridDiv = null;
        this.squareDivs = null;
        this.statsDiv = null;
        this.xScore = null;
        this.oScore = null;
        this.tieScore = null;
        this.message = null;
        this.buttonsDiv = null;
        this.init();
    }

    handleMarkedSquare(square, marker) {
        square.firstChild.innerText = marker;
        square.classList.add('disabled');
        square.classList.add(marker === 'X' ? 'red-marker' : 'blue-marker');
    }

    handleSwitchMarker(marker) {
        this._alertMessage(`Waiting on Player ${marker}...`)
    }

    async handleRoundDone(winningMarker, winningPositions) {
        this._disableAllClicks();
        if (winningPositions) {
            this._alertMessage(`Player ${winningMarker} won!`);
            this._updateScore(winningMarker);
            await blinkAnimation(winningPositions);
        } else {
            this._alertMessage(`Tie!`)
            this._updateScore('tie');
            this.gridDiv.classList.add('opaque');
            await fallAnimation(this.squareDivs);
        }
    }

    reset() {
        this._clearSquares();
        this._unhideMessage();
        this._hideButtons();
        this._removeOpaqueStyles();
    }

    _alertMessage(message) {
        this.message.innerText = message;
    }

    _updateScore(marker) {
        if (marker === 'X') {
            this.xScore.innerText++;
        } else if (marker === 'O') {
            this.oScore.innerText++;
        } else {
            this.tieScore.innerText++;
        }
    }

    _clearSquares() {
        this.squareDivs.forEach(square => {
            square.classList.remove('red-marker', 'blue-marker', 'disabled');
            square.firstChild.remove();
            square.append(document.createElement('span'));
        })
    }

    _disableAllClicks() {
        this.squareDivs.forEach(square => square.classList.add('disabled'));
    }

    _hideButtons() {
        this.buttonsDiv.classList.add('hidden');
    }

    _unhideMessage() {
        this.message.classList.remove('hidden');
    }

    _removeOpaqueStyles() {
        this.statsDiv.classList.remove('opaque');
        this.gridDiv.classList.remove('opaque');
    }

    init() {
        this.gridDiv = document.querySelector('.grid');
        this.squareDivs = Array.from(this.gridDiv.children);
        this.statsDiv = document.querySelector('.stats');
        this.xScore = document.querySelector('#playerX .player__score');
        this.oScore = document.querySelector('#playerO .player__score');
        this.tieScore = document.querySelector('#tie .player__score');
        this.message = document.querySelector('.feedback_message');
        this.buttonsDiv = document.querySelector('.feedback_buttons-box');
    }
}

async function blinkAnimation(positions) {
    let squaresToBlink;
    if (positions) {
        squaresToBlink = positions.map(p => document.querySelector(`[data-x="${p[0]}"][data-y="${p[1]}"]`))
    } else {
        squaresToBlink = this.squareDivs;
    }
    squaresToBlink.forEach(square => square.firstChild.classList.add('blink'));
    await sleep(4500);
}

async function fallAnimation(squaresToDrop) {
    let numOfAnimations = 5;
    squaresToDrop.forEach(square => {
        let n = randomInt(1, numOfAnimations);
        square.firstChild.classList.add(`shake-${n}`);
    });
    await sleep(1000);
    squaresToDrop.forEach(square => {
        let n = randomInt(1, numOfAnimations);
        square.firstChild.classList.add(`drop-${n}`);
    });
    await sleep(2000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(start, end) {
    return Math.floor(Math.random() * end) + start;
}