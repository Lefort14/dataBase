import { WebSocketServer } from "ws";
import wsRouter from './ws.router.js'

export async function initWSS(server: any) {
  const wss = new WebSocketServer({ server,
    perMessageDeflate: true
  });
  
  wss.on('connection', ws => {
      ws.on('message', msg => wsRouter(ws, msg, wss))
  })
  
  return wss
}