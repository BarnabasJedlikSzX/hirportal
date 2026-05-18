import type { User } from "../types/User";

export function emailValidForma(email: string): boolean {
    // Szabványos, megbízható e-mail formátum ellenőrző reguláris kifejezés
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function emailFoglalt(email: string, users: User[]): boolean {
    let hasonlo = users.find(m => m.email == email)
    if (hasonlo) {
        return true
    }
    else {
        return false
    }
}

export function saveAndContinue(user: User) {
    window.globalisUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        author: user.author
    }

    localStorage.setItem("aktualisUser", JSON.stringify(window.globalisUser));
}

export function inputNotFilled(inputs: HTMLInputElement[]): boolean{
    let emptyInput = false;
    inputs.forEach(input =>{
        if (!input.value && input.value.trim() == ""){
            emptyInput = true
        }
    })
    return emptyInput
}

export function showError(errortexts: string[]){
    let errorArea = document.getElementById("errors") as HTMLParagraphElement
    errorArea.innerHTML = ""
    errortexts.forEach(error =>{
        let errorParag = document.createElement("p")
        errorParag.innerText += `${error}`
        errorArea.appendChild(errorParag)
    })
}

export async function showSuccess(){
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await delay(2000);  
} 