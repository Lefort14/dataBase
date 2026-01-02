import { pool } from './db.ts'

async function webSocketFn(message: string) {
    const data = JSON.parse(message)

    if(data.type = 'getBooks') {
        const result = await pool.query(`
        SELECT * FROM books
        ORDER BY shelf_number ASC;
        `);
    }
}

export {
    webSocketFn
}