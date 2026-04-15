const select = document.getElementById("action") as HTMLSelectElement
const formCreate = document.getElementById("form-create") as HTMLFormElement;
const formDelete = document.getElementById("form-delete") as HTMLFormElement;
const formEdit = document.getElementById("form-edit") as HTMLFormElement;

function switchForms(): void {
    const value: string = select.value;

     
    formCreate.classList.add("hidden");
    formDelete.classList.add("hidden");
    formEdit.classList.add("hidden");

    if (value === "create") formCreate.classList.remove("hidden");
    if (value === "delete") formDelete.classList.remove("hidden");
    if (value === "edit") formEdit.classList.remove("hidden");

}

select.addEventListener("change", switchForms);

