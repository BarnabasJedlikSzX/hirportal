import { AddNews, DeleteNews, EditNews, GetNewsById } from './api/http';
import { Error } from './components/error';
import { Navbar } from './components/navbar';
import './styles/style.css'
import type { News } from './types/News';
import type { User } from './types/User';

Navbar()

let filename: string = ""
let uploaded = false


const loggedIn = localStorage.getItem("aktualisUser")
const input = document.querySelector<HTMLInputElement>('#imgInput')!;
const imgContainer = document.querySelector("#imgContainer")!;
const deleteBtn = document.querySelector<HTMLElement>("#deleteUpload")!;
const addImgButton = document.querySelector<HTMLElement>("#addImgButton")!;
const params = new URLSearchParams(window.location.search);
const newsId = params.get('id');
const editNews: News | string = await GetNewsById(newsId!)
const currentUser: User = JSON.parse(loggedIn!)
const topics = [
    "Politika",
    "Tech",
    "Ukrajna",
    "Magyar Péter",
    "Belügy",
    "Bulvár",
    "Tóth Gabi"
]

for (let topic of topics) {
    const option = document.createElement("option")
    option.innerText = topic
    option.value = topic
    document.querySelector("#topic")!.appendChild(option)
}



if (newsId) {
    if ((typeof editNews) === "string") Error(404)
    else if (!loggedIn || (currentUser.id !== editNews.userId) || !currentUser.author) Error(401)
    else {
        document.querySelector<HTMLInputElement>("#topic")!.value = editNews.topic
        document.querySelector<HTMLInputElement>("#title")!.value = editNews.title
        document.querySelector<HTMLInputElement>("#subtitle")!.value = editNews.subtitle
        document.querySelector<HTMLInputElement>("#editorHelper")!.innerHTML = editNews.content

        addImgButton.style.display = "none";
        imgContainer.insertAdjacentHTML("beforeend", `<img src="./backend/downloaded/${editNews.imgURL}" id="newsImg">`);
        uploaded = true;
        filename = editNews.imgURL
        document.querySelector<HTMLButtonElement>("#deleteNewsBtn")!.style.display = "block"
        document.querySelector<HTMLButtonElement>("#deleteModalBtn")!.addEventListener("click", async () => {
            await DeleteNews(newsId).then(() => {
                document.querySelector("#deleteModalBtn")!.innerHTML =
                    `
                    <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Betöltés...</span>
                    </div>
            `
                setTimeout(() => location.replace("/"), 800)
            })
        })

        document.querySelector("#sendNews")!.innerHTML = "Módosítás"
        document.querySelector("#sendNews")!.className = "btn btn-warning w-100"

        document.querySelector(".modal-body")!.innerHTML = "Biztosan módosítod a cikket?"

        document.querySelector("#sendModalBtn")!.innerHTML = "Módosítás"
        document.querySelector("#sendModalBtn")!.className = "btn btn-warning editNews"
    }
}
// TODO: megnézni author-e
else if (!loggedIn || !currentUser.author) Error(401)

document.querySelector("#topic")!.addEventListener("input", () => {
    if (document.querySelector<HTMLInputElement>("#topic")!.value !== "default") document.querySelector<HTMLElement>("#topicError")!.style.display = "none"
})

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
    document.querySelector<HTMLElement>("#imgError")!.style.display = "none"

    const formData = new FormData();
    formData.append('image', file);

    try {
        await fetch('http://localhost:3001/upload-image', {
            method: 'POST',
            body: formData
        }).then(async (res) => {
            filename = (await res.json()).body
            addImgButton.style.display = "none";
            imgContainer.insertAdjacentHTML("beforeend", `<img src="./backend/downloaded/${filename}" id="newsImg">`);
            uploaded = true;
        })
    } catch (err) {
        console.error("Upload failed:", err);
    }
});

document.querySelector("#sendModalBtn")!.addEventListener("click", async () => {
    const topic = document.querySelector<HTMLSelectElement>("#topic")!.value;
    const title = document.querySelector<HTMLInputElement>("#title")!.value;
    const subtitle = document.querySelector<HTMLInputElement>("#subtitle")!.value;
    const content = document.querySelector<HTMLTextAreaElement>("#editorHelper")!.innerHTML;
    const news: News = {
        id: newsId!,
        userId: currentUser.id!,
        createdAt: new Date().toLocaleString(),
        imgURL: filename,
        topic: topic,
        title: title,
        subtitle: subtitle,
        content: content
    }

    if (document.querySelector("#sendModalBtn")!.classList.contains("editNews")) {
        news.createdAt += " (szerkesztve)"
        await EditNews(news).then(() => AddAnimation())
    }
    else await AddNews(news).then(() => AddAnimation())
});

function AddAnimation() {
    document.querySelector("#sendModalBtn")!.innerHTML =
        `
        <div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Betöltés...</span>
        </div>
            `
    setTimeout(() => location.reload(), 800)
}