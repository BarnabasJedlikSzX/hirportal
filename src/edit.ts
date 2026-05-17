import { AddNews, EditNews, GetNewsById } from './api/http';
import { Navbar } from './components/navbar';
import './styles/style.css'
import type { News } from './types/News';
import type { User } from './types/User';

document.querySelector("#navbar")!.innerHTML = Navbar()

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

if (newsId) {
    if ((typeof editNews) === "string") document.querySelector("#main")!.innerHTML = `<h2>404 Not found</h2>`
    else if (!loggedIn || (currentUser.id !== editNews.userId)) document.querySelector("#main")!.innerHTML = `<h2>401 Unauthorized</h2>`
    else {
        document.querySelector<HTMLInputElement>("#title")!.value = editNews.title
        document.querySelector<HTMLInputElement>("#subtitle")!.value = editNews.subtitle
        document.querySelector<HTMLInputElement>("#editorHelper")!.innerHTML = editNews.content

        addImgButton.style.display = "none";
        imgContainer.insertAdjacentHTML("beforeend", `<img src="./backend/downloaded/${editNews.imgURL}" id="newsImg">`);
        uploaded = true;


        document.querySelector("#sendNews")!.innerHTML = "Módosítás"
        document.querySelector("#sendNews")!.className = "btn btn-warning w-100"

        document.querySelector(".modal-body")!.innerHTML = "Biztosan módosítod a cikket?"

        document.querySelector("#sendModalBtn")!.innerHTML = "Módosítás"
        document.querySelector("#sendModalBtn")!.className = "btn btn-warning editNews"
    }
}
// TODO: megnézni author-e
else if (!loggedIn) document.querySelector("#main")!.innerHTML = `<h2>401 Unauthorized</h2>`

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
    const title = document.querySelector<HTMLInputElement>("#title")!.value;
    const subtitle = document.querySelector<HTMLInputElement>("#subtitle")!.value;
    const content = document.querySelector<HTMLTextAreaElement>("#editorHelper")!.innerHTML;


    if (document.querySelector("#sendModalBtn")!.classList.contains("editNews")) {
        await EditNews({
            id: newsId!,
            userId: currentUser.id!,
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
            userId: currentUser.id!,
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

document.getElementById("logout")?.addEventListener("click", () =>{
    localStorage.removeItem('aktualisUser');
    window.location.replace("http://localhost:5173/")

})