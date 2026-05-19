import { Nevnapok } from "../api/http"
import type { User } from "../types/User"

document.querySelector("head")!.innerHTML += `<link rel="shortcut icon" href="src/img/logo2.png" type="image/x-icon">`
export async function Navbar() {
    const loggedIn = localStorage.getItem("aktualisUser")
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const nevnapok = await Nevnapok(month, day)
    const [first, second] = nevnapok
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    document.querySelector("#navbar")!.innerHTML = `
        <div id="topBar">
        <p class="m-0">
        <span class="fw-bold">${today.toLocaleString()} </span>
         - ${first}, ${second}
         </p>
        </div>
        `

    if (loggedIn) {
        const user: User = JSON.parse(loggedIn)

        document.querySelector("#navbar")!.innerHTML += `
            <nav class="navbar bg-warning p-0">
                <div class="container-fluid">

                <div class="d-flex" style="min-width: 150px;">
                    <p class="m-0">Keresés</p>
                </div>

                <a href="/" class="d-none d-md-block user-select-none">
                    <img src="src/img/logo.png" style="height:5rem; margin:5px;"/>
                </a>

                <div class="d-flex justify-content-end" style="min-width: 150px;">
                    <div class="btn-group">
                    <button type="button" class="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        ${user.name}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" id="mainDropdown">
                        <li>
                        <a class="dropdown-item" href="profile.html">Profil</a>
                        </li>
                        <li>
                        <button id="logout" class="btn text-primary dropdown-item" style="cursor: pointer;">Kijelentkezés</button>
                        </li>
                    </ul>
                    </div>
                </div>

                </div>
            </nav>
            `
        if (user.author) document.querySelector("#mainDropdown")!.insertAdjacentHTML("afterbegin",
            `
            <li style="justify-self:center;" class="w-75 m-2">
                <a class="btn btn-outline-light fw-bold w-100 text-center" href="edit.html" style="width:3rem;">+</a>
            </li>`
        );

    } else {
        document.querySelector("#navbar")!.innerHTML += `
            <nav class="navbar bg-warning p-0">
                <div class="container-fluid">
                    <div class="d-flex" style="min-width: 150px;">
                        <p class="m-0">Keresés</p>
                    </div>

                    <a href="/" class="d-none d-md-block user-select-none">
                        <img src="src/img/logo.png" style="height:5rem; margin:5px;"/>
                    </a>

                    <div class="d-flex justify-content-end" style="min-width: 150px;">
                        <a class="btn btn-outline-dark" href="signup_login.html">Bejelentkezés</a>
                    </div>
                </div>
            </nav>
        `
    }
    document.getElementById("logout")?.addEventListener("click", () => {
        localStorage.removeItem('aktualisUser');
        window.location.replace("/")
    })
}
