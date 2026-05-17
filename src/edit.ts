import { AddNews, EditNews, GetNews, GetNewsById } from './api/http';
import { Navbar } from './components/navbar';
import './styles/style.css'
import type { News } from './types/News';

document.querySelector("#navbar")!.innerHTML = Navbar()

let filename: string = ""
let uploaded = false


const loggedIn = sessionStorage.getItem("aktualisUser")
const input = document.querySelector<HTMLInputElement>('#imgInput')!;
const imgContainer = document.querySelector("#imgContainer")!;
const deleteBtn = document.querySelector<HTMLElement>("#deleteUpload")!;
const addImgButton = document.querySelector<HTMLElement>("#addImgButton")!;
const news: News[] = await GetNews()
let editNews: News
const params = new URLSearchParams(window.location.search);
const newsId = params.get('id');

//szerkesztés
if (loggedIn && newsId) {
    editNews = await GetNewsById(newsId!)
    document.querySelector<HTMLInputElement>("#title")!.value = editNews.title
    document.querySelector<HTMLInputElement>("#subtitle")!.value = editNews.subtitle
    document.querySelector<HTMLInputElement>("#editorHelper")!.innerHTML = editNews.content

    filename = editNews.imgURL
    addImgButton.style.display = "none";
    imgContainer.insertAdjacentHTML("beforeend", `<img src="./backend/downloaded/${filename}" id="newsImg">`);
    uploaded = true;


    document.querySelector("#sendNews")!.innerHTML = "Módosítás"
    document.querySelector("#sendNews")!.className = "btn btn-warning w-100"

    document.querySelector(".modal-body")!.innerHTML = "Biztosan módosítod a cikket?"

    document.querySelector("#sendModalBtn")!.innerHTML = "Módosítás"
    document.querySelector("#sendModalBtn")!.className = "btn btn-warning editNews"

}
document.querySelector("#title")!.addEventListener("input", () => {
    if (document.querySelector<HTMLInputElement>("#title")!.value !== "") document.querySelector<HTMLElement>("#titleError")!.style.display = "none"
})

document.querySelector("#subtitle")!.addEventListener("input", () => {
    if (document.querySelector<HTMLInputElement>("#subtitle")!.value !== "") document.querySelector<HTMLElement>("#subtitleError")!.style.display = "none"
})

imgContainer.addEventListener("mouseover", () => {
    if (uploaded) deleteBtn.style.opacity = "1";
});
imgContainer.addEventListener("mouseleave", () => {
    deleteBtn.style.opacity = "0";
});

deleteBtn.addEventListener("click", () => {
    uploaded = false;
    input.value = "";
    addImgButton.style.display = "block";
    document.querySelector("#newsImg")?.remove();
});

input.addEventListener("click", () => {
    input.value = "";
});

input.addEventListener("input", async () => {
    if (!input.files) return;
    const file = input.files[0];
    document.querySelector("#imgError")!.innerHTML = ""
    document.querySelector<HTMLElement>("#imgError")!.style.display = "none"
    if (newsId) filename = editNews.id + "." + file.name.split(".")[1]
    else filename = news.length + 1 + "." + file.name.split(".")[1];

    const renamedFile = new File([file], filename, { type: file.type });
    const formData = new FormData();
    formData.append('image', renamedFile);

    try {
        await fetch('http://localhost:3001/upload-image', {
            method: 'POST',
            body: formData
        }).then(() => {
            addImgButton.style.display = "none";
            imgContainer.insertAdjacentHTML("beforeend", `<img src="./backend/downloaded/${filename}" id="newsImg">`);
            uploaded = true;
        })


    } catch (err) {
        console.error("Upload failed:", err);
    }
});

document.querySelector("#sendModalBtn")!.addEventListener("click", async () => {
    const title = document.querySelector<HTMLInputElement>("#title")!.value;
    const subtitle = document.querySelector<HTMLInputElement>("#subtitle")!.value;
    const content = document.querySelector<HTMLTextAreaElement>("#editorHelper")!.innerHTML;

    let userId = "1"
    if (loggedIn) userId = JSON.parse(loggedIn).id

    if (document.querySelector("#sendModalBtn")!.classList.contains("editNews")) {
        await EditNews({
            id: newsId!,
            userId: userId,
            createdAt: new Date().toLocaleString() + " (szerkesztve)",
            imgURL: filename,
            title: title,
            subtitle: subtitle,
            content: content
        }).then(() => {
            document.querySelector("#sendModalBtn")!.innerHTML =
                `
            <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Betöltés...</span>
            </div>
            `
            setTimeout(() => location.reload(), 800)
        })
    } else {
        await AddNews({
            id: "",
            userId: userId,
            createdAt: new Date().toLocaleString(),
            imgURL: filename,
            title: title,
            subtitle: subtitle,
            content: content
        }).then(() => {
            document.querySelector("#sendModalBtn")!.innerHTML =
                `
            <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Betöltés...</span>
            </div>
            `
            setTimeout(() => location.reload(), 800)
        })

    }


});