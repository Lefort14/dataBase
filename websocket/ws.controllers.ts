import WebSocket, { WebSocketServer } from 'ws';
import { getBook } from '../domain/domain.ts';
import { WSHandler } from '../interfaces.ts'

async function getHandleBook({
    ws
}: WSHandler) {
  const books = await getBook();

  ws.send(JSON.stringify({
    type: 'books',
    payload: books
  }));
}

async function postHandleBook({
    ws,
    payload,
    wss
}: WSHandler) {
    
}

async function deleleHandleBook({
    ws,
    payload,
    wss
}: WSHandler) {
    
}

async function patchHandleBook({
    ws,
    payload,
    wss
}: WSHandler) {
    
}

export { 
    getHandleBook, 
    postHandleBook, 
    deleleHandleBook, 
    patchHandleBook 
} 