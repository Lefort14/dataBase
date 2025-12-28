import { WebSocket } from 'ws'; // библиотека ws для Node

const ws = new WebSocket(`ws://localhost:3000`);

ws.on('open', () => console.log('client connected'));
ws.on('message', data => console.log('server says:', data.toString()));

ws.send('hello server');