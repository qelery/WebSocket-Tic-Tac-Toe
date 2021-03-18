/*

    Contains the Controller class and creates and instance of it.



    > Controller class - the main logic of the application; the link between the model and view

 */



class Controller {
    constructor() {
        this.ui = new UserInterface();
        this.grid = new Grid();
        this.gameOver = false;
        this.isTwoPlayer = false;
        this.addButtonListeners();
    }

    mainLoop = async (event) => {
        if (this.gameOver) return;

        this.grid.placeMarker(event.target);
        this.ui.handleMarkedSquare(event.target, this.grid.activeMarker);

        let roundDone = this.grid.checkRoundDone();

        if (roundDone) {
            await this.ui.handleRoundDone(this.grid.activeMarker, this.grid.winningPositions);
            this.grid.reset();
            this.ui.reset();
        }

        this.grid.switchMarker();
        this.ui.handleSwitchMarker(this.grid.activeMarker);
    }

    setUpGame = (event) => {
        this.isTwoPlayer = event.target === document.querySelector('#right-button');
        this.ui.reset();
    }

    addButtonListeners() {
        document.querySelector('#left-button').addEventListener('click', this.setUpGame);
        document.querySelector('#right-button').addEventListener('click', this.setUpGame);

        const squareButtons = Array.from(document.querySelector('.grid').childNodes);
        squareButtons.forEach(sqrBtn => sqrBtn.addEventListener('click', this.mainLoop));
    }
}


const controller = new Controller();
