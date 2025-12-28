import express from "express";
import { pool } from './db.ts'
import { to as copyTo } from 'pg-copy-streams'
import ws from './ws.ts'

interface Post {
  serial_id: string;
  description: string;
  isbn: string
  shelf_number: string;
}

interface Delete {
  serial_id: string;
}

interface Patch {
  old_serial_id: string | null;
  n_serial_id: string | null;
  description: string | null;
  isbn: string | null;
  shelf_number: string | null;
}


async function getform(req: express.Request, res: express.Response) {
  try {
    const result = await pool.query(`
      SELECT * FROM books
      ORDER BY shelf_number ASC;
      `);

    res.render('index.ejs', {
      books: result.rows      
    });
  } catch (error) {
    console.log(error); 
    return res
      .set("Content-Type", "text/plain")
      .status(500)
      .send("Ошибка HTML");
  }
}

async function postform(req: express.Request<Post>, res: express.Response<string, { message: string }>) {
  try {
    let { 
      serial_id, 
      description, 
      isbn, 
      shelf_number 
    }: Post = req.body;

  if(isbn.length <= 1) isbn = 'Отсутствует'

  await pool.query(`
    SELECT add_book ($1, $2, $3)
    `,
  [description, isbn, shelf_number]
  )

  const result = await pool.query(`
    SELECT serial_id FROM books
    ORDER BY serial_id;
  `)
  // доделать
  ws.send(result)
  // return res.redirect('/admin')
    } catch (error) {
      console.log(error)
      return res
      .status(400)
      .send(`
        <h1>Ошибка post запроса</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
        `);
    }
}

/////////////////////////////////////////////////////////////////////////////////////

async function deleteform(req: express.Request<Delete>, res: express.Response) {
  try {
    const { 
        serial_id
      }: Delete = req.body;
  
      const checkResult = await pool.query( // проверяет на существование serial_id 
      `SELECT EXISTS(SELECT 1 FROM books WHERE serial_id = $1)`,
      [serial_id]
      );
    
    if (!checkResult.rows[0].exists) 
    return res.send(`
        <h1>Книга не найдена</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
        `)
  
      const view = await pool.query(`
      WITH deleted AS (
          DELETE FROM books 
          WHERE serial_id = $1
          RETURNING *
      )
      UPDATE books 
      SET serial_id = serial_id - 1 
      WHERE serial_id > $1
      `, [serial_id])

         res.render('index.ejs', { books: view.rows })
      // res.redirect('/admin')
    } catch (error) {
      console.log(error)
      return res.send(`
        <h1>Ошибка delete запроса</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
        `);
  }
  
}

/////////////////////////////////////////////////////////////////////////////////////

async function patchform(req: express.Request, res: express.Response) {  
  try {
    let {
      old_serial_id,
      n_serial_id,
      description,
      isbn,
      shelf_number
    }: Patch = req.body

    const result = await pool.query(`
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

    const view = await pool.query(`
      SELECT reorder_all_books()
      `)

    console.log(result.rows[0])

    res.render('index.ejs', { books: view.rows })
    // res.redirect('/admin')
  } catch (error) {
    console.log(error)
      return res
      .status(400)
      .send(`
        <h1>Ошибка patch запроса</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
        `);
  }
}

/////////////////////////////////////////////////////////////////////////////////////

async function download(req: express.Request, res: express.Response) {
  
  const client = await pool.connect()

  res
  .setHeader('Content-Type', 'text/csv')
  .setHeader('Content-disposition', `attachment; filename="books_${new Date().toLocaleString()}.csv"`)

  const query = 
  `
  COPY (SELECT 
    serial_id as "Порядковый номер", 
    description as "Название", 
    isbn as "ISBN", 
    shelf_number as "Номер полки" 
  FROM books) 
  TO STDOUT WITH CSV HEADER
  `


  const stream = client.query(copyTo(query))

  stream.pipe(res)
  stream.on('end', () => client.release())
}

export { getform, postform, deleteform, patchform, download };
