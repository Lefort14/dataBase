import type { TGet, TBooksUptd } from "../types.js";

const ws: WebSocket = new WebSocket(`ws://${location.host}`);

ws.onmessage = (e) => {
  const msg: TBooksUptd = JSON.parse(e.data);

  if (msg.type === 'booksUpdated') {
    update<TGet[]>(msg.payload);
  }
};

async function update<T extends TGet[]>(books: T) {
    const tbody = document.getElementById('book-list') as HTMLTableElement;
    tbody.innerHTML = '';

    books.forEach(book => {
        tbody.innerHTML += `
        <tr>
            <td>${book.serial_id}</td>
            <td>${book.description}</td>
            <td>${book.isbn}</td>
            <td>${book.shelf_number}</td>
        </tr>
        `;
    });
}
