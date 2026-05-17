import type { User } from "./types/User";
import { getUsers, createUser} from "./api/user_handler";
import { Navbar } from './components/navbar';

let users: User[] = await getUsers();
let body = document.getElementById("body") as HTMLDivElement
let data = localStorage.getItem("aktualisUser")
if (data) {
    window.location.replace("http://localhost:5173/")
}


function LoadPage(){
        body.innerHTML += `
            <div id="login">
                <h1>Bejelentkezés</h1>

                <label for="email">E-mail</label>
                <input name="email" class="email" type="text">

                <label for="pwd">Jelszó</label>
                <input name="pwd" class="pwd" type="text">

                <button id="loginbtn">Bejelentkezés</button>
            </div>
            <div id="signup">
                <h1>Regisztráció</h1>

                <label for="name">Felhasználó név</label>
                <input name="name" class="name" type="text">

                <label for="email-r">E-mail</label>
                <input name="email-r" class="email" type="text">

                <label for="pwd-r1">Jelszó</label>
                <input name="pwd-r1" id="pwd1">

                <label for="pwd-r2">Jelszó mégegyszer</label>
                <input name="pwd-r2" id="pwd2">

                <button id="signupbtn">Regisztráció</button>
                <br>
                <br>
                <p>asd@gmail.com</p>
                <p>bela@gmail.com</p>
                <p>qwerty</p>
            </div>`

        let loginDiv = document.getElementById("login");
        let signupDiv = document.getElementById("signup");

        document.querySelector("#navbar")!.innerHTML = Navbar()
        document.getElementById("loginbtn")?.addEventListener("click", async () =>{
            
            let email = (loginDiv?.querySelector(".email") as HTMLInputElement).value
            let password = (loginDiv?.querySelector(".pwd") as HTMLInputElement).value
            if (emailValidForma(email) && emailFoglalt(email)){
                let foundUser = users.find(m => m.email == email && m.password == password)
                console.log(foundUser)
                if (foundUser != undefined){
                    saveAndContinue(foundUser)
                }
                else{
                    //TODO: hibaüzenet
                    console.log("nope")
                }
                
            }

        })
        document.getElementById("signupbtn")?.addEventListener("click", async () =>{
            
            let name = (signupDiv?.querySelector(".name") as HTMLInputElement).value
            let email = (signupDiv?.querySelector(".email") as HTMLInputElement).value
            let pwd1 = (signupDiv?.querySelector("#pwd1") as HTMLInputElement).value
            let pwd2 = (signupDiv?.querySelector("#pwd2") as HTMLInputElement).value
            
            if (emailValidForma(email) == false){
                console.log("szar email formátum")
                //hibaüzenet
            }
            if(emailFoglalt(email) == true){
                console.log("foglalt email")
                //hibaüzenet
            }
            if(pwd1 != pwd2){
                console.log("jelszók nem egyeznek")
                //hibaüzenet
            }
            if (emailValidForma(email) && !emailFoglalt(email) && pwd1 === pwd2){
                console.log("minden fasza")
                let newUser: User = {
                    name: name,
                    email: email,
                    password: pwd1,
                    author: false
                }
                let savedUser: User = await(createUser(newUser))
                saveAndContinue(savedUser)
            }

            
        })
}
LoadPage()


function emailValidForma(email: string): boolean {
  // Szabványos, megbízható e-mail formátum ellenőrző reguláris kifejezés
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function emailFoglalt(email: string): boolean {
    let hasonlo = users.find(m => m.email == email)
    if (hasonlo){
        return true
    }
    else{
        return false
    }
}

function saveAndContinue(user: User){
    window.globalisUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        author: user.author
    }
    console.log(window.globalisUser)
    localStorage.setItem("aktualisUser", JSON.stringify(window.globalisUser));
    window.location.replace("http://localhost:5173/")
}