function onClick(event)
{
    if (event.target.nodeName === "LI")
    {
        window.location.href = window.location.origin + `/view/${event.target.dataset.secret}`;
    }

    if (event.target.nodeName === "IMG")
    {
        window.location.href = window.location.origin + `/edit/${event.target.dataset.id}`;
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
    document.body.addEventListener("click", onClick);
});