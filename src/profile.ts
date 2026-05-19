import type { User } from "./types/User";
import { getUser, getUsers, updateUser } from "./api/user_handler";
import { Navbar } from './components/navbar';
import {emailFoglalt, emailValidForma, saveAndContinue, inputNotFilled, showError, showSuccess} from './components/user_validations'


let users: User[] = await getUsers();
let data = localStorage.getItem("aktualisUser")
if (!data) {
    window.location.replace("/")
}

let loggedIn: User = JSON.parse(data!) as User;
let user: User = await getUser(loggedIn)


Navbar()

//let user: User = aktUser[0]
let body = document.getElementById("body") as HTMLDivElement
function LoadPage() {
    console.log()
    body.classList += "container"
    body.innerHTML += `
        <form id="profile">
                <div id="errors"></div>
                <div id="success"></div>
                <h1>Profil adatok</h1>
                <div>
                    <label for="name">Felhasználó név</label>
                    <input name="name" class="name" type="text" value="${user.name}" disabled>
                </div>

                <div>
                    <label for="email-r">E-mail</label>
                    <input name="email-r" class="email" type="text" value="${user.email}" disabled>
                </div>
                
                <div id="passwords">
                    <div>
                        <label for="pwd-r1">Jelszó</label>
                        <input name="pwd-r1" id="pwd1" type="password" value="${user.password}" disabled>
                        <input class="pwd1" type="checkbox" disabled>
                    </div>
                </div>
                
                <div>
                    <label for="author">Szerkesztő</label>
                    <input name="author" class="author" type="checkbox" ${user.author ? "checked" : ""} disabled>
                </div>


                <div>
                    <a id="deleteBtn" class="btn btn-outline-danger">Felhasználó fiók törlése</a>
                    <a id="modifySaveBtn" data-purpose="modify" class="btn btn-outline-success">Szerkesztés</a>
                </div>

            </div>
        </from>`

        let succesDiv = document.getElementById("success") as HTMLDivElement

        
        document.getElementById("modifySaveBtn")?.addEventListener("click", async ()=>{
            let inputs: HTMLInputElement[] = [...document.getElementById("profile")!.querySelectorAll("input")] as HTMLInputElement[]
            passwordHandler()

            let btn = document.getElementById("modifySaveBtn")
            console.log()
            switch(btn?.dataset.purpose){
                case "modify":
                    btn!.dataset.purpose = "save"
                    btn!.classList = "btn btn-outline-primary"
                    btn!.innerHTML = "Mentés"
                    ableInputs(inputs)
                    
                    passwordVisible([document.getElementById("pwd1") as HTMLInputElement])
                    break;
                case "save":
                    btn!.dataset.purpose = "modify"
                    btn!.classList = "btn btn-outline-success"
                    btn!.innerHTML = "Szerkesztés"
                    
                    let errors: string[] = []
                    let modified: User = collectData(inputs)
                    let password = user.password
                    if (inputNotFilled(inputs)){
                        errors.push("Ne hagyjon üresen mezőt")
                    }
                    if (!inputNotFilled(inputs)){
                        if (modified.email != user.email && emailFoglalt(modified.email, users)){
                            errors.push("E-mail használatban")
                        }
                        if (!emailValidForma(modified.email)){
                            errors.push("Nem megfelelő e-mail formátum")
                        }
                        let pwd1 = (document.getElementById("pwd1") as HTMLInputElement).value
                        if (document.getElementById("pwd2")){
                            let pwd2 = (document.getElementById("pwd2") as HTMLInputElement).value
                            if (pwd1 != pwd2){
                                errors.push("Nem egyeznek a jelszavak")
                            }
                            else if (pwd1 == user.password && pwd2 == user.password){
                                //sztem az nem baj
                            }
                            else{
                                password = pwd1
                                modified.password = password
                            }
                        }
                    }

                    console.log(user)
                    console.log(modified)
                    if (errors.length == 0 && changesMade(user, modified)){
                        if(await updateUser(modified)){
                            succesDiv.innerHTML += "Sikeres szerkesztés!"
                            await showSuccess()
                            succesDiv.innerHTML = ""
                            saveAndContinue(modified)
                            window.location.reload()
                        }
                    }

                    disableInputs(inputs)
                    showError(errors)
            }
        })
        

    
}
LoadPage()

function changesMade(before: User, after: User): boolean{
    if(before.id == after.id && before.author == after.author
        && before.email == after.email && before.name == after.name
        && before.password == after.password
    ) return false
    else return true
}

function ableInputs(inputs: HTMLInputElement[]){
    console.log(inputs)
    inputs.forEach(input =>{
        input.disabled = false
    })
}

function disableInputs(inputs: HTMLInputElement[]){
    let passwordArea = document.getElementById('passwords') as HTMLElement
    passwordArea.innerHTML = ""
    passwordArea.innerHTML = `
                    <div>
                        <label for="pwd-r1">Jelszó</label>
                        <input name="pwd-r1" id="pwd1" type="password" value="${user.password}" disabled>
                        <input class="pwd1" type="checkbox" disabled>
                    </div>
            `
    inputs.forEach(input =>{
        input.disabled = true
    })
    
}

function collectData(inputs: HTMLInputElement[]):User{
    let modifiedUser: User = {
        id: user.id,
        name: (inputs.find(i => i.classList.contains("name")) as HTMLInputElement).value,
        email: (inputs.find(i => i.classList.contains("email")) as HTMLInputElement).value,
        password: user.password,
        author: (inputs.find(i => i.classList.contains("author")) as HTMLInputElement).checked,
    }
    return modifiedUser
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

function passwordHandler(){

    // document.getElementById("pwd1")?.addEventListener("input", () =>{
    //     let pwdValue = (document.getElementById("pwd1") as HTMLInputElement).value
    //     if(pwdValue == user.password){
    //         console.log("ugyanaz")
    //     }
    //     else{
    //         console.log("változott")
    //     }
    // })
    
    document.getElementById("pwd1")?.addEventListener("click", () =>{
        let passwordArea = document.getElementById('passwords') as HTMLElement
        let pwd2Input = `
            <div>
                <label for="pwd-r1">Jelszó mégegyszer</label>
                <input name="pwd-r2" id="pwd2" type="password">
                <input class="pwd2" type="checkbox" >
            </div>
        `
        passwordArea.innerHTML += pwd2Input
        passwordVisible([document.getElementById("pwd1") as HTMLInputElement, document.getElementById("pwd2") as HTMLInputElement])
    })

    
}
