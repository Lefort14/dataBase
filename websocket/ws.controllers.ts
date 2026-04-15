import WebSocket, { WebSocketServer } from 'ws';
import { getBook, postBook, deleteBook, patchBook, errLogs } from '../domain/domain.js';
import type { Post, Delete, Patch } from '../interfaces.js'
import type { TPatch, TPatchBook, TPatchResult } from '../types.js'


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
        const setBook = await postBook(payload);
        const books = await getBook();
    
        if(!Array.isArray(setBook)) {
            if(!setBook.success) {
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: 'transactionFailed',
                                message: setBook.reply
                            })
                        );
                    }
                })
            }
        }

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
        const delBook = await deleteBook(payload);

        if(!Array.isArray(delBook)) {
            if(!delBook.success) {
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: 'transactionFailed',
                                message: delBook.reply
                            })
                        );
                    }
                })
            }
        }
        
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
        
        const result = await patchBook(payload)
        const books = await getBook()

        if(!Array.isArray(result)) {
            if(!result.success) {

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: 'transactionFailed',
                                message: result.reply
                            })
                        );
                    }
                })
            }

        }

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