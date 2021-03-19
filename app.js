const url = 'localhost:3000';
const express = require('express');
const app = express();
const path = require('path');
const WebSocket = require('ws');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;
const server = app.listen(port);

app.use(express.static(path.join(__dirname, 'public')));


const wss = new WebSocket.Server({
    server
});


/**
 * For matching game host with guest.
 *
 * The game's host is given an invite (link following the pattern below)
 * to send to their opponent, the guest. When the guess connects to the link,
 * their GameController parses the inviteID and sends it to the Server which
 * uses the information to link host and guest.
 */
app.get('/invite/:inviteID', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

const allClients = [];

wss.on('connection', (client, req) => {

    allClients.push(client);

    client.on('message', (signal) => {

        const {event, data} = JSON.parse(signal);

        switch (event) {

            case 'GiveMeInviteLink':
                const [inviteUrl, inviteID] = generateInviteLink();
                client.send(formatResponse('ReceiveInviteLink', {inviteUrl}));
                client.inviteID = inviteID;
                break;

            case 'MatchMeToHost':
                const guest = client;
                const host = allClients.find(client => client.inviteID === data.inviteID);

                if (host) {
                    host.opponent = guest;
                    host.name = 'Player X';
                    guest.opponent = host;
                    guest.name = 'Player O';

                    host.send(formatResponse('StartGame', {marker: 'X'}));
                    guest.send(formatResponse('StartGame', {marker: 'O'}));
                } else {
                    console.log("couldn't find match")
                }
                break;

            case 'TransmitButtonPress':
                client.opponent.send(formatResponse('ButtonPressed', data.squareCoords));
                break;
        }
    });

    client.on('close', () => {
        if (client.opponent) {
            client.opponent.send(formatResponse('OpponentLeft'));
        }
    })

})

function generateInviteLink() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

    const randomColor = colors[getRandomInt(colors.length)];
    const randomNumber = getRandomInt(100);

    const inviteID = `${randomColor}${randomNumber}`;
    const inviteUrl = `${url}/invite/${inviteID}`;
    return [inviteUrl, inviteID];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function formatResponse(event, reply) {
    return JSON.stringify({event, reply});
}