import type { ThemesChoice, WSMessage } from '../interfaces.js'

declare const ws: WebSocket;
const theme = document.getElementById('btn-theme') as HTMLButtonElement
let change: ThemesChoice = 'white'

window.addEventListener('load', () => {
    document.body.style.visibility = 'hidden';

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'getTheme' }));
    } else {
        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({ type: 'getTheme' }));
        }, { once: true });
    }

    ws.addEventListener('message', (e) => {
    const msg: WSMessage  = JSON.parse(e.data);

    if (msg.type === 'themeReply') { 
        changeTheme(msg.theme)
        document.body.style.visibility = 'visible';
    }
    });
});

theme.addEventListener('click', () => {
     toggleTheme();
     console.log('theme changed')
})

function changeTheme(theme: ThemesChoice) {
    const img = document.querySelector('#theme') as HTMLImageElement
    if (!img) return;

    change = theme;
    
    if(theme === 'black') {
        img.src = '../theme2.png'

        document.documentElement.style.setProperty('--bg1', 'black')
        document.documentElement.style.setProperty('--bg3', 'white')
        document.documentElement.style.setProperty('--contColor', 'rgb(16, 16, 16)')
        document.documentElement.style.setProperty('--optionBack', 'white')
        document.documentElement.style.setProperty('--action', 'white')
        document.documentElement.style.setProperty('--label', 'white')
        document.documentElement.style.setProperty('--input', 'rgba(255, 255, 255, 0.54)')
        document.documentElement.style.setProperty('--bg4Table1', 'rgb(48, 48, 48)')
        document.documentElement.style.setProperty('--bg4Table2', 'rgb(16, 16, 16)')
        document.documentElement.style.setProperty('--borderBot', 'black')
        document.documentElement.style.setProperty('--fontTable', 'white')
    } else {
        img.src = '../theme1.png'

        document.documentElement.style.setProperty('--bg1', 'white')
        document.documentElement.style.setProperty('--bg3', 'black')
        document.documentElement.style.setProperty('--contColor', 'white')
        document.documentElement.style.setProperty('--optionBack', 'black')
        document.documentElement.style.setProperty('--action', 'black')
        document.documentElement.style.setProperty('--label', 'black')
        document.documentElement.style.setProperty('--theme', "url('../../theme1.png')")
        document.documentElement.style.setProperty('--input', 'rgba(0, 0, 0, 0.539)')
        document.documentElement.style.setProperty('--bg4Table1', 'white')
        document.documentElement.style.setProperty('--bg4Table2', '#f3f3f3')
        document.documentElement.style.setProperty('--borderBot', '#dddddd')
        document.documentElement.style.setProperty('--fontTable', 'black')
    }
}

function toggleTheme() {
    const nextTheme: ThemesChoice = change === 'white' ? 'black' : 'white';

    ws.send(JSON.stringify({
        type: 'themeChanged',
        theme: nextTheme
    }));
}