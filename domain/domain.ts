import { pool } from '../port.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";
import { to as copyTo } from 'pg-copy-streams'
import { Writable } from 'stream';
import { curPage } from './pages.js';
import type { Post, Delete, Patch, Page } from '../interfaces.js'
import type { TGet, TDelete, TPatch, TPost, TPages, TPatchBook, TPatchResult } from '../domain-types.js'
import type { PoolClient, QueryResult } from 'pg';

const filename = fileURLToPath(import.meta.url)
const __errorPath = path.dirname(filename)
const __logPath = path.join(__errorPath, '../logs.txt')

async function getBook(): Promise<TGet[]>  {
    try {
        const pageInt: string | number = curPage.page
        const result: QueryResult<TGet> = await pool.query<TGet>(`
          SELECT 
            serial_id, 
            description, 
            isbn, 
            shelf_number 
          FROM books
          WHERE shelf_number = $1
          ORDER BY serial_id ASC;
          `, [pageInt]);

        return result.rows
    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function pages(): Promise<number> {
    try {

        const pagesQuery: QueryResult<TPages> = await pool.query<TPages>(`
          SELECT COUNT(DISTINCT shelf_number) AS num_groups
          FROM books;
        `) 

        
        if (!pagesQuery.rows[0]) {
            throw new Error("No pages found");
        }

        const pagesQueryResult: TPages = pagesQuery.rows[0];

        const pages: number = parseInt(pagesQueryResult.num_groups, 10);

        return pages
    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function postBook(data: Post): Promise<TPost[] | void> {
    try {
        let { 
          description, 
          isbn, 
          shelf_number 
        }: Post = data
    
        if(!isbn || isbn.trim().length === 0) isbn = '-'
    
     const res = await pool.query(`
            SELECT add_book ($1, $2, $3)
            `,
            [description, isbn, shelf_number]
        )
    const add = res.rows[0].add_book;

    if(!add) return console.log('Нельзя добавлять больше, чем на одну полку')

        const result: QueryResult<TPost> = await pool.query<TPost>(`
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

async function deleteBook(data: Delete): Promise<TDelete[] | void> {
    try {
        const { 
            serial_id
        }: Delete = data;
        const pageInt: string = curPage.page

        const checkResult = await pool.query( 
        `SELECT EXISTS(SELECT 1 FROM books WHERE shelf_number = $1 AND serial_id = $2)`,
        [pageInt, serial_id]
        );
    
        if (!checkResult.rows[0].exists) 
            return console.log('Книги с таким номером не существует')
    
        const result = await pool.query(`
            SELECT delete_book($1, $2)
            `, 
            [serial_id, pageInt]
        )

        return result.rows

    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error    
  }
}

/////////////////////////////////////////////////////////////////////////////////////

async function patchBook(data: Patch): Promise<TPatchResult[]> {
    try {
        let {
            old_serial_id,
            new_serial_id,
            description,
            isbn
        }: Patch = data

        const pageInt = curPage.page

        function normalize(value: any): null | string {
            return value === '' ? null : value
        }

        new_serial_id = normalize(new_serial_id)
        isbn = normalize(isbn)
        description = normalize(description)
        
        const result: QueryResult<TPatchResult> = await pool.query<TPatchResult>(`
            SELECT patch_book(
            $1,                 -- shelf_number
            $2,                 -- current_serial
            $3,                 -- new_serial (пусто в форме)
            $4,                 -- new_description (заполнено)
            $5                  -- new_isbn (пусто в форме)
            );
            `,
            [pageInt, old_serial_id, new_serial_id, description, isbn]
        );

        return result.rows

    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function downloadFile(result: Writable): Promise<string | void> {
    try {
        const client: PoolClient = await pool.connect()
        
        const query: string = 
        `
        COPY (SELECT 
        serial_id as "Порядковый номер", 
        description as "Название", 
        isbn as "ISBN", 
        shelf_number as "Номер полки" 
        FROM books
        ORDER BY shelf_number, serial_id
        ) 
        TO STDOUT WITH (FORMAT CSV, HEADER, ENCODING 'UTF8')
        `
        
        const stream = client.query(copyTo(query))

        stream.pipe(result)
        
        const streamPromise: Promise<string | void> = new Promise<string>((resolve, reject) => {
            stream.on('end', () => {
            client.release()
            resolve('поток закрыт')
            })

            stream.on("error", (err: Error) => {
                client.release();
                reject(err);
            });
        }).catch((err: Error) => errLogs(err))

        return streamPromise
        
    } catch (error) {
        if(error instanceof Error) await errLogs(error)
        throw error
    }
}

async function errLogs(error: Error): Promise<void> {
    console.log(error); 
    return fs.appendFile(__logPath, `[${new Date().toLocaleString()}] ${error}\n`, 'utf-8', () => console.log('логи обновлены!'))
}   

export {
    getBook,
    postBook,
    deleteBook,
    patchBook,
    downloadFile,
    errLogs, 
    pages
}