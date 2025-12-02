import express from 'express'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path';
import router from './routers/main.ts'
import methodOverride from "method-override";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: number;
    }
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const DATA_PORT = Number(process.env.PORT)
const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))


app.set('view engine', 'ejs')
app.set('views', './views')
  
  app.use((req, res, next) => {
   if (req.url.match(/\.(css|js|png|jpg|jpeg|svg|gif|ttf|woff|woff2)$/)) {
    return next();
  }
  console.log(`
    Метод: ${req.method}
    URL: ${req.url}        
    `)
    next()
  })

app.use('/', router)
app.use(express.static(__dirname))

app.listen(DATA_PORT, (): void => {
    console.log(`Port ${DATA_PORT}`)
})
