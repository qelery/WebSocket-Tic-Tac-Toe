class RecordKeeper {

    /**
     * The RecordKeeper is a helper class for the Grid.
     *
     * Records the number of times a particular marker appears in each
     * row/col/diagonal. Allows for fast win checking. Both players
     * should each have their own instance of RecordKeeper.
     */

    rowCounts: number[];
    colCounts: number[];
    diagCount: number;
    antiDiagCount: number;
    lastX: number | null;
    lastY: number | null;

    constructor() {
        this.rowCounts = [0 , 0, 0];
        this.colCounts = [0, 0, 0];
        this.diagCount = 0;
        this.antiDiagCount = 0;
        this.lastX = null; // refers to last x-coordinate on grid, not the X-marker
        this.lastY = null;
    }

    update(xPosition: number, yPosition: number): void {
        this.rowCounts[yPosition]++;
        this.colCounts[xPosition]++;
        if (xPosition === yPosition) this.diagCount++;
        if (+xPosition + +yPosition + 1 === 3) this.antiDiagCount++;

        [this.lastX, this.lastY] = [xPosition, yPosition];
    }

    getWinningPositions():  number[][] | null {

        if (this.lastX === null) return null;
        if (this.lastY === null) return null;

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

export default RecordKeeper;