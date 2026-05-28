import { showConfirm, showPopup } from '../src/components/popup';
import type { User } from "./types/User";
import { deletUser, getUser, getUsers, updateUser } from "./api/user_handler";
import { Navbar } from './components/navbar';
import {emailFoglalt, emailValidForma, saveAndContinue, inputNotFilled, showError, showSuccess} from './components/user_validations'


let users: User[] = await getUsers();
let data = localStorage.getItem("aktualisUser")
if (!data) {
    window.location.replace("/")
}

let loggedIn: User = JSON.parse(data!) as User;
let user: User = await getUser(loggedIn)
let savedProfilPicSrc = user.profilPictureSrc
console.log(user)


Navbar()

//let user: User = aktUser[0]
let body = document.getElementById("body") as HTMLDivElement
let picture = document.getElementById("picture") as HTMLDivElement
function LoadPage() {

    loadUserData()
    loadUserPicture()

        
        document.getElementById("modifySaveBtn")?.addEventListener("click", async ()=>{
            let inputs: HTMLInputElement[] = [...document.getElementById("profile")!.querySelectorAll("input")] as HTMLInputElement[]
            passwordHandler()
            let pictureInput = document.getElementById("imgInput") as HTMLInputElement
            let profPic = document.getElementById("profPicImage") as HTMLElement

            let btn = document.getElementById("modifySaveBtn")
            switch(btn?.dataset.purpose){
                case "modify":
                    btn!.dataset.purpose = "save"
                    btn!.classList = "btn btn-outline-primary"
                    btn!.innerHTML = "Mentés"
                    ableInputs(inputs)
                    profPic.style.cursor = "pointer"
                    pictureInput.disabled = false
                    passwordVisible([document.getElementById("pwd1") as HTMLInputElement])
                    profilPicHandler(pictureInput, profPic)
                    break;
                case "save":                        
                    inputs.splice(inputs.indexOf(document.querySelector(".pwd1") as HTMLInputElement), 1)
                    inputs.splice(inputs.indexOf(document.querySelector(".pwd2") as HTMLInputElement), 1)
                    let errors: string[] = []
                    let modified: User = collectData(inputs)
                    console.log(modified)
                    await saveChanges(modified, errors, inputs, savedProfilPicSrc)
                    profPic.style.cursor = "not-allowed"
                    pictureInput.disabled = true

                    if (errors.length == 0){
                        btn!.dataset.purpose = "modify"
                        btn!.classList = "btn btn-outline-success"
                        btn!.innerHTML = "Szerkesztés"
                        disableInputs(inputs)
                    }
            }
        })

        document.getElementById("deleteBtn")?.addEventListener("click", async ()=>{      
        // Meghívjuk a TS függvényünket és megvárjuk a választ
            const konfirmalva = await showConfirm({
                title: 'Fiók végleges törlése',
                message: 'Biztosan törölni szeretnéd a fiókod? A folyamat visszafordíthatatlan.',
                confirmText: 'Igen',
                cancelText: 'Mégse'
            });
        
            // Itt a kód megállt, amíg a felhasználó nem kattintott a modalban!
            if (konfirmalva) {
                if (await deletUser(user.id!)){
                    localStorage.removeItem("aktualisUser")
                    window.globalisUser = null;
                    await showPopup({
                        title: "Sikeres törlés",
                        message: "Tovább irányítás a főoldalra",
                        confirmText: undefined,
                        cancelText: undefined
                    })
                    await showSuccess(1000)
                    window.location.replace("/")
                }
            } else {
                console.log('A felhasználó meggondolta magát, nem történik semmi.');
            }

        
        });
            
        
        
    
}
LoadPage()


