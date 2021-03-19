
class GameController {
    /**
     * The GameController handles the main logic of the application.
     *
     * Serves as the link between the SocketController, View, and Model;
     * all of which don't communicate directly with one other.
     */
    constructor() {
        this.ui = new UserInterface();
        this.grid = new Grid();
        this.gameOver = false;
        this.myMarker = null;
        this.init();
    }

    async singleBrowserMainLoop(event) {
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

    async twoBrowserMainLoop(event) {

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


    setUpOneBrowserGame() {
        this.myMarker = 'X';
        const squareButtons = Array.from(document.querySelector('.grid').childNodes);
        squareButtons.forEach(sqBtn => sqBtn.addEventListener('click', (event) => this.singleBrowserMainLoop(event)));
        this.ui.reset();
        this.ui.handleSwitchMarker(this.grid.activeMarker);
    }

    setUpTwoBrowserGame() {
        const squareButtons = Array.from(document.querySelector('.grid').childNodes);
        squareButtons.forEach(sqBtn => sqBtn.addEventListener('click', (event) => this.twoBrowserMainLoop(event)));
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

    connectPlayerTwo() {
        const inviteID = window.location.href.toLowerCase().split("invite/")[1].replace("/", "");
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
            socketController.onopen = () => {
                this.connectPlayerTwo();
            }
        }
        document.querySelector('#one-browser-button').addEventListener('click', () => this.setUpOneBrowserGame());
        document.querySelector('#two-browser-button').addEventListener('click', () => socketController.emit('GiveMeInviteLink'));
    }
}



class SocketController extends WebSocket {
    /**
     * The SocketController is the link between the server and client.
     *
     * Communicates between the client and the server. If the game is played on
     * two different devices/browsers, the server is the intermediary between the
     * two clients; the SocketController is the messenger relaying the server's actions.
     */
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

            case 'ReceiveInviteLink':
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

const url = 'ws://localhost:3000/websocket';
const socketController = new SocketController(url);
const gameController = new GameController();

