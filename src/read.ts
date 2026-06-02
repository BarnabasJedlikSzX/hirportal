import { GetNewsById } from './api/http';
import { getUsers } from './api/user_handler';
import { Comments } from './components/comments';
import { Error } from './components/error';
import { Navbar } from './components/navbar';
import './styles/style.css'
import type { News } from './types/News';
import type { User } from './types/User';
import { marked } from "marked";

Navbar()
Comments()

let users: User[] = await getUsers()


const mainDiv = document.getElementById('main') as HTMLDivElement;

const params = new URLSearchParams(window.location.search);
const newsID = params.get('id');
let currentlyReading: News | string = await GetNewsById(newsID!);





if (newsID) {
    if ((typeof currentlyReading) === "string") Error(404)
    else render(currentlyReading)
}

function render(n: News) {
    let author: User;
    users.forEach(u => {
        if (u.id == n.userId) {
            author = u
        }
    });
    mainDiv.innerHTML = `
    <h1 class="text-center mb-2">${n.title}</h1>
    <img src="./backend/downloaded/${n!.imgURL}" alt="${n!.title}" class="mb-3">

    <hr>

    <div class="d-flex align-items-center gap-2 text-secondary small mb-3">
        <span>${n.createdAt}</span>
        <span>•</span>
        <img src="./backend/downloaded/${author!.profilPictureSrc}" alt="${author!.name}" class="rounded-circle" style="width:28px;height:28px;object-fit:cover;">
        <span>Szerző: <b>${author!.name}</b></span>
        <span>•</span>
        <span>Téma:
        <b class="text-success">
            <a href="index.html">${n.topic}</a>
        </b>
        </span>
    </div>

    <hr>

        <div class="fs-5 lh-lg">
                ${marked.parse(n.content)}
        </div>
        </div>
        </div>
    </div>
    `;

    document.getElementById(n.topic)!.addEventListener('click', () => {
        localStorage.setItem('topic', n.topic);
    });
}
