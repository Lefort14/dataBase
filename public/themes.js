"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'getTheme' }));
}
else {
    ws.addEventListener('open', function () {
        ws.send(JSON.stringify({ type: 'getTheme' }));
    }, { once: true });
}
var theme = document.getElementById('btn-theme');
var change = 'white';
ws.addEventListener('message', function (e) {
    var msg = JSON.parse(e.data);
    if (msg.type === 'themeChanged') {
        changeTheme(msg.theme);
    }
});
theme.addEventListener('click', function () {
    toggleTheme();
    console.log('theme changed');
});
function changeTheme(theme) {
    var img = document.querySelector('#theme');
    if (!img)
        return;
    change = theme;
    if (theme === 'black') {
        img.src = '../theme2.png';
        document.documentElement.style.setProperty('--bg1', 'black');
        document.documentElement.style.setProperty('--bg3', 'white');
        document.documentElement.style.setProperty('--contColor', 'rgb(16, 16, 16)');
        document.documentElement.style.setProperty('--optionBack', 'white');
        document.documentElement.style.setProperty('--action', 'white');
        document.documentElement.style.setProperty('--label', 'white');
        document.documentElement.style.setProperty('--input', 'rgba(255, 255, 255, 0.54)');
        document.documentElement.style.setProperty('--bg4Table1', 'rgb(48, 48, 48)');
        document.documentElement.style.setProperty('--bg4Table2', 'rgb(16, 16, 16)');
        document.documentElement.style.setProperty('--borderBot', 'black');
        document.documentElement.style.setProperty('--fontTable', 'white');
    }
    else {
        img.src = '../theme1.png';
        document.documentElement.style.setProperty('--bg1', 'white');
        document.documentElement.style.setProperty('--bg3', 'black');
        document.documentElement.style.setProperty('--contColor', 'white');
        document.documentElement.style.setProperty('--optionBack', 'black');
        document.documentElement.style.setProperty('--action', 'black');
        document.documentElement.style.setProperty('--label', 'black');
        document.documentElement.style.setProperty('--theme', "url('../../theme1.png')");
        document.documentElement.style.setProperty('--input', 'rgba(0, 0, 0, 0.539)');
        document.documentElement.style.setProperty('--bg4Table1', 'white');
        document.documentElement.style.setProperty('--bg4Table2', '#f3f3f3');
        document.documentElement.style.setProperty('--borderBot', '#dddddd');
        document.documentElement.style.setProperty('--fontTable', 'black');
    }
}
function toggleTheme() {
    var nextTheme = change === 'white' ? 'black' : 'white';
    ws.send(JSON.stringify({
        type: 'themeChanged',
        theme: nextTheme
    }));
}
