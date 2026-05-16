import type { User } from "../types/User"

export function Navbar() {
    const loggedIn = sessionStorage.getItem("aktualisUser")

    if (loggedIn) {
        const user:User = JSON.parse(loggedIn)

        return `
        <nav class="navbar bg-warning">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">Fideszes Hírportál</a>
                <div>Bejelentkezve: ${user.name}</div>
            </div>
        </nav>
        `
    } else {
        return `
        <nav class="navbar bg-warning">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">Fideszes Hírportál</a>
                <div>
                <a class="btn btn-primary" href="signup_login.html">Bejelentkezés</a>
                <a class="btn btn-light" href="signup_login.html">Regisztráció</a>
                </div>
            </div>
        </nav>
    `
    }

}
