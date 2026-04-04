import type { ThemesChoice } from '../interfaces.js'

class Themes {
    public theme: ThemesChoice

    constructor(th: ThemesChoice) {
        this.theme = th
    }
}

const themes = new Themes('white')

export { themes }

/*
* Доделать класс глобального состояния страницы с полками на ejs, 
* предположительно нужно логику считывания передать eventListener'у 
* и потом обрабатывать на сервере, вызывая через метод класса нужную
* страницу, присваивая данные исходя из кнопки с номером
* Возможно, класс не придётся делать
*/
