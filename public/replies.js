"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
var repDel = document.getElementById('reply');
var text = document.getElementById('reply-text');
ws.addEventListener('message', function (e) {
    var msg = JSON.parse(e.data);
    if (msg.type === 'transactionFailed') {
        console.log('принято');
        repDel.setAttribute('data-open', 'false');
        setTimeout(function () { return repDel.setAttribute('data-open', 'true'); }, 100);
        text.textContent = '';
        text.textContent = msg.message;
    }
});
var replyBtn = document.getElementById('reply-button');
replyBtn.addEventListener('click', function () {
    console.log('закрыто');
    text.textContent = '';
    repDel.setAttribute('data-open', 'false');
});
