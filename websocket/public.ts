import { DATA_PORT } from "../index.ts";

const ws = new WebSocket(`ws://localhost:${DATA_PORT}`)

ws.onopen = () => {
    console.log('connected to ws')
    ws.send(JSON.stringify({ type: 'getBooks '}))
}

ws.onmessage = (ev) => {
    const data = JSON.parse(ev.data)

    if(data.type === 'books') {
        const list = document.querySelector('#book-list')
        list!.innerHTML = ''

        data.payload.forEach((book: string) => {
            renderBooks(data.payload)
        })
    }
}

function renderBooks(books: any): void {
    const tbody = document.getElementById('book-list');
    tbody!.innerHTML = '';

    books.forEach((book: any) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${book.serial_id}</td>
      <td>${book.description}</td>
      <td>${book.isbn}</td>
      <td>${book.shelf_number}</td>
    `;

    tbody!.appendChild(tr);
  });
}