const ws = new WebSocket(`ws://${location.host}`);

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);

  if (msg.type === 'booksUpdated') {
    update(msg.payload);
  }
};

async function update(books, buttons) {
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

const buttons = document.querySelectorAll('[id^="btn_"]');

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
