import WebSocket, { WebSocketServer } from 'ws';
import { getBook, postBook, deleteBook, patchBook, errLogs } from '../domain/domain.js';
import type { Post, Delete, Patch } from '../interfaces.js'
import type { TPatch, TPatchBook, TPatchResult } from '../domain-types.js'


async function getHandleBook(
    ws: WebSocket
): Promise<void> {
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
): Promise<void> {
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
): Promise<void> {
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
): Promise<void> {
    try {
        
        const result: TPatchResult[] = await patchBook(payload)

        const books = await getBook()

        if(!result[0]) {
            throw new Error("No pages found");
        }

        if(Array.isArray(result) && result !== null) console.log(result[0].patch_book)

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