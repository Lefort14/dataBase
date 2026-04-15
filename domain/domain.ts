import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises';
import { pool } from '../port.js'
import { fileURLToPath } from "url";
import { to as copyTo, from as copyFrom } from 'pg-copy-streams'
import { Writable, Readable } from 'stream';
import { curPage } from './pages.js';
import type { Post, Delete, Patch } from '../interfaces.js'
import type { TGet, TDelete, TPost, TPages, TPatchResult, TDeleteResult, TIsThisSuccess } from '../types.js'
import type { PoolClient, QueryResult } from 'pg';

const filename = fileURLToPath(import.meta.url)
const __errorPath = path.dirname(filename)
const __logPath = path.join(__errorPath, '../logs.txt')

async function getBook(): Promise<TGet[] | void>  {
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
        if(error instanceof Error) {
            await errLogs(error) 
            return console.log(error.message)
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function pages(): Promise<number | void> {
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
        if(error instanceof Error) {
            await errLogs(error) 
            return console.log(error.message)
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function postBook(data: Post): Promise<TPost[] | TIsThisSuccess | void> {
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

    if(!add) {
        console.log('Нельзя добавлять больше, чем на одну полку')
        return {
            reply: 'Нельзя добавлять больше, чем на одну полку',
            success: false
        }
    }

        const result: QueryResult<TPost> = await pool.query<TPost>(`
            SELECT serial_id FROM books
            ORDER BY serial_id;
        `)
        
        return result.rows
        
    } catch (error) {
        if(error instanceof Error) {
            await errLogs(error) 
            return console.log(error.message)
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function deleteBook(data: Delete): Promise<TDeleteResult[] | TIsThisSuccess | void> {
    try {
        const { 
            serial_id
        }: Delete = data;
        const pageInt: string = curPage.page

        const checkResult = await pool.query( 
            `SELECT EXISTS(SELECT 1 FROM books WHERE shelf_number = $1 AND serial_id = $2)`,
            [pageInt, serial_id]
        );
    
        if (!checkResult.rows[0].exists) {
            console.log('Книги с таким номером не существует')
            return {
                reply: 'Книги с таким номером не существует',
                success: false
            }
        }
            
        
        const result: QueryResult<TDeleteResult> = await pool.query(`
            SELECT delete_book($1, $2)
            `, 
            [serial_id, pageInt]
        )

        if(!result.rows[0]!.delete_book) {
            console.log('Нельзя удалить полку посреди таблицы')
            return {
                reply: 'Нельзя удалить полку посреди таблицы',
                success: false
            }
        }

        return result.rows

    } catch (error) {
        if(error instanceof Error) {
            await errLogs(error) 
            return console.log(error.message)    
        }
  }
}

/////////////////////////////////////////////////////////////////////////////////////

async function patchBook(data: Patch): Promise<TPatchResult[] | TIsThisSuccess | void> {
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
        
        if(!result.rows[0]?.patch_book?.success && typeof result.rows[0]?.patch_book?.reply === 'string') {
            console.log(result.rows[0]?.patch_book?.reply)
            return {
                reply: result.rows[0].patch_book.reply,
                success: false
            }
        }

        return result.rows

    } catch (error) {
        if(error instanceof Error) {
            await errLogs(error) 
            return console.log(error.message)
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function downloadFile(result: Writable): Promise<string | void> {
    try {
        const client: PoolClient = await pool.connect()

        const stream = client.query(copyTo(`
            COPY (SELECT 
            serial_id as "Порядковый номер", 
            description as "Название", 
            isbn as "ISBN", 
            shelf_number as "Номер полки" 
            FROM books
            ORDER BY shelf_number, serial_id
            ) 
            TO STDOUT WITH (FORMAT CSV, HEADER, ENCODING 'UTF8')
        `,
        ))

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
        if(error instanceof Error) {
            await errLogs(error) 
            return console.log(error.message)
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function uploadFile(file: Express.Multer.File): Promise<string | void> {
    const client = await pool.connect()
    try {
        await client.query(`TRUNCATE TABLE books RESTART IDENTITY;`)
       
        const ingestStream = client.query(
            copyFrom(
                `
                    COPY books(serial_id, description, isbn, shelf_number) 
                    FROM STDIN 
                    WITH (
                        FORMAT CSV, 
                        HEADER true, 
                        DELIMITER ','
                    );
                `
            )
        )
        const sourceStream = Readable.from(file.buffer)

        await pipeline(sourceStream, ingestStream)
    } catch (error) {
        if(error instanceof Error) {
            await errLogs(error) 
            return console.log(error.message)
        }
    } finally { 
        client.release() 
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function clearFile(): Promise<string | void> {
    try {
        await pool.query(`TRUNCATE TABLE books RESTART IDENTITY;`)
    } catch (error) {
        if(error instanceof Error) {
            await errLogs(error) 
            return console.log(error.message)
        }
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
    uploadFile,
    clearFile,
    errLogs, 
    pages
}