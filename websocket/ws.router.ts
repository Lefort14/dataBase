import WebSocket, { WebSocketServer } from 'ws';
import { getHandleBook, postHandleBook, deleleHandleBook, patchHandleBook } from './ws.controllers.ts'
import { WSMessage } from '../interfaces.ts';
import { curPage } from '../domain/pages.ts';

async function wsRouter(    
    ws: WebSocket,
    msg: WebSocket.RawData,
    wss: WebSocketServer
 ) {
    let data: WSMessage

    try {
        data = JSON.parse(msg.toString()) as WSMessage;
    } catch (error) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid JSON'
            })
        )
        return
    }

    try {
        switch (data.type) {
            case 'getBook':
                return await getHandleBook(ws);
            case 'postBook':
                return await postHandleBook(ws, data.payload, wss);
            case 'deleteBook':
                return await deleleHandleBook(ws, data.payload, wss);
            case 'patchBook':
                return await patchHandleBook(ws, data.payload, wss);
            case 'pageUpdated':
                curPage.page = data.page
                return await getHandleBook(ws);
            default:
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Unknown WS event'
            }));
        }
    } catch (error) {
        ws.send(JSON.stringify({
        type: 'error',
        message: 'Ошибка на уровне switch'
        }));
    }
}

export default wsRouter
