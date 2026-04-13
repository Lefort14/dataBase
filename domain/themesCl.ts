import type { ThemesChoice } from '../interfaces.js'

class Themes {
    public theme: ThemesChoice

    constructor(th: ThemesChoice) {
        this.theme = th
    }
}

const themes = new Themes('white')

export { themes }
