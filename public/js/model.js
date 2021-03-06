
class Grid {
    /**
     * The Grid manages marker placements per the GameController's instructions.
     */
    constructor() {
        this.xRecords = new RecordKeeper();
        this.oRecords = new RecordKeeper();
        this.activeMarker = 'X';
        this.totalPlacements = 0;
        this.winningPositions = null;
    }

    switchMarker() {
        this.activeMarker = this.activeMarker === 'X' ? 'O' : 'X';
    }

    placeMarker(square) {

        this.totalPlacements++;

        const x = square.dataset.x;
        const y = square.dataset.y;
        this._updateRecords(x, y);
        return true;
    }

    checkRoundDone() {
        this.winningPositions = this.activeMarker === 'X'
                                    ? this.xRecords.getWinningPositions()
                                        : this.oRecords.getWinningPositions();

        if (this.winningPositions) return true;
        if (this.totalPlacements === 9) return true;
        return false;
    }


    reset() {
        this.xRecords = new RecordKeeper();
        this.oRecords = new RecordKeeper();
        this.totalPlacements = 0;
    }

    _updateRecords(x, y) {
        if (this.activeMarker === 'X') {
            this.xRecords.update(x, y);
        } else {
            this.oRecords.update(x, y);
        }
    }
}




class RecordKeeper {

    /**
     * The RecordKeeper is a helper class for the Grid.
     *
     * Records the number of times a particular marker appears in each
     * row/col/diagonal. Allows for fast win checking. Both players
     * should each have their own instance of RecordKeeper.
     */
    constructor() {
        this.rowCounts = [0 , 0, 0];
        this.colCounts = [0, 0, 0];
        this.diagCount = 0;
        this.antiDiagCount = 0;
        this.lastX = null; // refers to last x-coordinate on grid, not the X-marker
        this.lastY = null;
    }

    update(xPosition, yPosition) {
        this.rowCounts[yPosition]++;
        this.colCounts[xPosition]++;
        if (xPosition === yPosition) this.diagCount++;
        if (+xPosition + +yPosition + 1 === 3) this.antiDiagCount++;

        [this.lastX, this.lastY] = [xPosition, yPosition];
    }

    getWinningPositions() {

        if (this.colCounts[this.lastX] === 3) {
            return [[this.lastX, 0], [this.lastX, 1], [this.lastX, 2]];
        }

        if (this.rowCounts[this.lastY] === 3) {
            return [[0, this.lastY], [1, this.lastY], [2, this.lastY]];
        }

        if (this.diagCount === 3) {
            return [[0, 0], [1, 1], [2, 2]];
        }

        if (this.antiDiagCount === 3) {
            return [[2, 0], [1, 1], [0, 2]];
        }

        return null;
    }
}


