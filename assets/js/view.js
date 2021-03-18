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
        this.feedbackDiv = null;
        this.message = null;
        this.leftButton = null;
        this.rightButton = null;
        this.init();
    }

    markSquareDiv(square, marker) {
        square.innerText = marker;
        square.setAttribute('data-clicked', 'true');
        square.classList.add(marker === 'X' ? 'red-marker' : 'blue-marker');
    }

    reset() {
        this._clearSquares();
        this._unhideMessage();
        this._hideButtons();
        this._removeOpaqueStyles();
    }

    async handleRoundOver(winningMarker, winningPositions) {
        if (winningPositions) {
            this._alertMessage(`Player ${winningMarker} won!`);
            this._updateScore(winningMarker);
            await this._blinkPositions(winningPositions);
        } else {
            this._alertMessage(`Tie!`)
            this._updateScore('tie');
            await this._blinkPositions();
        }
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
            square.classList.remove('red-marker', 'blue-marker', 'blink');
            square.setAttribute('data-clicked', 'false');
            square.innerText = '';
        })
    }

    _hideButtons() {
        this.leftButton.classList.add('hidden');
        this.rightButton.classList.add('hidden');
    }

    _unhideMessage() {
        this.message.classList.remove('hidden');
    }

    _removeOpaqueStyles() {
        this.statsDiv.classList.remove('opaque');
        this.gridDiv.classList.remove('opaque');
    }

    async _blinkPositions(positions) {
        let squares;
        if (positions) {
            squares = positions.map(p => document.querySelector(`[data-x="${p[0]}"][data-y="${p[1]}"]`))
        } else {
            squares = this.squareDivs;
        }

        await blink(squares);
    }

    init() {
        this.gridDiv = document.querySelector('.grid');
        this.squareDivs = Array.from(this.gridDiv.children);
        this.statsDiv = document.querySelector('.stats');
        this.xScore = document.querySelector('#playerX .player__score');
        this.oScore = document.querySelector('#playerO .player__score');
        this.tieScore = document.querySelector('#tie .player__score');
        this.feedbackDiv = document.querySelector('.feedback');
        this.message = document.querySelector('.feedback_message');
        this.leftButton = document.querySelector('#left-button');
        this.rightButton = document.querySelector('#right-button');
    }
}

async function blink(squaresToBlink) {
    squaresToBlink.forEach(square => square.classList.add('blink'));
    await sleep(4500);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}