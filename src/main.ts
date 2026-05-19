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
console.log(data)

function render() {
    topic();
    newsRender();
}
render();

function topic() {
    topicSort.innerHTML = '';
    let counter = 0;
    topics.forEach(t => {
        counter++;
        topicSort.innerHTML += 
        `
            <span class="m-auto" id="${counter}">${t}</span>
        `;
    });
}

function newsRender() {
    newsDiv.innerHTML = '';
    news.forEach(n => {
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