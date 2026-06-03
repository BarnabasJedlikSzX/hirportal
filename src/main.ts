import './styles/style.css'
import { Navbar } from './components/navbar';
import { GetNews } from './api/http';
import type { News } from './types/News';
import type { User } from "./types/User";
import { topics } from './global/topics';
import { LatestNews } from './components/latestNews';
import { showPopup } from './components/popup';
import { showSuccess } from './components/user_validations';

Navbar()
LatestNews()

let data = localStorage.getItem("aktualisUser");


const newsDiv = document.getElementById('news') as HTMLDivElement;
const topicSort = document.getElementById('topicSort') as HTMLDivElement;

let news: News[] = await GetNews();
let sortedNews: News[] = news;

function render() {
    const savedTopic = localStorage.getItem("topic");

    if (savedTopic) {
        sortedNews = news.filter(n => n.topic === savedTopic);
        localStorage.removeItem("topic");
    }

    topic();
    newsRender(sortedNews!);
}
render();

function topic() {
    topicSort.innerHTML = '';
    topicSort.innerHTML += `<span class="m-auto"><button class='btn btn-sm btn-outline-warning adopt-btn' data-id="Összes">Összes</button></span>`;
    topics.forEach(t => {
        topicSort.innerHTML +=
            `
            <span class="m-auto"><button class='btn btn-sm btn-outline-warning adopt-btn' data-id="${t}">${t}</button></span>
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
    newsDiv.classList.add('mt-2');
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
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div class="glass-card h-100">
                    <a href="read.html?id=${n.id}" class="glass-link text-decoration-none">
                        <div class="glass-image">
                            <img src="./backend/downloaded/${n.imgURL}" alt="">
                            <div class="glass-overlay"></div>
                        </div>
                        <div class="glass-body">
                            <span class="glass-badge">#${n.topic}</span>
                            <h5 class="glass-title">
                                ${n.title}
                            </h5>
                            <div class="glass-meta">
                                ${n.createdAt}
                            </div>
                        </div>
                    </a>
                    ${canEdit ? `
                    <div class="glass-footer">
                        <a href="edit.html?id=${n.id}" class="glass-btn">
                        <i class="bi bi-pen me-1"></i> Szerkesztés
                        </a>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        newsDiv.innerHTML += card;
    });
}

let counter = 1;

document.getElementById('search')!.addEventListener('click', () => {
    counter++;
    const searchBar = document.getElementById('searchBar') as HTMLDivElement;
    searchBar.innerHTML =
        `
    <div class="container my-5 d-flex flex-column align-items-center justify-content-center gap-2 mt-5">
        <input type="text" class="form-control w-50" placeholder="Keresés" id="searchValue">
        <button class="btn btn-secondary" id="search-btn">Keresés</button>
    </div>
    `;
    if (counter % 2 == 0) searchBar.style.display = 'block';
    else searchBar.style.display = 'none';


    document.getElementById('search-btn')!.addEventListener('click', async () => {
        sortedNews = [];
        const searchValue = (document.getElementById('searchValue') as HTMLInputElement).value;
        news.forEach(n => {
            if ((n.content.toLowerCase()).includes(searchValue.toLowerCase()) ||
                (n.subtitle.toLowerCase()).includes(searchValue.toLowerCase()) ||
                (n.title.toLowerCase()).includes(searchValue.toLowerCase())) {
                sortedNews.push(n);
            }
        });
        if (sortedNews.length === 0) {
            await showPopup({
                title: "Nincs ilyen hír",
                message: undefined,
                duration: 2000
            })
            await showSuccess(1500)
        }
        newsRender(sortedNews);
    });
});
