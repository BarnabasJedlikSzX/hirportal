import './styles/style.css'
import { Navbar } from './components/navbar';
import { GetNews } from './api/http';
import type { News } from './types/News';
import type { User } from "./types/User";

document.querySelector("#navbar")!.innerHTML = Navbar()

let author = false
// Itt meg dobja a hibát
let data = localStorage.getItem("aktualisUser")
if (data) {
    let user: User = JSON.parse(data) as User
    author = user.author
    console.log(user)
}

const newsDiv = document.getElementById('news') as HTMLDivElement;

let news: News[] = await GetNews();


function render() {
    newsDiv.innerHTML = '';
    news.forEach(n => {
        let canEdit = false;
        let user: User = JSON.parse(data!) as User;
        if (user) {
            if (user.id == n.userId) {
                canEdit = true;
            }
        }
        const card =
            `
            <div class="card col-lg-4 col-md-6 col-sm-12" style="width: 18rem;">
                <img src="./backend/downloaded/${n.imgURL}" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">${n.title}</h5>
                    <p class="card-text">${n.createdAt}</p>
                    <div style='display: flex;'>
                        ${canEdit ? `<a href="edit.html?id=${n.id}" class="btn btn-primary me-5">Szerkeszt</a>` : ''}
                        <a href="read.html" class="btn btn-primary" id="${n.id}">Elolvas</a>
                    </div>
                </div>
            </div>
        `;
        // document.getElementById(n.id!)!.addEventListener
        newsDiv.innerHTML += card;
    });
}
render();
document.getElementById("logout")?.addEventListener("click", () =>{
    localStorage.removeItem('aktualisUser');
    window.location.reload();
})

