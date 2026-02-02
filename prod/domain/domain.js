import { pool } from '../infrastructure/db.js';
import {} from '../interfaces.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { to as copyTo } from 'pg-copy-streams';
import { Writable } from 'stream';
import { curPage } from './pages.js';
const filename = fileURLToPath(import.meta.url);
const __errorPath = path.dirname(filename);
const __logPath = path.join(__errorPath, '../logs.txt');
async function getBook() {
    try {
        const pageInt = curPage.page;
        const result = await pool.query(`
          SELECT 
            serial_id, 
            description, 
            isbn, 
            shelf_number 
          FROM books
          WHERE shelf_number = $1
          ORDER BY serial_id ASC;
          `, [pageInt]);
        return result.rows;
    }
    catch (error) {
        if (error instanceof Error)
            await errLogs(error);
        throw error;
    }
}
/////////////////////////////////////////////////////////////////////////////////////
async function pages() {
    try {
        const pagesQuery = await pool.query(`
          SELECT COUNT(DISTINCT shelf_number) AS num_groups
          FROM books;
        `);
        const pages = parseInt(pagesQuery.rows[0].num_groups, 10);
        return pages;
    }
    catch (error) {
        if (error instanceof Error)
            await errLogs(error);
        throw error;
    }
}
/////////////////////////////////////////////////////////////////////////////////////
async function postBook(data) {
    try {
        let { description, isbn, shelf_number } = data;
        if (!isbn || isbn.trim().length === 0)
            isbn = '-';
        await pool.query(`
            SELECT add_book ($1, $2, $3)
            `, [description, isbn, shelf_number]);
        const result = await pool.query(`
            SELECT serial_id FROM books
            ORDER BY serial_id;
        `);
        return result.rows;
    }
    catch (error) {
        if (error instanceof Error)
            await errLogs(error);
        throw error;
    }
}
/////////////////////////////////////////////////////////////////////////////////////
async function deleteBook(data) {
    try {
        const { serial_id } = data;
        const pageInt = curPage.page;
        const checkResult = await pool.query(`SELECT EXISTS(SELECT 1 FROM books WHERE shelf_number = $1 AND serial_id = $2)`, [pageInt, serial_id]);
        if (!checkResult.rows[0].exists)
            return console.log('Книги с таким номером не существует');
        const result = await pool.query(`
            SELECT delete_book($1, $2)
            `, [serial_id, pageInt]);
        return result.rows;
    }
    catch (error) {
        if (error instanceof Error)
            await errLogs(error);
        throw error;
    }
}
/////////////////////////////////////////////////////////////////////////////////////
async function patchBook(data) {
    try {
        let { old_serial_id, new_serial_id, description, isbn } = data;
        const pageInt = curPage.page;
        function normalize(value) {
            return value === '' ? null : value;
        }
        new_serial_id = normalize(new_serial_id);
        isbn = normalize(isbn);
        description = normalize(description);
        const result = await pool.query(`
            SELECT patch_book(
            $1,                 -- shelf_number
            $2,                 -- current_serial
            $3,                 -- new_serial (пусто в форме)
            $4,                 -- new_description (заполнено)
            $5                  -- new_isbn (пусто в форме)
            );
            `, [pageInt, old_serial_id, new_serial_id, description, isbn]);
        // const result = await pool.query(`
        //     SELECT reorder_all_books()
        // `)
        return result.rows;
    }
    catch (error) {
        if (error instanceof Error)
            await errLogs(error);
        throw error;
    }
}
/////////////////////////////////////////////////////////////////////////////////////
async function downloadFile(result) {
    try {
        const client = await pool.connect();
        const query = `
        COPY (SELECT 
        serial_id as "Порядковый номер", 
        description as "Название", 
        isbn as "ISBN", 
        shelf_number as "Номер полки" 
        FROM books
        ORDER BY shelf_number, serial_id
        ) 
        TO STDOUT WITH CSV HEADER
        `;
        const stream = client.query(copyTo(query));
        stream.pipe(result);
        const streamPromise = new Promise((resolve, reject) => stream.on('end', () => {
            client.release();
            resolve('поток закрыт');
        })).catch((err) => errLogs(err));
        return streamPromise;
    }
    catch (error) {
        if (error instanceof Error)
            await errLogs(error);
        throw error;
    }
}
async function errLogs(error) {
    console.log(error);
    return fs.appendFile(__logPath, `[${new Date().toLocaleString()}] ${error}\n`, 'utf-8', () => console.log('логи обновлены!'));
}
export { getBook, postBook, deleteBook, patchBook, downloadFile, errLogs, pages };
