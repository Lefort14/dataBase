"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
var theme = document.getElementById('btn-theme');
var change = 'white';
window.addEventListener('load', function () {
    document.body.style.visibility = 'hidden';
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'getTheme' }));
    }
    else {
        ws.addEventListener('open', function () {
            ws.send(JSON.stringify({ type: 'getTheme' }));
        }, { once: true });
    }
    ws.addEventListener('message', function (e) {
        var msg = JSON.parse(e.data);
        if (msg.type === 'themeReply') {
            changeTheme(msg.theme);
            document.body.style.visibility = 'visible';
        }
    });
});
theme.addEventListener('click', function () {
    toggleTheme();
    console.log('theme changed');
});
function changeTheme(theme) {
    try {
        var img = document.querySelector('#theme');
        var imgDownload = document.querySelector('#download-img');
        var imgUpload = document.querySelector('#upload-img');
        if (!img || !imgDownload || !imgUpload)
            return;
        change = theme;
        if (theme === 'black') {
            img.src = '/images/theme2.png';
            imgDownload.src = '/images/download2.png';
            imgUpload.src = '/images/upload2.png';
            document.documentElement.style.setProperty('--bg1', 'black');
            document.documentElement.style.setProperty('--bg3', 'white');
            document.documentElement.style.setProperty('--contColor', 'rgb(16, 16, 16)');
            document.documentElement.style.setProperty('--optionBack', 'white');
            document.documentElement.style.setProperty('--action', 'white');
            document.documentElement.style.setProperty('--label', 'white');
            document.documentElement.style.setProperty('--input', 'rgba(157, 157, 157, 0.57)');
            document.documentElement.style.setProperty('--bg4Table1', 'rgb(48, 48, 48)');
            document.documentElement.style.setProperty('--bg4Table2', 'rgb(16, 16, 16)');
            document.documentElement.style.setProperty('--borderBot', 'black');
            document.documentElement.style.setProperty('--fontTable', 'white');
            document.documentElement.style.setProperty('--boxShadow', 'white');
            document.documentElement.style.setProperty('--bgBox1', 'rgb(48, 48, 48)');
        }
        else {
            img.src = '/images/theme1.png';
            imgDownload.src = '/images/download1.png';
            imgUpload.src = '/images/upload1.png';
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
            document.documentElement.style.setProperty('--boxShadow', 'black');
            document.documentElement.style.setProperty('--bgBox1', '#f8f8f8');
        }
    }
    catch (error) {
        console.log(error);
    }
}
function toggleTheme() {
    var nextTheme = change === 'white' ? 'black' : 'white';
    ws.send(JSON.stringify({
        type: 'themeChanged',
        theme: nextTheme
    }));
}
