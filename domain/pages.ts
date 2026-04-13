class Pages<T extends string | number> {
    public page: T

    constructor(page: T) {
        this.page = page 
    }
}

const curPage = new Pages<string>('1')

export { curPage }
