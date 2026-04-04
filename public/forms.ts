declare const ws: WebSocket;

type TPayload = {
  [k: string]: FormDataEntryValue;
}

document.addEventListener('submit', e => {
  const form = e.target;
  if (!(form instanceof HTMLFormElement)) return;

  const action = form.dataset.action;
  if (!action) return;

  e.preventDefault();

  const payload: TPayload = Object.fromEntries(
    new FormData(form).entries()
  );
  
  ws.send(JSON.stringify({
    type: action,
    payload
  }));
});
