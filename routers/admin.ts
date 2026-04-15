import express from 'express'
import multer from 'multer';
import { 
    getform, 
    download,
    upload,
    clearTable
} from '../infrastructure/form.js'

const adminRouter = express.Router()
const memory = multer({ storage: multer.memoryStorage() });

/*
    multer(...) — создаёт обработчик загрузки файлов.
    storage: multer.memoryStorage() — говорит multer не сохранять файл на диск, а держать его в памяти как Buffer.
    memory.single('file') — принять один файл из поля формы с именем "file".
*/

adminRouter.route('/').get(getform)
adminRouter.post('/upload', memory.single('file'), upload)
adminRouter.put('/clear', clearTable)
adminRouter.use('/download', download)

export default adminRouter