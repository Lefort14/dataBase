import express from "express";
import { getBook, downloadFile } from '../domain/domain.ts'


async function getform(req: express.Request, res: express.Response) {
  try {
    
    const data = await getBook()  
    
    return res.render('index.ejs', { books: data.result, pages: data.pages });

  } catch (error) {
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

async function download(req: express.Request, res: express.Response) {
  try {
    res
    .setHeader('Content-Type', 'text/csv')
    .setHeader('Content-disposition', `attachment; filename="books_${new Date().toLocaleString()}.csv"`)

    await downloadFile(res)

  } catch (error) {
    return res
      .status(500)
      .send(`
        <h1>Ошибка скачивания</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
      `);
  }
}

export { 
  getform, 
  download 
};
