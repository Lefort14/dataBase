type TGet = {
    serial_id: number;
    description: string;
    isbn: string;
    shelf_number: string;
}

type TPost = Pick<TGet, 'serialId'>

type TDelete = TGet

type TPatch = TGet

type TPatchBook = {
    patch_book: string;
}

type TPatchResult = Record<string, TPatchBook>

type TPages = {
    num_groups: string;
}

type TButtonEl = HTMLButtonElement;

type TBooksUptd = {
  type: string | 'bookUpdated';
  payload: TGet[];
}


export {
    TGet,
    TPost,
    TDelete,
    TPatch,
    TPages,
    TPatchBook,
    TPatchResult,
    TButtonEl,
    TBooksUptd
}