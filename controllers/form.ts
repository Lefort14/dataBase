import express from "express";
import { WebSocketServer } from "ws";
import pool from './db.js'

interface Form {
  serialNum: string;
  description: string;
  isbn?: string;
  shelf: string;
}

async function getform(req: express.Request, res: express.Response) {
  try {
    return res.render("index", {
      title: "Data base",
      form: "Отправка данных",
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
      serialNum, 
      description, 
      isbn, 
      shelf 
    }: Form = req.body;
    
    const result = await pool.query("SELECT * FROM books ORDER BY serial_id");

    res.render("index", { books: result.rows })
  } catch (error) {
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
