import { pool } from '../infrastructure/db.ts'
import { Post, Delete, Patch } from '../interfaces.ts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";
import { to as copyTo } from 'pg-copy-streams'
import { Writable } from 'stream';

const filename = fileURLToPath(import.meta.url)
const __errorPath = path.dirname(filename)
const __logPath = path.join(__errorPath, '../logs.txt')



async function getBook() {
    try {
        const result = await pool.query(`
          SELECT * FROM books
          ORDER BY serial_id ASC;
          `);
          
        return result.rows
    } catch (error) {
        if(error instanceof Error) await errLogs(error)
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function postBook(data: Post) {
    try {
        let { 
          description, 
          isbn, 
          shelf_number 
        }: Post = data
    
        if(!isbn || isbn.trim().length === 0) isbn = 'Отсутствует'
    
        await pool.query(`
            SELECT add_book ($1, $2, $3)
            `,
            [description, isbn, shelf_number]
        )
    
        const result = await pool.query(`
            SELECT serial_id FROM books
            ORDER BY serial_id;
        `)
        return result.rows
        
    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function deleteBook(data: Delete) {
    try {
        const { 
            serial_id
        }: Delete = data;
  
        const checkResult = await pool.query( 
        `SELECT EXISTS(SELECT 1 FROM books WHERE serial_id = $1)`,
        [serial_id]
        );
    
        if (!checkResult.rows[0].exists) return false
    
        const result = await pool.query(`
            WITH deleted AS (
                DELETE FROM books 
                WHERE serial_id = $1
                RETURNING *
            )
            UPDATE books 
            SET serial_id = serial_id - 1 
            WHERE serial_id > $1
            RETURNING *;
            `, 
            [serial_id]
        )

        return result.rows

    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error    
  }
}

/////////////////////////////////////////////////////////////////////////////////////

async function patchBook(data: Patch) {
    try {
        let {
            old_serial_id,
            n_serial_id,
            description,
            isbn,
            shelf_number
        }: Patch = data

        const checkResult = await pool.query( 
            `SELECT EXISTS(SELECT 1 FROM books WHERE serial_id = $1)`,
            [old_serial_id]
        );

        if (!checkResult.rows[0].exists) return false
        
        await pool.query(`
            SELECT patch_book(
            $1,                 -- current_serial
            $2,                 -- new_serial (пусто в форме)
            $3,                 -- new_description (заполнено)
            $4,                 -- new_isbn (пусто в форме)
            $5                  -- new_shelf (пусто в форме)
            );
            `,
            [old_serial_id, n_serial_id, description, isbn, shelf_number]
        );

        const result = await pool.query(`
            SELECT reorder_all_books()
        `)

        return result.rows

    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function downloadFile(result: Writable) {
    try {
        const client = await pool.connect()
        
        const query = 
        `
        COPY (SELECT 
        serial_id as "Порядковый номер", 
        description as "Название", 
        isbn as "ISBN", 
        shelf_number as "Номер полки" 
        FROM books
        ORDER BY serial_id, shelf_number
        ) 
        TO STDOUT WITH CSV HEADER
        `
        
        const stream = client.query(copyTo(query))

        stream.pipe(result)
        
        const streamPromise = new Promise((resolve, reject) => 
            stream.on('end', () => {
            client.release()
            resolve('поток закрыт')
            })
        ).catch((err) => errLogs(err))

        return streamPromise
        
    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error
    }
}

async function errLogs(error: Error) {
    console.log(error.message); 
    return fs.writeFile(__logPath, `[${new Date().toLocaleString()}] ${error}`, 'utf-8', () => console.log('логи обновлены!'))
}   

export {
    getBook,
    postBook,
    deleteBook,
    patchBook,
    downloadFile
}