import startServer from "./index.js";
import { DATA_PORT } from "./port.js";

startServer(DATA_PORT)

/*
* Переписал зависимости из electron forge и перенёс запуск проекта в start.ts
* Не понимаю где подключать url с ejs
*/