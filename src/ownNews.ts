import './styles/style.css'
import { Navbar } from './components/navbar';
import { DeleteNews, GetNews } from './api/http';
import type { News } from './types/News';
import type { User } from "./types/User";
import { Error } from './components/error';

Navbar()

let loggedIn = localStorage.getItem("aktualisUser")


if (loggedIn) {
    const user: User = JSON.parse(loggedIn)
    if (user.author) {
        let newsId = ""
        const news: News[] = await GetNews();
        news.reverse()
        document.querySelector("#main")!.insertAdjacentHTML("afterbegin", `
            
            <div id="ownNewsContainer"></div>
             <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="label" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="label">Megerősítés</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Biztosan törlöd a cikket?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
              <button type="button" class="btn btn-danger" id="deleteModalBtn" style="width: 6.6rem;">Hír
                törlése</button>
            </div>
          </div>
        </div>
      </div>
            `)

        for (let n of news) {
            if (n.userId === user.id) document.querySelector("#ownNewsContainer")?.insertAdjacentHTML("beforeend", `
                <div class="ownNews d-flex justify-content-between">
                    <a class="text-decoration-none d-flex text-white align-items-center w-100" href="read.html?id=${n.id}">
                        <img src="./backend/downloaded/${n.imgURL}" class="ownNewsImg">
                            <div>
                                <p class="badge text-info m-0 p-0"># ${n.topic}</p>
                                <p class="fw-bold m-0">${n.title}</p>
                                <p class="text-secondary m-0">${n.subtitle}</p>
                                <p class="badge bg-primary m-0">${n.createdAt}</p>

                            </div>
                    </a>
                    <div class="d-flex w-25 justify-content-end">
                    <a class="btn btn-outline-warning w-50 me-3" href="edit.html?id=${n.id}"><i class="bi bi-pen-fill"></i></a>
                    <button class="btn btn-outline-danger deleteBtn" data-bs-toggle="modal" data-bs-target="#deleteModal" data-newsId="${n.id}"><i class="bi bi-trash3-fill"></i></button>
                    </div>
                
                    </div>
                `)
        }


        document.querySelectorAll<HTMLElement>(".deleteBtn").forEach((btn) => {
            btn.addEventListener("click", () => {
                newsId = (btn.attributes as any)["data-newsId"].textContent
            })
        })

        document.querySelector("#deleteModalBtn")!.addEventListener("click", async () => {
            await DeleteNews(newsId).then(() => {
                document.querySelector("#deleteModalBtn")!.innerHTML =
                    `
        <div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Betöltés...</span>
        </div>
            `
                setTimeout(() => location.reload(), 800)
            })
        })

    } else Error(401)



} else Error(401)

