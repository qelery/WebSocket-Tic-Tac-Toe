const url = 'localhost:9876';
const WebSocket = require('ws');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../public')));


const port = 9876;
const server = app.listen(port);

const wss = new WebSocket.Server({
    server
});



app.get('/invite/:inviteID', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/index.html'));
});

const allClients = [];

wss.on('connection', (client, req) => {

    allClients.push(client);

    client.on('message', (signal) => {
  
        const {event, data} = JSON.parse(signal);
        console.log("Event:", event);
        switch (event) {

            case 'GiveMeInviteLink':
                console.log("Response: sending invite link");
                const [inviteUrl, inviteID] = generateInviteLink();
                client.send(respond('TakeInviteLink', {inviteUrl}));   
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

                    host.send(respond('StartGame', {marker: 'X'}));
                    guest.send(respond('StartGame', {marker: 'O'}));

                    console.log(host.name, client.name)
                } else {
                    console.log("couldn't find match")
                }
                break;

            case 'TransmitButtonPress':
                console.log(data)
                console.log("Data was", data)
                client.opponent.send(respond('ButtonPressed', data.btnCoords));
                break;


        }

    });


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

 function respond(event, reply) {
    return JSON.stringify({event, reply});
 }

 console.clear();