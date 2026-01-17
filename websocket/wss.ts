import { WebSocketServer } from "ws";
import wsRouter from './ws.router.ts'

export async function initWSS(server: any) {
  const wss = new WebSocketServer({ server,
    perMessageDeflate: true
  });
  
  wss.on('connection', ws => {
      ws.on('message', msg => wsRouter(ws, msg, wss))
  })
  
  return wss
}