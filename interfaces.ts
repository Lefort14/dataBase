import { WebSocketServer } from "ws";

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

type Page = string | number;

type WSMessage =
  | { type: 'getBook'; }
  | { type: 'postBook'; payload: Post }
  | { type: 'deleteBook'; payload: Delete }
  | { type: 'patchBook'; payload: Patch }
  | { type: 'pageUpdated'; page: Page }

export type {
    Post,
    Delete,
    Patch,
    Page,
    WSMessage
}

