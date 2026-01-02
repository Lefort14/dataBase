import WebSocket, { WebSocketServer } from 'ws';
import { getHandleBook, postHandleBook, deleleHandleBook, patchHandleBook } from './ws.controllers.ts'

async function wsRouter(    
    ws: WebSocket,
    msg: WebSocket.RawData,
    wss: WebSocketServer
 ) {
    let data: any

    try {
        data = JSON.parse(msg.toString());
    } catch (error) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid JSON'
            })
        )
    }

    switch (data.type) {
        case 'getBook':
            return await getHandleBook(ws);
        case 'postBook':
            return await postHandleBook(ws, data.payload, wss);
        case 'deleteBook':
            return await deleleHandleBook(ws, data.payload, wss);
        case 'patchBook':
            return await patchHandleBook(ws, data.payload, wss);
        default:
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown WS event'
        }));
    }
}
