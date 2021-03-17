/*

    Contains the Grid class and the RecordKeeper class.

 */



class Grid {
    constructor() {
        this.recordKeeperX = new RecordKeeper();
        this.recordKeeperO = new RecordKeeper();
        this.activeMarker = 'X';
        this.totalPlacements = 0;
    }

    switchMarker() {
        console.log('In grid.switchMarker');
        this.activeMarker = this.activeMarker === 'X' ? 'O' : 'X';
    }

    placeMarker(square) {
        console.log('In grid.placeMarker');
        if (square.dataset.clicked === 'true') {
            return false;
        }

        this.totalPlacements++;

        const x = square.dataset.x;
        const y = square.dataset.y;
        this.updateRecords(x, y);
        return true;
    }

    updateRecords(x, y) {
        console.log('In grid.updateRecords');
        if (this.activeMarker === 'X') {
            this.recordKeeperX.update(x, y);
        } else {
            this.recordKeeperO.update(x, y);
        }
    }

    checkRoundDone() {
        console.log('In grid.checkRoundDone');
        let winningPositions = this.activeMarker === 'X'
            ? this.recordKeeperX.checkForWin()
            : this.recordKeeperO.checkForWin();

        if (winningPositions.length > 0) {
            console.log('Found winner........')
            return [true, winningPositions];
        }

        if (this.totalPlacements === 9) {
            console.log('Found tie......')
            return [true, []];
        }

        console.log(`Didn't find anything....`)
        return [false, []];
    }


    reset() {
        this.recordKeeperX = new RecordKeeper();
        this.recordKeeperO = new RecordKeeper();
        this.totalPlacements = 0;
    }
}




class RecordKeeper {

    constructor() {
        this.rowCounts = [0 , 0, 0];
        this.colCounts = [0, 0, 0];
        this.diagCount = 0;
        this.antiDiagCount = 0;
        this.winSize = 3;
        this.lastX = null; // refers to last X coordinate, not the X-marker
        this.lastY = null;
    }

    update(xPosition, yPosition) {
        this.rowCounts[yPosition]++;
        this.colCounts[xPosition]++;
        if (xPosition === yPosition) {
            this.diagCount++;
        }
        else if (xPosition + yPosition + 1 === 3) {
            this.antiDiagCount++;
        }

        [this.lastX, this.lastY] = [xPosition, yPosition];
    }

    checkForWin() {

        // vertical win
        if (this.colCounts[this.lastX] === this.winSize) {
            return [
                [this.lastX, 0],
                [this.lastX, 1],
                [this.lastX, 2],
            ];
        }

        // horizontal win
        if (this.rowCounts[this.lastY] === this.winSize) {
            return [
                [0, this.lastY],
                [1, this.lastY],
                [2, this.lastY],
            ];
        }

        // diagonal win
        if (this.diagCount === this.winSize) {
            return [
                [0, 0],
                [1, 1],
                [2, 2],
            ];
        }

        // anti-diagonal win
        if (this.antiDiagCount === this.winSize) {
            return [
                [2, 0],
                [1, 1],
                [0, 2],
            ];
        }

        return [];
    }
}


