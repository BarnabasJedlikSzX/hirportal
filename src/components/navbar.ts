import { GetCurrencies, GetWeather, Nevnapok } from "../api/http"
import type { User } from "../types/User"

document.querySelector("head")!.innerHTML += `
<link rel="shortcut icon" href="src/img/logo2.png" type="image/x-icon">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
`
document.querySelector("#app")!.innerHTML += `<button type="button" id="scrollToTop"><i class="bi bi-arrow-up-circle-fill"></i></button>`
export async function Navbar() {
    const loggedIn = localStorage.getItem("aktualisUser")

    const [eur, usd] = await GetCurrencies()
    const weather = await GetWeather()
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const nevnapok = await Nevnapok(month, day)
    const [first, second] = nevnapok
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            document.querySelector<HTMLElement>("#scrollToTop")!.style.scale = "1"
            document.querySelector<HTMLElement>("#navbar")!.style.opacity = "0"
            document.querySelector<HTMLElement>("#navbar")!.style.pointerEvents = "none"
        }
        else {
            document.querySelector<HTMLElement>("#scrollToTop")!.style.scale = "0"
            document.querySelector<HTMLElement>("#navbar")!.style.pointerEvents = "all"
            document.querySelector<HTMLElement>("#navbar")!.style.opacity = "1"
        }
    })



    document.querySelector("#scrollToTop")!.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    document.querySelector("#navbar")!.innerHTML = `
        <div id="topBar" class="d-flex justify-content-between">
         <p class="m-0 ms-3">
         <span class="fw-bold">EUR:</span> ${eur.rates.HUF.toPrecision(5)} FT, <span class="fw-bold">USD:</span> ${usd.rates.HUF.toPrecision(5)} FT
         </p>
         <p class="m-0">
         <span class="text-info">${weather.min}°</span> / 
         <span class="text-warning">${weather.max}°</span>
         <span class="fw-bold"> - ${weather.description}</span>
         </p>
        <p class="m-0 me-3">
        <span class="fw-bold">${today.toLocaleString()} </span>
         - ${first}, ${second}
         </p>
        
        </div>
        `
    const user: User = JSON.parse(loggedIn!)

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
                   ${loggedIn ?
            `<div class="btn-group">
                    <button type="button" class="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        ${user.name}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" id="mainDropdown">
                        ${user.author ?
                `
                        <li style="justify-self:center;" class="w-75 m-2">
                            <a class="btn btn-outline-light fw-bold w-100 text-center" href="edit.html" style="width:3rem;">+</a>
                        </li>`: ""
            }
                        <li>
                        <a class="dropdown-item" href="profile.html">Profil</a>
                        </li>
                        <li>
                        <button id="logout" class="btn text-primary dropdown-item" style="cursor: pointer;">Kijelentkezés</button>
                        </li>
                    </ul>
                    </div>`
            :
            `<a class="btn btn-outline-dark" href="signup_login.html">Bejelentkezés</a>`
        }
                </div>

                </div>
            </nav>
            `



    document.getElementById("logout")?.addEventListener("click", () => {
        localStorage.removeItem('aktualisUser');
        window.location.replace("/")
    })
}
