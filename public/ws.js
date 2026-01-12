const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => {
  console.log('[WS] connected');
};

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);

  if (msg.type === 'booksUpdated') {
    updateTable(msg.payload);
  }
};

async function updateTable(books) {
    const tbody = document.getElementById('book-list');
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