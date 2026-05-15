import type { User } from "./types/User";
import { getUsers, logInUser} from "./api/signup_login.api";

let users: User[] = await getUsers();
let body = document.getElementById("body") as HTMLDivElement
let loggedInUser: User[] = []

function LoadPage(){
    body.innerHTML += `<div>
            <h1>Bejelentkezés</h1>
            
            <label for="email">E-mail</label>
            <input name="email" id="email" type="text">
            
            <label for="pwd">Jelszó</label>
            <input name="pwd" id="pwd" type="text">

            <button id="login">Bejelentkezés</button>
        </div>
        <div>
            <h1>Regisztráció</h1>
            
            <label for="name">Név</label>
            <input name="name" id="name" type="text">
            
            <label for="email-r">E-mail</label>
            <input name="email-r" id="email-r" type="text">
            
            <label for="pwd-r1">Jelszó</label>
            <input name="pwd-r1" id="pwd-r1" type="text">
            
            <label for="pwd-r2">Jelszó mégegyszer</label>
            <input name="pwd-r2" id="pwd-r2" type="text">

            <button id="signup">Regisztráció</button>
        </div>`
    document.getElementById("login")?.addEventListener("click", async () =>{
        let email = (document.getElementById("email") as HTMLInputElement).value
        let password = (document.getElementById("pwd") as HTMLInputElement).value
        let foundUser = users.find(m => m.email == email && m.password == password)
        if (foundUser != undefined){
            //Itt állítja true-ra
            await logInUser(foundUser.id!)
            console.log(foundUser.id)

            // Ezt kéne exportálni, de hát írtam hogy mi szar
            loggedInUser = users.filter(u => u.logged == true)
        }
        else{
            //TODO: hibaüzenet
            console.log("nope")
        }

    })
    document.getElementById("signup")?.addEventListener("click", () =>{
        
    })
}

LoadPage() 
export default loggedInUser
