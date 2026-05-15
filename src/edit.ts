import { AddNews } from './api/http';
import './styles/style.css'


let file: File
const input = document.querySelector<HTMLInputElement>('#imgInput')!;
document.querySelector("#imgInput")?.addEventListener("input", async () => {

    if (!input.files) return
    file = input.files[0];

    const formData = new FormData();
    formData.append('image', file);
    await fetch('http://localhost:3000/upload-image', {
        method: 'POST',
        body: formData
    }).then(() => {
        document.querySelector<HTMLElement>("#addImg")!.style.display = "none"
        document.querySelector("#newsImg")!.innerHTML += `
        <img src="./backend/downloaded/${file.name}" class="newsImg">
        `
    })

})


document.querySelector("#sendNews")!.addEventListener("click", () => {
    const title = document.querySelector<HTMLInputElement>("#title")!.value
    const subtitle = document.querySelector<HTMLInputElement>("#subtitle")!.value
    const content = document.querySelector<HTMLTextAreaElement>("#editorHelper")!.innerHTML
    AddNews({
        id: "",
        userId: "1",
        createdAt: new Date().toLocaleString(),
        imgURL: file.name,
        title: title,
        subtitle: subtitle,
        content: content
    })
})