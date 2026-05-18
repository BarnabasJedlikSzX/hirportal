import type { User } from "./types/User";
import { getUsers, createUser } from "./api/user_handler";
import { Navbar } from './components/navbar';

let users: User[] = await getUsers();
let body = document.getElementById("body") as HTMLDivElement
let data = localStorage.getItem("aktualisUser")
if (data) {
    window.location.replace("/")
}


function LoadPage() {
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
            </div>
            <div id="errors">
                
            </div>
            <div id="success">
            </div>`

    let loginDiv = document.getElementById("login");
    let signupDiv = document.getElementById("signup");
    let succesDiv = document.getElementById("success") as HTMLDivElement

    Navbar()
    document.getElementById("loginbtn")?.addEventListener("click", async () => {

        let email = (loginDiv?.querySelector(".email") as HTMLInputElement).value
        let password = (loginDiv?.querySelector(".pwd") as HTMLInputElement).value
        let foundUser = users.find(m => m.email == email && m.password == password)
        if (loginValidation(email, password, foundUser) && foundUser != undefined) {
            succesDiv.innerHTML += "Sikeres bejelentkezés!"
            await showSuccess()
            saveAndContinue(foundUser)
        }

    })
    document.getElementById("signupbtn")?.addEventListener("click", async () => {

        let name = (signupDiv?.querySelector(".name") as HTMLInputElement).value
        let email = (signupDiv?.querySelector(".email") as HTMLInputElement).value
        let pwd1 = (signupDiv?.querySelector("#pwd1") as HTMLInputElement).value
        let pwd2 = (signupDiv?.querySelector("#pwd2") as HTMLInputElement).value

        signinValidation(email, name, pwd1, pwd2)
        

        if (emailValidForma(email) && !emailFoglalt(email) 
            && pwd1 === pwd2 && !inputNotFilled([email, name, pwd1, pwd2])) {
            let newUser: User = {
                name: name,
                email: email,
                password: pwd1,
                author: false
            }
            if (await createUser(newUser)){
                succesDiv.innerHTML += "Sikeres regisztrálás!"
                await showSuccess()
                saveAndContinue(newUser)
            }
            
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
    if (hasonlo) {
        return true
    }
    else {
        return false
    }
}

function saveAndContinue(user: User) {
    window.globalisUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        author: user.author
    }

    localStorage.setItem("aktualisUser", JSON.stringify(window.globalisUser));
    window.location.replace("/")
}

function inputNotFilled(inputs: string[]): boolean{
    let emptyInput = false;
    inputs.forEach(input =>{
        if (!input && input.trim() == ""){
            emptyInput = true
        }
    })
    return emptyInput
}

function showError(errortexts: string[]){
    let errorArea = document.getElementById("errors") as HTMLParagraphElement
    errorArea.innerHTML = ""
    errortexts.forEach(error =>{
        let errorParag = document.createElement("p")
        errorParag.innerText += `${error}`
        errorArea.appendChild(errorParag)
    })
}

function signinValidation(email: string, name: string, pwd1: string, pwd2: string){
    let errors: string[] = []
    if (inputNotFilled([email, name, pwd1, pwd2])){
        errors.push("Mezők kitöltése kötelező")
    }

    if (!inputNotFilled([email, name, pwd1, pwd2])){
        if (emailValidForma(email) == false) {
            errors.push("Nem megfelelő e-mail formátum")
                //hibaüzenet
        }
        if (emailFoglalt(email) == true) {
            errors.push("E-mail használatban")    
            //hibaüzenet
        }
        if (pwd1 != pwd2) {
            errors.push("Nem egyező jelszavak")
        }
    }
    showError(errors)
}

function loginValidation(email: string, name: string, foundUser: User | undefined): boolean{
    let errors: string[] = []
    if (inputNotFilled([email, name])){
        errors.push("Mezők kitöltése kötelező")
    }

    if (!inputNotFilled([email, name])){
        if (emailValidForma(email) == false) {
            errors.push("Nem megfelelő e-mail formátum")
                //hibaüzenet
        }
        if (foundUser == undefined) {
            errors.push("Hibás email cím vagy jelszó")
        }
    }
    showError(errors)
    if(errors.length == 0){
        return true
    }
    else{ return false}
}

async function showSuccess(){
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await delay(2000);  
} 