import dotenv, { type DotenvConfigOptions } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import electron from 'electron';
import { Pool } from "pg";

const { app } = electron;
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

// Определяем путь к .env
let envPath: string;
if (typeof app !== 'undefined') { // electron context
    const rootPath = app.getAppPath();
    envPath = app.isPackaged
        ? path.join(process.resourcesPath, '.env') // для сборки
        : path.join(rootPath, '..', '..', '.env');             // для разработки
} else {
    // обычный node dev
    envPath = path.join(__dirname, '.env');
}

// Загружаем dotenv
dotenv.config({ path: envPath }) as DotenvConfigOptions;

// Читаем порт с дефолтом
const DATA_PORT: number = Number(process.env.PORT);

export const pool: Pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: Number(process.env.DB_PORT)
});

export default DATA_PORT;