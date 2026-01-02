import { WebSocketServer } from "ws";
import { server } from "../index.ts";
import { pool } from '../infrastructure/db.ts'

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('wss connected')

    ws.on('message', async (message: string) => {
    const data = JSON.parse(message);

    if (data.type === 'getBooks') {
      const result = await pool.query(`
        SELECT * FROM books
        ORDER BY serial_id ASC;
        `);

      ws.send(JSON.stringify({
        type: 'books',
        payload: result.rows
      }));
    }
  });

  ws.on('close', () => {
    console.log('WS client disconnected');
  });
})