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
        author: user.author,
        profilPictureSrc: user.profilPictureSrc
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

export function showError(errortexts: string[]): string{
    let errorString = ""
    errortexts.forEach(error =>{
        errorString += `<p>${error}</p>`
    })
    return errorString
}

export async function showSuccess(toWait: number){
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await delay(toWait);  
} 