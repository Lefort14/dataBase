import express from 'express'
import { getform, postform, deleteform, patchform } from '../controllers/form.ts'

const adminRouter = express.Router()

adminRouter.route('/admin')
.get(getform)
.post(postform)
.delete(deleteform)
.patch(patchform)


export default adminRouter