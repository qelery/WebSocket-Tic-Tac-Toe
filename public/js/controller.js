/*

    Contains the Controller class and creates and instance of it.



    > Controller class - the main logic of the application; the link between the model and view

 */

class GameController {
    constructor() {
        this.ui = new UserInterface();
        this.grid = new Grid();
        this.gameOver = false;
        this.myMarker = null;
        this.init();
    }

    singleBrowserMainLoop = async (event) => {
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

    twoBrowserMainLoop = async (event) => {
 
        if (this.gameOver || this.grid.activeMarker !== this.myMarker) {
            return;
        }

        const pressedSquare = event.target;
        this.grid.placeMarker(pressedSquare);
        const x = pressedSquare.dataset.x;
        const y = pressedSquare.dataset.y;
        const squareCoords = {x, y}
        socketController.emit('TransmitButtonPress', {squareCoords});
        this.ui.handleMarkedSquare(pressedSquare, this.grid.activeMarker);

        let roundDone = this.grid.checkRoundDone();

        if (roundDone) {
            await this.ui.handleRoundDone(this.grid.activeMarker, this.grid.winningPositions);
            this.grid.reset();
            this.ui.reset();
        }

        this.grid.switchMarker();
        this.ui.handleSwitchMarker(this.grid.activeMarker);
    }


    setUpOneBrowserGame = () => {
        this.myMarker = 'X';
        const squareButtons = Array.from(document.querySelector('.grid').childNodes);
        squareButtons.forEach(sqBtn => sqBtn.addEventListener('click', this.singleBrowserMainLoop));
        this.ui.reset();
        this.ui.handleSwitchMarker(this.grid.activeMarker);
    }

    setUpTwoBrowserGame = () => {
        const squareButtons = Array.from(document.querySelector('.grid').childNodes);
        squareButtons.forEach(sqBtn => sqBtn.addEventListener('click', this.twoBrowserMainLoop));
        this.ui.reset();
        this.ui.handleSwitchMarker(this.grid.activeMarker);
    }

    async placeOpponentsMarker(coords) {
        const pressedButton = document.querySelector(`[data-x="${coords.x}"][data-y="${coords.y}"]`);
        this.grid.placeMarker(pressedButton);
        this.ui.handleMarkedSquare(pressedButton, this.grid.activeMarker);

        let roundDone = this.grid.checkRoundDone();

        if (roundDone) {
            await this.ui.handleRoundDone(this.grid.activeMarker, this.grid.winningPositions);
            this.grid.reset();
            this.ui.reset();
        }

        this.grid.switchMarker();
        this.ui.handleSwitchMarker(this.grid.activeMarker);
    }

    connectPlayerTwo = () => {
        const regex = /(?<=invite\/).+/g;
        const inviteID = window.location.href.toLowerCase().match(regex)[0].replace("/", "");
        this.ui.reset();
        this.ui.handleSwitchMarker(this.grid.activeMarker);

        socketController.emit('MatchMeToHost', {inviteID});
    }

    setInviteLink(url) {
        this.ui.alertInviteLink(url);
    }

    opponentDisconnect() {
        this.ui.alertOpponentDisconnect();
    }

    init() {
        if (!socketController.isGameHost) {
            socketController.onopen = this.connectPlayerTwo;
        }
        document.querySelector('#one-browser-button').addEventListener('click', this.setUpOneBrowserGame);
        document.querySelector('#two-browser-button').addEventListener('click', () => {
            socketController.emit('GiveMeInviteLink');
        });
    }
}

class SocketController extends WebSocket {
    constructor() {
        super(url);
        this.onmessage = this.listen;
        this.isGameHost = !window.location.href.includes('invite');
    }

    emit(event, data) {
        this.send(JSON.stringify({event, data}))
    }

    listen(message) {
        const{event, reply} = JSON.parse(message.data);

        switch(event) {

            case 'TakeInviteLink':
                gameController.setInviteLink(reply.inviteUrl);
                break;

            case 'StartGame':
                gameController.myMarker = reply.marker;
                gameController.setUpTwoBrowserGame();
                break;

            case 'ButtonPressed':
                gameController.placeOpponentsMarker(reply);
                break;

            case 'OpponentLeft':
                gameController.opponentDisconnect();
                break;

       }
    }

}

const url = 'ws://localhost:9876/websocket';
const socketController = new SocketController(url);
const gameController = new GameController();

