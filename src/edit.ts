import { AddNews, GetNews } from './api/http';
import { Navbar } from './components/navbar';
import './styles/style.css'
import type { News } from './types/News';

document.querySelector("#navbar")!.innerHTML = Navbar()
const news: News[] = await GetNews()
let filename: string = ""
const input = document.querySelector<HTMLInputElement>('#imgInput')!;
document.querySelector("#imgInput")?.addEventListener("input", async () => {

    if (!input.files) return
    const file = input.files[0];
    filename = news.length + 1 + "." + file.name.split(".")[1]

    const renamedFile = new File([file], filename, { type: file.type });
    const formData = new FormData();
    formData.append('image', renamedFile);
    await fetch('http://localhost:3001/upload-image', {
        method: 'POST',
        body: formData
    }).then(() => {
        document.querySelector<HTMLElement>("#addImg")!.style.display = "none"
        document.querySelector("#newsImg")!.innerHTML += `
        <img src="./backend/downloaded/${filename}" class="newsImg">
        `
    })

})


document.querySelector("#sendNews")!.addEventListener("click", () => {
    const title = document.querySelector<HTMLInputElement>("#title")!.value
    const subtitle = document.querySelector<HTMLInputElement>("#subtitle")!.value
    const content = document.querySelector<HTMLTextAreaElement>("#editorHelper")!.innerHTML
    AddNews({
        id: "",
        userId: JSON.parse(sessionStorage.getItem("aktualisUser")!).id,
        createdAt: new Date().toLocaleString(),
        imgURL: filename,
        title: title,
        subtitle: subtitle,
        content: content
    })

    location.reload()
})