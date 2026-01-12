import { WebSocketServer } from "ws";

interface Post {
  serial_id: string;
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

type WSMessage =
  | { type: 'getBook' }
  | { type: 'postBook'; payload: Post }
  | { type: 'deleteBook'; payload: Delete }
  | { type: 'patchBook'; payload: Patch };

export type {
    Post,
    Delete,
    Patch,
    WSMessage
}

