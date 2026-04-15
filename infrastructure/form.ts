import express from "express";
import { 
  getBook, 
  downloadFile,
  uploadFile,
  clearFile, 
  pages
} from '../domain/domain.js'


async function getform(req: express.Request, res: express.Response): Promise<express.Response | void> {
  try {
    
    const data = await getBook()  
    const page = await pages()

    return res
      .status(200)
      .render('index.ejs', { books: data, pages: page });

  } catch (error) {
      return res
        .setHeader('Content-Type', 'text/html')
        .status(500)
        .send(`
        <h1>Ошибка GET запроса</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
        `);
  }
}

/////////////////////////////////////////////////////////////////////////////////////

async function download(req: express.Request, res: express.Response): Promise<express.Response | void> {
  try {
    res
      .status(200)
      .setHeader('Content-Type', 'text/csv')
      .setHeader('Content-disposition', `attachment; filename="books_${new Date().toLocaleString()}.csv"`)
    await downloadFile(res)
  } catch (error) {
    return res
      .setHeader('Content-Type', 'text/html')
      .status(500)
      .send(`
        <h1>Ошибка скачивания</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
      `);
  }
}

/////////////////////////////////////////////////////////////////////////////////////

async function upload(req: express.Request, res: express.Response): Promise<express.Response | void> {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Файл не передан' });
    }
    await uploadFile(file)
    res.status(200).json({ ok: true });
  } catch (error) {
    return res
      .setHeader('Content-Type', 'text/html')
      .status(500)
      .send(`
        <h1>Ошибка загрузки таблицы</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
      `);
  }
}

/////////////////////////////////////////////////////////////////////////////////////

async function clearTable(req: express.Request, res: express.Response): Promise<express.Response | void> {
  try {
    
    await clearFile()
    res.status(200).json({ ok: true });
  } catch (error) {
    return res
      .setHeader('Content-Type', 'text/html')
      .status(500)
      .send(`
        <h1>Ошибка загрузки таблицы</h1>
        <button class="back" onclick="history.back()">Вернуться к форме</button>
      `);
  }
}

export { 
  getform, 
  download,
  upload,
  clearTable
};
