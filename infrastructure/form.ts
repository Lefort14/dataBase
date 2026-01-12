import express from "express";
import { pool } from './db.ts'
import { Post, Delete, Patch } from '../interfaces.ts'
import { getBook, postBook, deleteBook, patchBook, downloadFile } from '../domain/domain.ts'


async function getform(req: express.Request, res: express.Response)
: Promise<void | Record<string, any>> {
  try {
    
    const result = await getBook()  
    
    return res.render('index.ejs', { books: result });

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

// async function postform(req: express.Request<Post>, res: express.Response<string, { message: string }>)
// : Promise<void | Record<string, any>> {
//   try {
    
//     await postBook(req.body)
  
//     return res.redirect('/admin')

//     } catch (error) {
//       console.log(error)
//       return res
//       .status(400)
//       .send(`
//         <h1>Ошибка POST запроса</h1>
//         <button class="back" onclick="history.back()">Вернуться к форме</button>
//       `);
//     }
// }

/////////////////////////////////////////////////////////////////////////////////////

// async function deleteform(req: express.Request<Delete>, res: express.Response)
// : Promise<void | Record<string, any>> {
//   try {
//     const result = await deleteBook(req.body)

//     if(result === false) 
//       return res
//         .status(404)
//         .send(`
//         <h1>Книга не найдена</h1>
//         <button class="back" onclick="history.back()">Вернуться к форме</button>
//       `)

//       return res.redirect('/admin')

//     } catch (error) {
//       return res
//         .status(400)
//         .send(`
//           <h1>Ошибка DELETE запроса</h1>
//           <button class="back" onclick="history.back()">Вернуться к форме</button>
//         `);
//   }
// }

/////////////////////////////////////////////////////////////////////////////////////

// async function patchform(req: express.Request<Patch>, res: express.Response)
// : Promise<void | Record<string, any>> {  
//   try {
    
//     const result = await patchBook(req.body)

//     if(!result) 
//       return res
//         .status(404)
//         .send(`
//         <h1>Номер книги не найден или номера полок не совпадают</h1>
//         <button class="back" onclick="history.back()">Вернуться к форме</button>
//       `)
    
//     return res.redirect('/admin')

//   } catch (error) {
//       return res
//       .status(400)
//       .send(`
//         <h1>Ошибка PATCH запроса</h1>
//         <button class="back" onclick="history.back()">Вернуться к форме</button>
//       `);
//   }
// }

/////////////////////////////////////////////////////////////////////////////////////

async function download(req: express.Request, res: express.Response):
Promise<void | Record<string, any>> {
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
