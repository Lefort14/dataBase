import express from 'express'
import adminRouter from './admin.ts'
const router = express.Router()
 
router.get('/', (req, res) => res.redirect('/admin'))
router.use('/', adminRouter)

export default router