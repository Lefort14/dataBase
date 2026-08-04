import type { BrowserWindow } from 'electron';

type TGet = {
    serial_id: number;
    description: string;
    blanguage: string
    isbn: string;
    status: string;
    shelf_number: string;
}

type TPost = {
    serial_id: number;
}
type TDelete = TGet
type TPatch = TGet
type TPatchBook = {
        reply: string;
        success: boolean;
}

type TDeleteBook = {
    serial_id: number;
}

type TIsThisSuccess = {
    reply: string;
    success: boolean;
}

type TDeleteResult = Record<string, TDeleteBook>
type TPatchResult = Record<string, TPatchBook>

type TPages = {
    num_groups: string;
}

type TButtonEl = HTMLButtonElement;

type TBooksUptd = {
    type: string | 'bookUpdated';
    payload: TGet[];
}

type TPayload = {
  [k: string]: FormDataEntryValue;
}

type TCreateWindow = (port: number) => BrowserWindow
type TInit = (windowPort: number) => void

export {
    TGet,
    TPost,
    TDelete,
    TPatch,
    TPages,
    TPatchBook,
    TPatchResult,
    TButtonEl,
    TBooksUptd,
    TCreateWindow,
    TInit,
    TPayload,
    TDeleteResult,
    TIsThisSuccess
}