import './styles/style.css'
const input = document.querySelector<HTMLInputElement>('#imgInput')!;
document.querySelector("#imgInput")?.addEventListener("change", async () => {

    if (!input.files) return
    const filename = input.files![0].name
    const file = input.files[0];

    const formData = new FormData();
    formData.append('image', file);
    await fetch('http://localhost:3000/upload-image', {
        method: 'POST',
        body: formData
    }).then(() => {

        document.querySelector("#app")!.innerHTML += `
        <img src="./backend/downloaded/${filename}">
        `
    })

})