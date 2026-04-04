import type { TGet } from "../domain-types.js";

type TButtonEl = HTMLButtonElement;

type TBooksUptd = {
  type: string | 'bookUpdated';
  payload: TGet[];
}

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

const buttons = document.querySelectorAll<TButtonEl>('[id^="btn_"]');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Clicked:', btn.innerText);
    const page = btn.innerText
    ws.send(JSON.stringify({
        type: 'pageUpdated',
        page: parseInt(page, 10)
      })
    )
  });
}); // работает
