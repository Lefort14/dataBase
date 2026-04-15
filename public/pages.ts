declare const ws: WebSocket
const selectPage = document.querySelector('.group') as HTMLSelectElement;

selectPage.addEventListener('change', () => {
      const page = selectPage.value
    console.log('Clicked:', page);
    ws.send(JSON.stringify({
        type: 'pageUpdated',
        page: parseInt(page, 10)
      })
    )
  });

