import express from "express";
import { getBook, downloadFile, pages } from '../domain/domain.js';
async function getform(req, res) {
    try {
        const data = await getBook();
        const page = await pages();
        return res.render('index.ejs', { books: data, pages: page });
    }
    catch (error) {
        return res
            .set("Content-Type", "text/plain")
            .status(500)
            .send(`
        <h1>Ошибка GET запроса</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
        `);
    }
}
/////////////////////////////////////////////////////////////////////////////////////
async function download(req, res) {
    try {
        res
            .setHeader('Content-Type', 'text/csv')
            .setHeader('Content-disposition', `attachment; filename="books_${new Date().toLocaleString()}.csv"`);
        await downloadFile(res);
    }
    catch (error) {
        return res
            .status(500)
            .send(`
        <h1>Ошибка скачивания</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
      `);
    }
}
export { getform, download };
