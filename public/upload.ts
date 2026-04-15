const upload = document.getElementById('btn-upload') as HTMLButtonElement;
const inputUp = document.getElementById('upload-input') as HTMLInputElement;
const mainWarning = document.getElementById('main-warning') as HTMLElement;
const warningBack = document.getElementById('warning-background') as HTMLElement;
const yes = document.querySelector('.btn-success') as HTMLButtonElement;
const no = document.querySelector('.btn-danger') as HTMLButtonElement;

upload.addEventListener('click', () => {
    inputUp.click()
})

inputUp.addEventListener('change', async () => {
    try {
        const file = inputUp.files?.[0];
        if(!file) return
        
        /*
            new FormData() — создаёт объект для отправки данных в формате multipart/form-data.
            formData.append('file', file) — добавляет в этот объект поле с именем "file" и значением переменной file.

            в запрос уйдёт поле формы file, внутри которого будет сам файл.
        */

        const formData = new FormData();
        formData.append('file', file);

        const response: Response = await fetch('/admin/upload', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        } 

        location.reload()
    } catch (error) {
        if(error instanceof Error)
            console.log('ошибка отправки файла:', error.message)
    }
})
