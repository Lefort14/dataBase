import express from 'express'
import { 
    getform, 
    download,
    // upload 
} from '../infrastructure/form.js'

const adminRouter = express.Router()

adminRouter.route('/')
.get(getform)

adminRouter.use('/download', download)

export default adminRouter