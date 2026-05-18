import './styles/style.css'
import './styles/signup_login.css'
import type { User } from "./types/User";
import { getUsers, createUser, getNewUser } from "./api/user_handler";
import { Navbar } from './components/navbar';
import {emailFoglalt, emailValidForma, saveAndContinue, inputNotFilled, showError, showSuccess} from './components/user_validations'

let users: User[] = await getUsers();
let body = document.getElementById("body") as HTMLDivElement
let data = localStorage.getItem("aktualisUser")
if (data) {
    window.location.replace("/")
}


function LoadPage() {
    Navbar()
    body.classList += "container"
    body.innerHTML += `
    <form id="login">
            <div id="errors"></div>
            <div id="success"></div>
            <h1>Bejelentkezés</h1>
            <div>
            
                <label for="email">E-mail</label>
                <input name="email" class="email" type="text">
            </div>
            
            <div>
                <label for="pwd">Jelszó</label>
                <input id="pwd" name="pwd" type="password">
                <input class="pwd" type="checkbox">
            </div>
            <a class="btn btn-outline-primary" id="loginbtn">Bejelentkezés</a>
        </form>

        <form id="signup">
                <h1>Regisztráció</h1>
                <div>
                    <label for="name">Felhasználó név</label>
                    <input name="name" class="name" type="text">
                </div>

                <div>
                    <label for="email-r">E-mail</label>
                    <input name="email-r" class="email" type="text">
                </div>
                
                <div>
                    <label for="pwd-r1">Jelszó</label>
                    <div>
                        <input name="pwd-r1" id="pwd1" type="password">
                        <input class="pwd1" type="checkbox">
                    </div>
                </div>
                
                <div>
                    <label for="pwd-r2">Jelszó mégegyszer</label>
                    <div>
                        <input name="pwd-r2" id="pwd2" type="password">
                        <input class="pwd2" type="checkbox">
                    </div>
                </div>



                <a id="signupbtn" class="btn btn-outline-primary">Regisztráció</a>
                <br>
                <br>
                <p>asd@gmail.com</p>
                <p>bela@gmail.com</p>
                <p>qwerty</p>
            </div>
        </from>`

    let loginDiv = document.getElementById("login");
    let loginInputs: HTMLInputElement[] = [...document.getElementById("login")!.querySelectorAll("input")] as HTMLInputElement[]

    let signupDiv = document.getElementById("signup");
    let signupInputs: HTMLInputElement[] = [...document.getElementById("signup")!.querySelectorAll("input")] as HTMLInputElement[]

    let succesDiv = document.getElementById("success") as HTMLDivElement


    passwordVisible([loginDiv?.querySelector("#pwd") as HTMLInputElement, signupDiv?.querySelector("#pwd1") as HTMLInputElement, signupDiv?.querySelector("#pwd2") as HTMLInputElement])

    document.getElementById("loginbtn")?.addEventListener("click", async () => {

        let email = (loginDiv?.querySelector(".email") as HTMLInputElement).value
        let password = (loginDiv?.querySelector("#pwd") as HTMLInputElement).value
        let foundUser = users.find(m => m.email == email && m.password == password)
        console.log(foundUser)
        if (loginValidation(loginInputs, foundUser) && foundUser != undefined) {
            succesDiv.innerHTML += "Sikeres bejelentkezés!"
            await showSuccess()
            saveAndContinue(foundUser)
            window.location.replace("/")

        }

    })

    document.getElementById("signupbtn")?.addEventListener("click", async () => {
        let name = (signupDiv?.querySelector(".name") as HTMLInputElement).value
        let email = (signupDiv?.querySelector(".email") as HTMLInputElement).value
        let pwd1 = (signupDiv?.querySelector("#pwd1") as HTMLInputElement).value
        let pwd2 = (signupDiv?.querySelector("#pwd2") as HTMLInputElement).value
        

        signinValidation(signupInputs)
        

        if (emailValidForma(email) && !emailFoglalt(email, users) 
            && pwd1 === pwd2 && !inputNotFilled(signupInputs)) {
            let newUser: User = {
                name: name,
                email: email,
                password: pwd1,
                author: false
            }
            if (await createUser(newUser)){
                succesDiv.innerHTML += "Sikeres regisztrálás!"
                newUser = await getNewUser(newUser)
                console.log(newUser)
                await showSuccess()
                saveAndContinue(newUser)
                window.location.replace("/")

            }
            
        }


    })
}
LoadPage()




function signinValidation(inputs: HTMLInputElement[]): Object{
    let email = (inputs.find(i => i.classList.contains("email")) as HTMLInputElement).value
    let pwd1 = (inputs.find(i => i.id == "pwd1") as HTMLInputElement).value
    let pwd2 = (inputs.find(i => i.id == "pwd2") as HTMLInputElement).value

    let errors: string[] = []
    if (inputNotFilled(inputs)){
        errors.push("Mezők kitöltése kötelező")
    }

    if (!inputNotFilled(inputs)){
        if (emailValidForma(email) == false) {
            errors.push("Nem megfelelő e-mail formátum")
                //hibaüzenet
        }
        if (emailFoglalt(email, users) == true) {
            errors.push("E-mail használatban")    
            //hibaüzenet
        }
        if (pwd1 != pwd2) {
            errors.push("Nem egyező jelszavak")
        }
    }
    showError(errors)
    return {}
}

function loginValidation(inputs: HTMLInputElement[], foundUser: User | undefined): boolean{
    let email = (inputs.find(i => i.classList.contains("email")) as HTMLInputElement).value

    let errors: string[] = []
    if (inputNotFilled(inputs)){
        errors.push("Mezők kitöltése kötelező")
    }

    if (!inputNotFilled(inputs)){
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



function passwordVisible(passwordInputs: HTMLInputElement[]) {
    passwordInputs.forEach(input =>{
        let checkBox = document.querySelector(`.${input.id}`)
        if (checkBox != null){
            checkBox.addEventListener("change", ()=>{
                console.log("szex")
                if (input.type === "password") {
                    input.type = "text";    
                } else {
                    input.type = "password"; 
                }
            })
        }
    })
    
}