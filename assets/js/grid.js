class Grid {
    constructor(squares) {
        this.squares = squares;
        this.activeMarker = 'X';
        this.isGameOver = false;
        this.addListener(this.squares);
    }

    placeMarker(square) {
        if (!square.innerText) {
            square.innerText = this.activeMarker;
            square.classList.remove('red-marker', 'blue-marker');
            square.classList.add(this.activeMarker === 'X' ? 'red-marker' : 'blue-marker');
            this.updateActiveMarker();
        }
    }

    checkForWin() {
        const placements = this.squares.map(square => square.innerText);

        // check horizontal
        for (let i = 0; i < 9; i += 3) {
            let row = placements.slice(i, i+3);
            if (row.every(e => e && e === row[0])) {
                return [true, row[0]];
            }
        }

        // check vertical
        for (let i = 0; i < 3; i++) {
            let col = [];
            for (let j = 0; j < 3; j++) {
                col.push(placements[i + (j * 3)])
            }
            if (col.every(e => e && e === col[0])) {
                return [true, col[0]];
            }
        }

        // check diagonal
        let leftDiagonal = [placements[0], placements[4], placements[8]];
        if (leftDiagonal.every(e => e && e === leftDiagonal[0])) {
            return [true, leftDiagonal[0]]
        }

        let rightDiagonal = [placements[2], placements[4], placements[6]];
        if (rightDiagonal.every(e => e && e === rightDiagonal[0])) {
            return [true, rightDiagonal[0]]
        }

        return [false]
    }

    updateActiveMarker() {
        this.activeMarker = this.activeMarker === 'X' ? 'O' : 'X';
    }

    reset() {
        this.squares.forEach(square => {
            square.classList.remove('red-marker', 'blue-marker');
            square.innerText = '';
        })
        this.isGameOver = false;
    }

    addListener(squares) {
        squares.forEach(square => {
            square.addEventListener('click', () => this.placeMarker(square));
        });
    }
}

const gridDiv = document.querySelector('.grid');
const squares = [...gridDiv.children];
const grid = new Grid(squares);
grid.checkForWin();
console.log(grid.checkForWin());
