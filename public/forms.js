"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!(form instanceof HTMLFormElement))
        return;
    var action = form.dataset.action;
    if (!action)
        return;
    e.preventDefault();
    var payload = Object.fromEntries(new FormData(form).entries());
    ws.send(JSON.stringify({
        type: action,
        payload: payload
    }));
});
