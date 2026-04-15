const clearBtn = document.getElementById('btn-clear') as HTMLButtonElement;
const mainWarning = document.getElementById('main-warning') as HTMLElement;
const warningBack = document.getElementById('warning-background') as HTMLElement;
const yes = document.querySelector('.btn-success') as HTMLButtonElement;
const no = document.querySelector('.btn-danger') as HTMLButtonElement;

clearBtn.addEventListener('click', () => {
    mainWarning.setAttribute('data-open', 'true')
})

warningBack.addEventListener('click', () => {
    mainWarning.setAttribute('data-open', 'false')
})

document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape')
        mainWarning.setAttribute('data-open', 'false')
})

no.addEventListener('click', () => {
    mainWarning.setAttribute('data-open', 'false')
})

yes.addEventListener('click', async () => {
    mainWarning.setAttribute('data-open', 'false')

    const res = await fetch('/admin/clear', {
        method: 'PUT'
    })

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    } 

    location.reload()
})

