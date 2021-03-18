
class Controller {
    constructor() {
        console.log('\n\n\nConstructing Controller...')
        this.ui = new UserInterface();
        this.grid = new Grid();
        this.gameOver = false;
        this.isTwoPlayer = false;
        this.addButtonListeners();
    }

    mainLoop = async (event) => {
        console.log('\n\n\nIn controller.mainLoop')
        if (this.gameOver) return;

        let madePlacement = this.grid.placeMarker(event.target);

        if (madePlacement) {
            this.ui.markSquareDiv(event.target, this.grid.activeMarker);

            let roundDone = this.grid.checkRoundDone();

            if (roundDone) {
                await this.ui.handleRoundDone(this.grid.activeMarker, this.grid.winningPositions);
                this.grid.reset();
                this.ui.reset();
            }

            this.grid.switchMarker();
            this.ui.handleSwitchMarker(this.grid.activeMarker);
        }
    }

    setUpGame = (event) => {
        console.log('In controller.setUpGame')
        this.isTwoPlayer = event.target === document.querySelector('#right-button');
        this.ui.reset();
    }

    addButtonListeners() {
        console.log('In controller.addButtonListeners')
        document.querySelector('#left-button').addEventListener('click', this.setUpGame);
        document.querySelector('#right-button').addEventListener('click', this.setUpGame);

        const squareButtons = Array.from(document.querySelector('.grid').children);
        squareButtons.forEach(sqrBtn => sqrBtn.addEventListener('click', this.mainLoop));
    }
}


const controller = new Controller();
