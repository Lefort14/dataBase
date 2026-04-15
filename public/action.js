const select = document.getElementById("action");

const formCreate = document.getElementById("form-create");
const formDelete = document.getElementById("form-delete");
const formEdit = document.getElementById("form-edit");
const download = document.getElementById("download-tab");

function switchForms() {
    const value = select.value;

     
    formCreate.classList.add("hidden");
    formDelete.classList.add("hidden");
    formEdit.classList.add("hidden");

    if (value === "create") formCreate.classList.remove("hidden");
    if (value === "delete") formDelete.classList.remove("hidden");
    if (value === "edit") formEdit.classList.remove("hidden");
    if(value === "download") location.href = 'admin/download'

}

select.addEventListener("change", switchForms);