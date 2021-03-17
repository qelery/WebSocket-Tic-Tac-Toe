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

    async handleWin(positions, marker) {
        this._alertWinner(marker)
        await this._blinkPositions(positions);
    }

    reset() {
        this._clearSquares();
        this._hideButtons();
        this._removeOpaqueStyles();
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
        this.feedbackDiv = document.querySelector('.feedback');
        this.message = document.querySelector('.feedback_message');
        this.leftButton = document.querySelector('#left-button');
        this.rightButton = document.querySelector('#right-button');
    }

    _alertWinner(marker) {
        this.message.innerText = `Player ${marker} won!`;
    }

    async _blinkPositions(positions) {
        const squares = positions.map(p => document.querySelector(`[data-x="${p[0]}"][data-y="${p[1]}"]`))
        await blink(squares);
    }
}

async function blink(squaresToBlink) {
    squaresToBlink.forEach(square => square.classList.add('blink'));
    await sleep(5000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}