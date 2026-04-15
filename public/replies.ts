import type { WSMessage } from "../interfaces.js"
declare const ws: WebSocket

const repDel = document.getElementById('reply') as HTMLElement;
const text = document.getElementById('reply-text') as HTMLElement;

ws.addEventListener('message', e => {
    const msg: WSMessage = JSON.parse(e.data)
    if(msg.type === 'transactionFailed') {
        console.log('принято')
        repDel.setAttribute('data-open', 'false');
        setTimeout(() => repDel.setAttribute('data-open', 'true'), 100)
        
        text.textContent = '';
        text.textContent = msg.message;
    }
})

const replyBtn = document.getElementById('reply-button') as HTMLButtonElement;

replyBtn.addEventListener('click', () => {
    console.log('закрыто')
    text.textContent = '';
    repDel.setAttribute('data-open', 'false')
})