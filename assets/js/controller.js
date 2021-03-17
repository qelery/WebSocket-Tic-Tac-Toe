
class Controller {
    constructor() {
        this.ui = new UserInterface();
        this.grid = new Grid();
        this.gameOver = false;
        this.isTwoPlayer = false;
        this.setUpButtons();
    }

    setUpButtons() {
        document.querySelector('#left-button').addEventListener('click', this._setUpGame);
        document.querySelector('#right-button').addEventListener('click', this._setUpGame);

        const squareButtons = Array.from(document.querySelector('.grid').children);
        squareButtons.forEach(sqrBtn => sqrBtn.addEventListener('click', this._mainLoop));
    }

    _setUpGame = (event) => {
        console.log("In _setUpGame...");
        this.isTwoPlayer = event.target === document.querySelector('#right-button');

        this.ui.reset();
    }

    _mainLoop = async (event) => {
        console.log("\nIn _mainLoop...")

        if (this.gameOver) return;

        let wasPlaced = this.grid.placeMarker(event.target);

        if (wasPlaced) {
            let marker = this.grid.activeMarker;
            this.ui.markSquareDiv(event.target, marker);
            this.grid.switchMarker();

            let [roundDone, winningPositions] = this.grid.checkRoundDone();

            if (roundDone) {
                await this.ui.handleWin(winningPositions, marker);
                this.grid.reset();
                this.ui.reset();
            }
        }
    }
}


console.clear();

const controller = new Controller();


//
// singlePlayerButton.addEventListener('click', singlePlayerSetup);
// twoPlayerButton.addEventListener('click', twoPlayerSetup);


// function singlePlayerSetup() {
//     isTwoPlayer = false;
//
//     gridDiv.classList.remove('opaque');
//     statsDiv.classList.remove('opaque');
//
//     grid = new Grid([...squaresDivs]);
//     grid.reset();
// }
//
// function twoPlayerSetup() {
//     isTwoPlayer = true;
// }

