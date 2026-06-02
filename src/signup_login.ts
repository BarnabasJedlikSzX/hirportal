import './styles/style.css'
import './styles/signup_login.css'
import type { User } from "./types/User";
import { getUsers, createUser, getNewUser } from "./api/user_handler";
import { showConfirm, showPopup } from '../src/components/popup';
import { Navbar } from './components/navbar';
import {emailFoglalt, emailValidForma, saveAndContinue, inputNotFilled, showError, showSuccess} from './components/user_validations'

let users: User[] = await getUsers();
let body = document.getElementById("body") as HTMLDivElement
let data = localStorage.getItem("aktualisUser")
if (data) {
    window.location.replace("/")
}

Navbar()

function LoadPage() {
    // body.classList += "container"
    body.innerHTML += `
    <form id="login">
            <div id="errors"></div>
            <div id="success"></div>
            <h1>Bejelentkezés</h1>
            <div>
            
                <label for="email">E-mail</label>
                <input name="email" class="email" type="text">
            </div>
            
            <div class="password">
                <label for="pwd">Jelszó</label>
                <input id="pwd" name="pwd" type="password">
                <button type="button" class="pwdToggle">
                            <i class="ti ti-eye"></i>
                </button>
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
                    <div class="password">
                        <input name="pwd-r1" id="pwd1" type="password">
                        <button type="button" class="pwdToggle">
                            <i class="ti ti-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div>
                    <label for="pwd-r2">Jelszó mégegyszer</label>
                    <div class="password">
                        <input name="pwd-r2" id="pwd2" type="password">
                        <button type="button" class="pwdToggle">
                            <i class="ti ti-eye"></i>
                        </button>
                    </div>
                </div>



                <a id="signupbtn" class="btn btn-outline-primary">Regisztráció</a>

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
        if (await loginValidation(loginInputs, foundUser) && foundUser != undefined) {
            await showPopup({
                title: "Sikeres bejelentkezés",
                message: undefined,
                duration: 2000
            })
            await showSuccess(1500)
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
                id: "",
                name: name,
                email: email,
                password: pwd1,
                author: false,
                profilPictureSrc: "13.jpg"
            }
            if (await createUser(newUser)){
                succesDiv.innerHTML += "Sikeres regisztrálás!"
                newUser = await getNewUser(newUser)
                console.log(newUser)
                await showPopup({
                    title: "Sikeres regisztráció",
                    message: undefined,
                    duration: 2000
                })
                await showSuccess(1500)
                saveAndContinue(newUser)
                window.location.replace("/")

            }
            
        }


    })

    //stílus
    
    // Alapból bejelentkezés aktív
    if (loginDiv != null && signupDiv != null){
        loginDiv.classList.add('active');
        signupDiv.classList.add('inactive');
        
        // Hint szövegek hozzáadása (HTML módosítás nélkül)
        const loginHint = document.createElement('p');
        loginHint.className = 'hint';
        loginHint.textContent = 'Kattintás a megnyitáshoz';
        loginDiv.querySelector('h1')!.after(loginHint);
        
        const signupHint = document.createElement('p');
        signupHint.className = 'hint';
        signupHint.textContent = 'Nincs fiókja? Kattintás a megnyitáshoz';
        signupDiv.querySelector('h1')!.after(signupHint);
        
        // Mezők field-group-ba csomagolása (HTML módosítás nélkül)
        function wrapFieldGroup(form: HTMLElement) {
            const group = document.createElement('div');
            group.className = 'field-group';
            const toWrap = Array.from(form.children).filter(el =>
                el.tagName !== 'H1' &&
                !el.classList.contains('hint') &&
                el.id !== 'errors' &&
                el.id !== 'success'
            );
            toWrap.forEach(el => group.appendChild(el));
            form.appendChild(group);
        }
        
        wrapFieldGroup(loginDiv);
        wrapFieldGroup(signupDiv);
        
        // Panel váltás
        loginDiv.addEventListener('click', () => {
        if (loginDiv.classList.contains('inactive')) {
            loginDiv.className = 'active';
            signupDiv.className = 'inactive';
        }
        });
        
        signupDiv.addEventListener('click', () => {
        if (signupDiv.classList.contains('inactive')) {
            signupDiv.className = 'active';
            loginDiv.className = 'inactive';
        }
        });

    }
}
LoadPage()




async function signinValidation(inputs: HTMLInputElement[]){
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
    if(errors.length > 0){
        await showConfirm({
            title: "Sikertelen regisztráció",
            message: showError(errors),
        })
        return false
    }
}

async function loginValidation(inputs: HTMLInputElement[], foundUser: User | undefined): Promise<boolean>{
    let email = (inputs.find(i => i.classList.contains("email")) as HTMLInputElement).value

    let errors: string[] = []
    if (inputNotFilled(inputs)){
        errors.push("Mezők kitöltése kötelező!")
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

    if(errors.length == 0){
        return true
    }
    else{ 
        await showConfirm({
            title: "Sikertelen bejelentkezés",
            message: showError(errors),
        })
        return false
    }
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

document.querySelectorAll('.pwdToggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling as HTMLInputElement;; // a mellette lévő input
    const icon = btn.querySelector('i')
    if (input){
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        icon!.className = show ? 'ti ti-eye-off' : 'ti ti-eye';
    }
  });
});

