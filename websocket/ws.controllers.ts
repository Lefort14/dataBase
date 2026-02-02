import WebSocket, { WebSocketServer } from 'ws';
import { getBook, postBook, deleteBook, patchBook, errLogs } from '../domain/domain.js';
import { type Post, type Delete, type Patch } from '../interfaces.js'


async function getHandleBook(
    ws: WebSocket
) {
    try {
        const books = await getBook();
      
        ws.send(JSON.stringify({
          type: 'booksUpdated',
          payload: books
        }));
    } catch (err) {
        if(err instanceof Error) {
            console.log(err)
            errLogs(err)
        } 
    }
}

async function postHandleBook(
    ws: WebSocket,
    payload: Post,
    wss: WebSocketServer,
) {
    try {
        await postBook(payload);
        const books = await getBook();
    
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        type: 'booksUpdated',
                        payload: books
                    })
                );
            }
        });
    } catch (err) {
        if(err instanceof Error) {
            console.log(err)
            errLogs(err)
        } 
    }
}

async function deleleHandleBook(    
    ws: WebSocket,
    payload: Delete,
    wss: WebSocketServer,
) {
    try {
        await deleteBook(payload);
        const books = await getBook();
        
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        type: 'booksUpdated',
                        payload: books
                    })
                );
            }
        });
    } catch (err) {
        if(err instanceof Error) {
            console.log(err)
            errLogs(err)
        } 
    }
}

async function patchHandleBook(
    ws: WebSocket,
    payload: Patch,
    wss: WebSocketServer,
) {
    try {
        
        const result = await patchBook(payload)
        const books = await getBook()

        console.log(result[0].patch_book)

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        type: 'booksUpdated',
                        payload: books
                    })
                );
            }
        });
    } catch (err) {
        if(err instanceof Error) {
            console.log(err)
            errLogs(err)
        } 
    }
}


export { 
    getHandleBook, 
    postHandleBook, 
    deleleHandleBook, 
    patchHandleBook
} 