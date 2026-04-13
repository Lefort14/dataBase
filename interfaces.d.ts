import { WebSocketServer } from "ws";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT?: string;
      DATA_PORT?: string;
    }
  }
}

interface Post {
  description: string;
  isbn: string
  shelf_number: string;
}

interface Delete {
  serial_id: string;
}

interface Patch {
  old_serial_id: string | null;
  new_serial_id: string | null;
  description: string | null;
  isbn: string | null;
}

type Page = string;

type ThemesChoice = 'white' | 'black'

type WSMessage =
  | { type: 'getBook'; }
  | { type: 'postBook'; payload: Post }
  | { type: 'deleteBook'; payload: Delete }
  | { type: 'patchBook'; payload: Patch }
  | { type: 'pageUpdated'; page: Page }
  | { type: 'themeChanged'; theme: ThemesChoice }
  | { type: 'getTheme' }
  | { type: 'themeReply', theme: ThemesChoice }
  | { type: 'transactionFailed', message: string }

export type {
    Post,
    Delete,
    Patch,
    Page,
    WSMessage,
    ThemesChoice
}

