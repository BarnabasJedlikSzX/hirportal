import { GetNewsById } from './api/http';
import { getUsers } from './api/user_handler';
import { Error } from './components/error';
import { Navbar } from './components/navbar';
import './styles/style.css'
import type { News } from './types/News';
import type { User } from './types/User';
import { marked } from "marked";
await Navbar()

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
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-8">

                <h1 class="fw-bold mb-2">${n.title}</h1>

                <h5 class="text-muted mb-3">
                    ${n.subtitle}
                </h5>

                <div class="d-flex gap-2 text-secondary small mb-3">
                    <span>${n.createdAt}</span>
                    <span>•</span>
                    <span>Szerző: ${author!.name}</span>
                </div>

                <img src="./backend/downloaded/${n.imgURL}" alt="${n.title}" class="img-fluid mb-4 rounded">

    
                <div class="fs-5 lh-lg">
                ${marked.parse(n.content)}
                </div>
            </div>
        </div>
    </div>
    `;
}
