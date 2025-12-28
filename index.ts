import express from 'express'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path';
import router from './routers/main.ts'
import methodOverride from "method-override";
import { createServer } from 'http';
import { WebSocketServer } from "ws";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT?: number;
    }
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ debug: false, quiet: true})

const DATA_PORT = Number(process.env.PORT)
const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.set('view engine', 'ejs')
app.set('views', './views')
  
app.use('/', router)
app.use(express.static(__dirname))

const server = createServer(app)

const wss = new WebSocketServer({ server });

wss.on('connection', () => console.log('ws connected'))

server.listen(DATA_PORT, (): void => {
    console.log(`Port ${DATA_PORT}`)
})

export default server