import express from "express";

interface Form {
  serialNum: string;
  description: string;
  isbn?: string;
  shelf: string;
}

function getform(req: express.Request, res: express.Response) {
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

function postform(req: express.Request<{}, {}, Form>, res: express.Response<string, { message: string }>) {
  try {
    const { 
      serialNum, 
      description, 
      isbn, 
      shelf 
    }: Form = req.body;

    console.log(`
      Серийный номер: ${serialNum}
      Описание: ${description}
      ISBN: ${isbn}
      Номер полки: ${shelf}
      `); 
    // res.redirect('/admin');
    res.status(200).send("post");
  } catch (error) {
    res.send("ошибка!");
  }
}

function deleteform(req: express.Request, res: express.Response) {
  res
    .status(200)
    .send('delete')
}

function patchform(req: express.Request, res: express.Response) {
  res
    .status(200)
    .send('patch')
}

export { getform, postform, deleteform, patchform };
