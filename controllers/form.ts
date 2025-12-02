import express from "express";
import { WebSocketServer } from "ws";
import { pool } from './db.ts'

interface Form {
  serial_id: string;
  description: string;
  isbn?: string
  shelf_number: string;
}

async function getform(req: express.Request, res: express.Response) {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY serial_id");
    res.render("index", {
      title: "Data base",
      form: "Отправка данных",
      books: result.rows      
    });
  } catch (error: unknown) {
    console.log(error); // unknown
    return res
      .set("Content-Type", "text/plain")
      .status(500)
      .send("Server error while loading HTML file");
  }
}

async function postform(req: express.Request<{}, {}, Form>, res: express.Response<string, { message: string }>) {
  try {
    const { 
      serial_id, 
      description, 
      isbn, 
      shelf_number 
    }: Form = req.body;
    console.log(req.body);
    const result = await pool.query(`
      INSERT INTO books(serial_id, description, isbn, shelf_number) VALUES
      ($1, $2, $3, $4)
      RETURNING *
      `,
    [serial_id, description, isbn, shelf_number]
    )
    res.render("index", { books: result.rows })
  } catch (error) {
    console.log(error)
    res.send("ошибка!");
  }
}

async function deleteform(req: express.Request, res: express.Response) {
  res
    .status(200)
    .send('delete')
}

async function patchform(req: express.Request, res: express.Response) {
  res
    .status(200)
    .send('patch')
}

export { getform, postform, deleteform, patchform };
