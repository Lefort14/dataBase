import express from 'express'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path';
import router from './routers/main.js'
import methodOverride from "method-override";
import { createServer, Server } from 'http';
import { initWSS } from './websocket/wss.js';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT?: number;
    }
  }
}

const DATA_PORT = Number(process.env.PORT)

async function startServer(
  port: number,
  hostname: string = 'localhost'
): Promise<Server> {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  
  dotenv.config({ debug: false, quiet: true})
  
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
  app.use(express.static('public'))
  app.use(express.static(__dirname))
  
  const server = createServer(app) 
  initWSS(server)
  
  return new Promise((res, rej) => {
    server.listen(port, hostname, (): void => {
       console.log(`Port ${port}`)
       res(server)
   })
   server.on('error', rej)
  })
}

export {
  DATA_PORT,
  startServer
}

