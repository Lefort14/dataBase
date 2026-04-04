import express from 'express';
import router from './routers/main.js';
import { createServer, Server } from 'http';
import { initWSS } from './websocket/wss.js';
import { fileURLToPath } from 'url';
import path from 'path';
async function startServer(port, hostname = 'localhost') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use('/', router);
    app.use(express.static('public'));
    app.use(express.static(__dirname));
    const server = createServer(app);
    initWSS(server);
    return new Promise((res, rej) => {
        server.listen(port, hostname, () => {
            console.log(`Port ${port}`);
            res(server);
        });
        server.on('error', rej);
    });
}
export default startServer;
