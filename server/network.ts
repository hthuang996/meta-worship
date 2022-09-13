import { WebSocketServer } from "ws";

const PORT = 12345;

const wss = new WebSocketServer({port: PORT});

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log(`Received message from client', ${data}`);
    });

    ws.send('Connection established');
});

console.log(`Listening at ${PORT}`);