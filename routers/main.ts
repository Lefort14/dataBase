import express from 'express'
import adminRouter from './admin.js'
const router = express.Router()
 
router.get('/', (req, res) => res.redirect('/admin'))
router.use('/admin', adminRouter)

export default router