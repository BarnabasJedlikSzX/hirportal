import { AddNews, GetNews } from './api/http';
import { Navbar } from './components/navbar';
import './styles/style.css'
import type { News } from './types/News';

document.querySelector("#navbar")!.innerHTML = Navbar()

let filename: string = ""
let uploaded = false
const input = document.querySelector<HTMLInputElement>('#imgInput')!;
const imgContainer = document.querySelector("#imgContainer")!;
const deleteBtn = document.querySelector<HTMLElement>("#deleteUpload")!;
const addImgButton = document.querySelector<HTMLElement>("#addImgButton")!;
const news: News[] = await GetNews()

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
    document.querySelector(".newsImg")?.remove();
});

input.addEventListener("click", () => {
    input.value = "";
});

input.addEventListener("change", async () => {
    if (!input.files) return;
    const file = input.files[0];
    if (!file) return;

    filename = news.length + 1 + "." + file.name.split(".")[1];

    const renamedFile = new File([file], filename, { type: file.type });
    const formData = new FormData();
    formData.append('image', renamedFile);

    try {
        await fetch('http://localhost:3001/upload-image', {
            method: 'POST',
            body: formData
        });

        addImgButton.style.display = "none";
        imgContainer.insertAdjacentHTML("beforeend", `<img src="./backend/downloaded/${filename}" class="newsImg">`);
        uploaded = true;
    } catch (err) {
        console.error("Upload failed:", err);
    }
});

document.querySelector("#sendNews")!.addEventListener("click", async () => {
    const title = document.querySelector<HTMLInputElement>("#title")!.value;
    const subtitle = document.querySelector<HTMLInputElement>("#subtitle")!.value;
    const content = document.querySelector<HTMLTextAreaElement>("#editorHelper")!.innerHTML;

    await AddNews({
        id: "",
        userId: JSON.parse(sessionStorage.getItem("aktualisUser")!).id,
        createdAt: new Date().toLocaleString(),
        imgURL: filename,
        title: title,
        subtitle: subtitle,
        content: content
    });

    location.reload();
});