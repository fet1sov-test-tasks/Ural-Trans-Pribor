let dataFile = {
    name: "",
    secret: "",
    data: "",
};

function previewFile()
{
    event.stopPropagation();
    event.preventDefault();

    const reader = new FileReader();
    reader.onload = () => {
        dataFile.data = reader.result;
    };
    reader.readAsBinaryString(event.dataTransfer.files[0]);
    document.getElementById("uploadFile").textContent = event.dataTransfer.files[0].name;
}

function uploadNewFile()
{
    event.stopPropagation();
    event.preventDefault();

    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _this => {
        let files = Array.from(input.files);
        if (files[0].type === "application/pdf")
        {
            const reader = new FileReader();
            reader.onload = () => {
                dataFile.data = reader.result;
            };
            reader.readAsBinaryString(files[0]);
            document.getElementById("uploadFile").textContent = files[0].name;
        }
    };
    input.click();
}

function addButtonClick()
{
    const errorText = document.getElementById("errorText");

    const nameInput = document.getElementById("nameInput");
    const secretInput = document.getElementById("secretInput");

    if (nameInput.value.trim() && secretInput.value.trim())
    {
        const uploadAPI = window.location.origin + "/data";

        dataFile.name = nameInput.value;
        dataFile.secret = secretInput.value.trim();
        dataFile.data = dataFile.data;

        const uploadRequest = new XMLHttpRequest();
        uploadRequest.open("POST", uploadAPI, true); 
        uploadRequest.setRequestHeader("Content-Type", "application/json");
        uploadRequest.onloadend = function () {
            if (uploadRequest.readyState == uploadRequest.DONE) {   
                if (uploadRequest.status === 200)
                {
                    errorText.classList.add("success-text");
                    errorText.style = "display: block;";
                    errorText.textContent = "Файл успешно загружен в базу данных";
                }
            }
        }
        uploadRequest.send(JSON.stringify(dataFile));
    } else {
        errorText.style = "display: block;";
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
    const dropArea = document.getElementById('uploadFile');
    dropArea.addEventListener('dragover', (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });
    dropArea.addEventListener('drop', previewFile);
    dropArea.addEventListener("click", uploadNewFile);

    const btnAdd = document.getElementById("btn-add");
    btnAdd.addEventListener("click", addButtonClick);
});