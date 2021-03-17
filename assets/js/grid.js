class Grid {
    constructor(squares) {
        this.squares = this._addListeners(squares);
        this.recordKeeperX = new RecordKeeper();
        this.recordKeeperY = new RecordKeeper();
        this.activeMarker = 'X';
        this.totalPlacements = 0;
        this.gameOver = false;
    }


    switchActiveMarker() {
        this.activeMarker = this.activeMarker === 'X' ? 'O' : 'X';
    }

    updateDOM(square) {
        square.innerText = this.activeMarker;
        square.classList.add(this.activeMarker === 'X' ? 'red-marker' : 'blue-marker');
    }

    async placeMarker(square) {
        if (square.getAttribute('data-clicked')) return;

        this.totalPlacements++;

        const x = square.getAttribute('data-x');
        const y = square.getAttribute('data-y');
        this.updateRecords(x, y);
        this.updateDOM(square);
        this.switchActiveMarker();
        await this.checkForWin();
    }

    updateRecords(x, y) {
        if (this.activeMarker === 'X') {
            this.recordKeeperX.update(x, y);
        } else {
            this.recordKeeperY.update(x, y);
        }
    }

    async checkForWin() {
        let winningPositions = this.activeMarker === 'X'
            ? this.recordKeeperX.checkForWin()
            : this.recordKeeperY.checkForWin();

        if (winningPositions) {
            this.gameOver = true;
            await blink(winningPositions);
        } else if (this.totalPlacements === 9) {
            this.gameOver = true;
            await blink(this.squares)
        }
    }


    reset() {
        this.clearSquares();
        this.gameOver = false;
    }

    clearSquares() {
        this.squares.forEach(square => {
            square.classList.remove('red-marker', 'blue-marker', 'blink');
            square.innerText = '';
        })
    }

    _addListeners(squares) {
        squares.forEach(square => {
            square.addEventListener('click', () => this.placeMarker(square));
        });
        return squares;
    }
}

async function blink(positionsToBlink) {
    positionsToBlink.forEach(position => {
        const x = position[0];
        const y = position[1];
        const square = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        square.classList.add('blink');
    });
    await sleep(5000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}