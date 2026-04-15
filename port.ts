import dotenv, { type DotenvConfigOptions } from 'dotenv';
import path from 'path';
import __dirname from './path.js';
import electron from 'electron';
import { Pool } from "pg";

const { app } = electron;

// Определяем путь к .env
let envPath: string;
if (typeof app !== 'undefined') { // electron context
    const rootPath = app.getAppPath();
    envPath = app.isPackaged
        ? path.join(process.resourcesPath, 'app', '.env') // для сборки
        : path.join(rootPath, '..', '..', '.env'); // для разработки
} else {
    // обычный node dev
    envPath = path.join(__dirname, '.env');
}

// Загружаем dotenv
dotenv.config({ path: envPath }) as DotenvConfigOptions;

const DATA_PORT: number = Number(process.env.PORT); 

export const pool: Pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: Number(process.env.DB_PORT)
});

export { 
    DATA_PORT
 };