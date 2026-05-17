import type { User } from "../types/User";

const BASE_URL = "http://localhost:3000/users";

export async function getUsers(): Promise<User[]> {
    let response = await fetch(BASE_URL, {method: 'GET'});
    if(!response.ok){
        console.error("HTTP Error:", response.status)
        return []
    }
    return await response.json()
}

export async function createUser(newUser: User): Promise<User>{
    let response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(newUser)
    });
    return await response.json()
}

// Ezt akartam arra használni, hogy bárhol le lehessen kérni, egyenlőre nem volt szívem törölni
//
// export async function getUser() : Promise<User[]> {
//     let response = await fetch(BASE_URL, {method: 'GET'});
//     if(!response.ok){
//         console.error("HTTP Error:", response.status)
//     }
//     let users: User[] = await response.json()
//     return users.filter(u => u.logged == true)
// }