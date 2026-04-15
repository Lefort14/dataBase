var selectPage = document.querySelector('.group');
selectPage.addEventListener('change', function () {
    var page = selectPage.value;
    console.log('Clicked:', page);
    ws.send(JSON.stringify({
        type: 'pageUpdated',
        page: parseInt(page, 10)
    }));
});
