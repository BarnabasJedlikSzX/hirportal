import { GetFormattedDate } from "./getFormattedDate"
import { GetCurrencies, GetWeather, Nevnapok } from "../api/http"
import type { User } from "../types/User"

document.querySelector("head")!.insertAdjacentHTML("beforeend", `
<link rel="shortcut icon" href="src/img/logo2.png" type="image/x-icon">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
`)
document.querySelector("#app")!.insertAdjacentHTML("beforeend", `
    <button type="button" id="scrollToTop"><i class="bi bi-arrow-up-circle-fill"></i></button>
    <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Témák</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <p>asd</p>
  </div>
</div>
    `)
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


async function TopBar() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const nevnapok = await Nevnapok(month, day)
    const [eur, usd] = await GetCurrencies()
    const weather = await GetWeather()

    const [first, second] = nevnapok
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

    document.querySelector("#navbar")!.insertAdjacentHTML("afterbegin", `
        <div id="topBar" class="row container-fluid m-0">
         <p class="m-0 ms-2 col">
         <span class="fw-bold">EUR:</span> ${eur.rates.HUF.toPrecision(5)} FT, <span class="fw-bold">USD:</span> ${usd.rates.HUF.toPrecision(5)} FT
         </p>
         <p class="m-0 col text-center">
         <span class="text-info">${weather.min}°</span> / 
         <span class="text-warning">${weather.max}°</span>
         <span class="fw-bold"> ${weather.description !== "" ? " - " + weather.description : ""}</span>
         </p>
        <p class="m-0 me-2 col text-end">
        <span class="fw-bold">${GetFormattedDate().slice(0, 13)} </span>
         - ${first}, ${second}
         </p>
        
        </div>
        `)
}

export function Navbar() {
    const loggedIn = localStorage.getItem("aktualisUser")
    const user: User = JSON.parse(loggedIn!)
    TopBar()
    document.querySelector("#navbar")!.insertAdjacentHTML("beforeend", `
            <nav class="navbar bg-warning p-0">
                <div class="row container-fluid p-1 py-md-0 px-md-3 m-0">

                <div class="d-flex col p-0">
                    <button class="btn btn-dark px-5" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><span class="me-1">#</span> Témák</button>
                    ${location.pathname === "/index.html" || location.pathname === "/" ? `<button class="btn btn-light ms-3" id="search"><i class="bi bi-search me-1"></i> Keresés</button>` : ""}   
                </div>

                <a href="/" class="d-none d-md-block user-select-none text-center col">
                    <img src="src/img/logo.png" style="height:5rem; margin:5px;"/>
                </a>

                <div class="col text-end p-0">
                   ${loggedIn ?
            `       <div class="dropdown">
                        <button type="button" class="btn btn-dark m-0 fw-bold dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            ${user.name}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end mt-3" id="mainDropdown">
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
            `<a class="btn btn-dark fw-bold" href="signup_login.html">Bejelentkezés</a>`
        }
                </div>

                </div>
            </nav>
            `)
    document.getElementById("logout")?.addEventListener("click", () => {
        localStorage.removeItem('aktualisUser');
        window.location.replace("/")
    })
}