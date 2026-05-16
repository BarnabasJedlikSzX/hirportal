import './styles/style.css'
import { Navbar } from './components/navbar';
import { GetNews } from './api/http';
import type { News } from './types/News';

document.querySelector("#navbar")!.innerHTML = Navbar()

// Itt meg dobja a hibát
let sessionData = sessionStorage.getItem("aktualisUser")
if (sessionData) {
    let user = JSON.parse(sessionData)
    console.log(user)
}

const newsDiv = document.getElementById('news') as HTMLDivElement;

let news: News[] = await GetNews();

function render() {
    newsDiv.innerHTML = '';
    news.forEach(n => {
        const card =
            `
            <div class="card col-lg-4 col-md-6 col-sm-12" style="width: 18rem;">
                <img src="${n.imgURL}" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">${n.title}</h5>
                    <p class="card-text">${n.createdAt}</p>
                    <div style='display: flex;'>
                        <a href="edit.html" class="btn btn-primary me-5">Szerkeszt</a>
                        <a href="TODO" class="btn btn-primary">Elolvas</a>
                    </div>
                </div>
            </div>
        `;
        newsDiv.innerHTML += card;
    });
}
render();