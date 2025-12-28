import express from 'express'
import { getform, postform, deleteform, patchform, download } from '../controllers/form.ts'

const adminRouter = express.Router()

adminRouter.route('/')
.get(getform)
.post(postform)
.delete(express.json(), deleteform)
.patch(patchform)

adminRouter.use('/download', download)

export default adminRouter