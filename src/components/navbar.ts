import type { User } from "../types/User"

export function Navbar() {
    const loggedIn = localStorage.getItem("aktualisUser")

    if (loggedIn) {
        const user: User = JSON.parse(loggedIn)

        document.querySelector("#navbar")!.innerHTML = `
        <nav class="navbar bg-warning">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Fideszes Hírportál</a>
                <button id="logout" class="btn btn-primary">Kijelentkezés</button>
                <div>${user.name}</div>
            </div>
        </nav>
        `

    } else {
        document.querySelector("#navbar")!.innerHTML = `
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
