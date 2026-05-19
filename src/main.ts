import './styles/style.css'
import { Navbar } from './components/navbar';
import { GetNews } from './api/http';
import type { News } from './types/News';
import type { User } from "./types/User";
import { topics } from './global/topics';

Navbar()

let data = localStorage.getItem("aktualisUser")

const newsDiv = document.getElementById('news') as HTMLDivElement;
const topicSort = document.getElementById('topicSort') as HTMLDivElement;

let news: News[] = await GetNews();
let sortedNews: News[] = news;
console.log(data)

function render() {
    topic();
    newsRender(sortedNews!);
}
render();

function topic() {
    topicSort.innerHTML = '';
    topicSort.innerHTML += `<span class="m-auto"><button class='btn btn-sm btn-warning adopt-btn' data-id="Összes">Összes</button></span>`;
    topics.forEach(t => {
        topicSort.innerHTML += 
        `
            <span class="m-auto"><button class='btn btn-sm btn-warning adopt-btn' data-id="${t}">${t}</button></span>
        `;
    });
    topicSort.addEventListener('click', (e) => {
        const btn = e.target as HTMLButtonElement;

        const id = btn.dataset.id;

        if (!id) return;

        if (id === "Összes") {
            sortedNews = [];
            sortedNews = news;
        } 
        else {
            sortedNews = [];

            news.forEach(n => {
                if (n.topic === id) {
                    sortedNews.push(n);
                }
            });
        }

        newsRender(sortedNews);
    });
}

function newsRender(updatedNews: News[]) {
    newsDiv.innerHTML = '';
    updatedNews.forEach(n => {
        let canEdit = false;
        let user: User = JSON.parse(data!) as User;
        if (user) {
            if (user.id == n.userId && user.author) {
                canEdit = true;
            }
        }
        const card =
            `
            <div class="card col-lg-4 col-md-6 col-sm-12" style="width: 18rem;">
                <img src="./backend/downloaded/${n.imgURL}" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">${n.title}</h5>
                    <p class="card-text text-success">${n.topic}</p>
                    <p class="card-text">${n.createdAt}</p>
                    <div style='display: flex;'>
                        ${canEdit ? `<a href="edit.html?id=${n.id}" class="btn btn-warning me-5">Szerkeszt</a>` : ''}
                        <a href="read.html?id=${n.id}" class="btn btn-warning" id="${n.id}">Elolvas</a>
                    </div>
                </div>
            </div>
        `;
        // document.getElementById(n.id!)!.addEventListener
        newsDiv.innerHTML += card;
    });
}