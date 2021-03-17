class RecordKeeper {

    constructor() {
        this.rowCounts = [0 , 0, 0];
        this.colCounts = [0, 0, 0];
        this.diagonal = 0;
        this.antiDiagonal = 0;
        this.winSize = 3;
        this.lastX = null; // refers to last X coordinate
        this.lastY = null;
    }

    update(xPosition, yPosition) {
        this.rowCounts[yPosition]++;
        this.colCounts[xPosition]++;
        if (xPosition === yPosition) this.diagonal++;
        else if (xPosition + yPosition + 1 === 3) this.antiDiagonal++;

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
        if (this.diagonal === this.winSize) {
            return [
                [0, 0],
                [1, 1],
                [2, 2],
            ];
        }

        // anti-diagonal win
        if (this.diagonal === this.winSize) {
            return [
                [2, 0],
                [1, 1],
                [0, 2],
            ];
        }

        return [];
    }
}