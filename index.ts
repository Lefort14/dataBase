<<<<<<< HEAD
import express from 'express'
import router from './routers/main.js'
import { createServer, Server } from 'http';
import { initWSS } from './websocket/wss.js';
import path from 'path';
import __dirname from './path.js';


async function startServer(
  port: number,
  hostname: string = 'localhost'
): Promise<Server> {
  
  const app = express()
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))
    
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname))
  app.use('/', router)

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

export default startServer


=======
import express from 'express'
import router from './routers/main.js'
import { createServer, Server } from 'http';
import { initWSS } from './websocket/wss.js';
import path from 'path';
import __dirname from './path.js';


async function startServer(
  port: number,
  hostname: string = 'localhost'
): Promise<Server> {
  
  const app = express()
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))
    
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname))
  app.use('/', router)

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

export default startServer


>>>>>>> 23793b6583b711a45374cfb041e19c989950ea49
