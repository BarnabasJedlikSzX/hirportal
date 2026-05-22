import './styles/style.css'
import { Navbar } from './components/navbar';
import { GetNews } from './api/http';
import type { News } from './types/News';
import type { User } from "./types/User";
import { Error } from './components/error';

Navbar()

let loggedIn = localStorage.getItem("aktualisUser")


if (loggedIn) {
    const user: User = JSON.parse(loggedIn)
    if (user.author) {
        const news: News[] = await GetNews();
        document.querySelector("#main")!.insertAdjacentHTML("beforebegin", `<div id="ownNewsContainer"></div>`)

        for (let n of news) {
            if (n.userId === user.id) document.querySelector("#ownNewsContainer")?.insertAdjacentHTML("beforeend", `
                <div class="ownNews">
                ${n.title}
                </div>
                `)
        }
    } else Error(401)



} else Error(401)

