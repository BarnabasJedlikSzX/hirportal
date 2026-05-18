import { Nevnapok } from "../api/http"
import type { User } from "../types/User"

export async function Navbar() {
    const loggedIn = localStorage.getItem("aktualisUser")
    if (location.pathname === "/" || location.pathname.includes("read")) {
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
    }
    if (loggedIn) {
        const user: User = JSON.parse(loggedIn)

        document.querySelector("#navbar")!.innerHTML += `
        <nav class="navbar bg-warning">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Fideszes Hírportál</a>
                <div class="d-flex">
                  <div class="btn-group">
                    <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        ${user.name}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li style="justify-self:center;" class="w-75 m-2">
                            <a class="btn btn-outline-dark fw-bold w-100 text-center" href="edit.html" style="width:3rem;">+</a>
                        </li>
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

    } else {
        document.querySelector("#navbar")!.innerHTML += `
        <nav class="navbar bg-warning">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Fideszes Hírportál</a>
                <div>
                <a class="btn btn-primary" href="signup_login.html">Bejelentkezés</a>
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
