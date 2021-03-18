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
        console.log(document.querySelector(`[data-x="1"][data-y="1"]`))
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
        console.log("Button clicked", this.grid.activeMarker, this.gameOver, this.myMarker)
        if (this.gameOver || this.grid.activeMarker !== this.myMarker) {
            return;
        }

        const pressedButton = event.target;
        this.grid.placeMarker(pressedButton);
        const xCoord = pressedButton.dataset.x;
        const yCoord = pressedButton.dataset.y;
        const btnCoords = {xCoord, yCoord}
        socketController.emit('TransmitButtonPress', {btnCoords});
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

    async placeOpponentsMarker(btnCoords) {
        const x = btnCoords.xCoord;
        console.log(x)
        const y = btnCoords.yCoord;
        console.log(y)
        console.log(document.querySelector(`[data-x="${x}"][data-y="${y}"]`))
        const pressedButton = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        console.log(pressedButton)
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

    setInviteLink(url) {
        this.ui.alertInviteLink(url);
        console.log("Set invite link")
        // const regex = /(?<=\/invite\/).+(?=[\/?])/g;
    }

    connectPlayerTwo = () => {
        const regex = /(?<=\/invite\/).+/g;
        const inviteID = window.location.href.toLowerCase().match(regex)[0];
        console.log(inviteID)
        this.ui.reset();
        this.ui.handleSwitchMarker(this.grid.activeMarker);

        socketController.emit('MatchMeToHost', {inviteID});
        
        // squareButtons.forEach(sqBtn => sqBtn.addEventListener('click', this.twoBrowserMainLoop));
    }


    init() {
        if (!socketController.isGameHost) {
            console.log("HEEE")
            socketController.onopen = this.connectPlayerTwo;
        }
        document.querySelector('#one-browser-button').addEventListener('click', this.setUpOneBrowserGame);
        document.querySelector('#two-browser-button').addEventListener('click', () => {
            console.log("HERE")
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
        console.log('SENDING')
        this.send(JSON.stringify({event, data}))
    }

    listen(message) {
        const{event, reply} = JSON.parse(message.data);

        switch(event) {

            case 'TakeInviteLink':
                console.log("Received invite link")
                gameController.setInviteLink(reply.inviteUrl);
                break;

            case 'StartGame':
                gameController.myMarker = reply.marker;
                gameController.setUpTwoBrowserGame();
                break;

            case 'ButtonPressed':
                console.log(document.querySelector(`[data-x="1"][data-y="1"]`))
                console.log(reply)
                gameController.placeOpponentsMarker(reply);

       }
    }

}



// class SocketdController {
//     constructor(url) {
//         this.url = 'ws://localhost:9876/websocket/';
//         this.server = new WebSocket(url);
//         this.isGameHost = this._checkIfHost();
//         this.server.onmessage = this.handleIncomingMessage;
//         this.isGameHost();

//     }

//     requestInviteLink() {
//         this.emit('GiveInviteLink');
//     }

//     checkIfHost() {
//         this.isGameHost = window.location.href.includes('invite') ? false : true;
//         gameController.connectPlayerTwo();
//     }

//     handleIncomingMessage(message) {
//         const {event, reply} = JSON.parse(message.data);
        
//         switch(event) {

//              case 'TakeInviteLink':
//                 console.log("taking invite link")
//                  gameController.setInviteLink(reply.inviteUrl);


//         }
//     }

//     emit(event, data) {
//         console.log('emitting request')
//         this.server.send(JSON.stringify({event, data}))
//     }
// }

const url = 'ws://localhost:9876/websocket';
const socketController = new SocketController(url);
const gameController = new GameController();

