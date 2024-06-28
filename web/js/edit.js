function previewFile()
{
    event.stopPropagation();
    event.preventDefault();

    const reader = new FileReader();
    reader.onload = () => {
        fileData.data = reader.result;
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
                fileData.data = reader.result;
            };
            reader.readAsBinaryString(files[0]);
            document.getElementById("uploadFile").textContent = files[0].name;
        }
    };
    input.click();
}

function editFileData()
{
    const nameInput = document.getElementById("nameInput");
    const secretInput = document.getElementById("secretInput");

    if (nameInput.value.trim() && secretInput.value.trim())
    {
        fileData.name = nameInput.value;
        fileData.secret = secretInput.value.trim();

        const proceedDataAPI = window.location.origin + "/data/" + fileId;
        const dataRequest = new XMLHttpRequest();
        dataRequest.open("POST", proceedDataAPI, true);
        dataRequest.setRequestHeader("Content-Type", "application/json");
        dataRequest.onloadend = function () {
            if (dataRequest.readyState == dataRequest.DONE) {
                if (dataRequest.status === 200) {
                    window.location.href = window.location.origin;
                }
            }
        }

        dataRequest.send(JSON.stringify(fileData));
    }
}

function removeFileData() {
    const deleteAPI = window.location.origin + "/delete";
    const deleteRequest = new XMLHttpRequest();
    deleteRequest.open("POST", deleteAPI, true);
    deleteRequest.setRequestHeader("Content-Type", "application/json");
    deleteRequest.onloadend = function () {
        if (deleteRequest.readyState == deleteRequest.DONE) {
            if (deleteRequest.status === 200) {
                window.location.href = window.location.origin;
            }
        }
    }

    deleteRequest.send(JSON.stringify({ id: fileId }));
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

    const btnRemove = document.getElementById("btn-remove");
    btnRemove.addEventListener("click", removeFileData);

    const btnEdit = document.getElementById("btn-edit");
    btnEdit.addEventListener("click", editFileData);
});