function loadUserData(){
    body.classList += "container"
    body.innerHTML += `
        <form id="profile">
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
                    <div >
                        <label for="pwd-r1">Jelszó</label>
                        <input name="pwd-r1" id="pwd1" type="password" value="${user.password}" disabled>
                        <input class="pwd1" type="checkbox" disabled>
                    </div>
                    <div class="d-none">
                        <label for="pwd-r1">Jelszó mégegyszer</label>
                        <input name="pwd-r2" id="pwd2" type="password">
                        <input class="pwd2" type="checkbox" >
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

}

function loadUserPicture(){
    picture.classList += "container"
    picture.innerHTML += `
    <div class="col" id="profilePicContainer" style="position: relative;">
        <img src="./backend/downloaded/${user.profilPictureSrc}" id="profPicImage">
        <a id="deleteProfPic"><i class="bi bi-x-circle-fill"></i></a>
        <input type="file" name="imgInput" id="imgInput" style="display: none;" disabled>
        <p>Profilkép szerkesztése</p>
    </div>
    `


}

function profilPicHandler(input: HTMLInputElement, profPic: HTMLElement){
    let imgContainer = document.getElementById("profilePicContainer") as HTMLInputElement
    let label = `<label for="imgInput" id="addProfPic">Kép hozzáadása</label>`
    let filename = ""
    let uploaded = true
    input.addEventListener("input", async () => {
        if (!input.files) return;
        const file = input.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            await fetch('http://localhost:3001/upload-image', {
                method: 'POST',
                body: formData
            }).then(async (res) => {
                filename = (await res.json()).body
                profPic.style.display = "block";
                document.querySelector("#addProfPic")?.remove();

                (imgContainer.querySelector("#profPicImage") as HTMLInputElement).src = `./backend/downloaded/${filename}`;
                savedProfilPicSrc = filename

                uploaded = true;
            })
        } catch (err) {
            console.error("Upload failed:", err);
        }
    });
    
    let deleteBtn = document.getElementById("deleteProfPic") as HTMLElement
    
    imgContainer.addEventListener("mouseover", () => {
        if (uploaded){
            console.log("szex")
            deleteBtn.style.opacity = "1";  
            deleteBtn.style.zIndex = "5";
        } 
    });

    imgContainer.addEventListener("mouseleave", () => {
        deleteBtn.style.opacity = "0";
        deleteBtn.style.zIndex = "-2";

    });
    
    deleteBtn.addEventListener("click", () => {
        input.value = "";
        if(document.getElementById("addProfPic")){
            document.getElementById("addProfPic")?.remove()
        }
        imgContainer.insertAdjacentHTML("afterbegin", label);
        savedProfilPicSrc = ""
        profPic.style.display = "none";
        uploaded = false
    });



}

async function saveChanges(modifiedUser:User, errors: string[], inputs: HTMLInputElement[], savedProfilPicSrc:string){
    modifiedUser.profilPictureSrc = savedProfilPicSrc
    if (changesMade(user, modifiedUser) == true){
        let pwd1 = (document.getElementById("pwd1") as HTMLInputElement).value
        if (pwd1 != user.password){
            if ((document.getElementById("pwd2")?.parentElement as HTMLDivElement).classList.contains("d-flex")
                 && pwd1 != user.password){

                let pwd2 = (document.getElementById("pwd2") as HTMLInputElement).value
                if (pwd1 != pwd2){
                    errors.push("Nem egyeznek a jelszavak")
                }
                else if (pwd1 == user.password && pwd2 == user.password){
                    //sztem az nem baj
                }
                else{
                    modifiedUser.password = pwd1
                }
            }
        }
        else if ((document.getElementById("pwd2")?.parentElement as HTMLDivElement).classList.contains("d-none")){
            inputs.splice(inputs.indexOf(document.querySelector("#pwd2") as HTMLInputElement), 1) 
        }
        
        if (inputNotFilled(inputs)){
            errors.push("Ne hagyjon üresen mezőt")
        }
        if (!inputNotFilled(inputs)){
            if (modifiedUser.email != user.email && emailFoglalt(modifiedUser.email, users)){
                errors.push("E-mail használatban")
            }
            if (!emailValidForma(modifiedUser.email)){
                errors.push("Nem megfelelő e-mail formátum")
            }
        }
                                
        if (errors.length == 0 && changesMade(user, modifiedUser)){
            if(modifiedUser.profilPictureSrc == "") modifiedUser.profilPictureSrc = "13.jpg"
            if(await updateUser(modifiedUser)){
                saveAndContinue(modifiedUser)
                await showPopup({
                    title: "Sikeres szerkesztés",
                    message: undefined,
                    duration: 2000
                })
                await showSuccess(1500)
                errors =[]
                window.location.reload()
            }
        }
        else{
            await showConfirm({
                title: "Szerkesztési problémák",
                message: showError(errors),
            })
        }
                    
    }
}

function changesMade(before: User, after: User): boolean{
    // console.log(before)
    // console.log(after)

    // console.log(before.profilPictureSrc)
    // console.log(after.profilPictureSrc)
    
    // console.log(before.profilPictureSrc == after.profilPictureSrc)


    if(before.id == after.id && before.author == after.author
        && before.email == after.email && before.name == after.name
        && before.password == after.password && before.profilPictureSrc == after.profilPictureSrc
    ) return false
    else return true
}

function ableInputs(inputs: HTMLInputElement[]){
    
    inputs.forEach(input =>{
        input.disabled = false
    })
}

function disableInputs(inputs: HTMLInputElement[]){
    (document.getElementById("pwd2")?.parentElement as HTMLDivElement).classList = "d-none"
    inputs.forEach(input =>{
        input.disabled = true
    })
    
}

function collectData(inputs: HTMLInputElement[]):User{
    //console.log((document.getElementById("profilePicContainer")!.querySelector("#profPicImage") as HTMLInputElement).src.split("/")[5])
    let modifiedUser: User = {
        id: user.id,
        name: (inputs.find(i => i.classList.contains("name")) as HTMLInputElement).value,
        email: (inputs.find(i => i.classList.contains("email")) as HTMLInputElement).value,
        password: (document.getElementById("pwd1") as HTMLInputElement).value,
        author: (inputs.find(i => i.classList.contains("author")) as HTMLInputElement).checked,
        profilPictureSrc: (document.getElementById("profilePicContainer")!.querySelector("#profPicImage") as HTMLInputElement).src.split("/")[5]
    }
    return modifiedUser
}


function passwordVisible(passwordInputs: HTMLInputElement[]) {
    passwordInputs.forEach(input =>{
        let checkBox = document.querySelector(`.${input.id}`)
        if (checkBox != null){
            checkBox.addEventListener("change", ()=>{
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
        (document.getElementById("pwd2")?.parentElement as HTMLDivElement).classList = "d-flex"
    })

    
}
