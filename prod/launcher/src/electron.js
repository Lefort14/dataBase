import { app, BrowserWindow, globalShortcut } from 'electron';
import startServer from '../../index.js';
import { start } from 'repl';
import DATA_PORT from '../../port.js';
import squirrelStartup from 'electron-squirrel-startup';
import dotenv from 'dotenv';
import path from 'path';
const rootPath = app.getAppPath();
const envPath = app.isPackaged
    ? path.join(process.resourcesPath, '../.env') // Рядом с exe
    : path.join(rootPath, '.env'); // При разработке
dotenv.config({ path: envPath });
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
    app.quit();
}
const createWindow = (port) => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 720,
        width: 1280,
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(`http://localhost:${port}`);
    globalShortcut.register('CommandOrControl+R', () => {
        // Выполняем только если окно в фокусе, чтобы не мешать другим программам
        if (mainWindow.isFocused()) {
            mainWindow.reload();
        }
    });
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    return mainWindow;
};
export const initApp = async () => {
    try {
        // Сначала запускаем ваш сервер (если он асинхронный — через await)
        console.log('Starting Express server...');
        await startServer(DATA_PORT);
        // Ждем готовности Electron
        await app.whenReady();
        createWindow(DATA_PORT);
        // Стандартные события жизненного цикла
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0)
                createWindow(DATA_PORT);
        });
    }
    catch (err) {
        console.error('Failed to start app:', err);
        app.quit();
    }
};
initApp();
// Обработка закрытия (вне функции)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
