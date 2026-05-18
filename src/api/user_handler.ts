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

export async function createUser(newUser: User): Promise<boolean>{
    let response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(newUser)
    });
    if (!response.ok){
        return false
    }
    else {
        return true
    }
}

export async function getUser(loggedIn: User) : Promise<User> {
    let response = await fetch(BASE_URL, {method: 'GET'});
    if(!response.ok){
        console.error("HTTP Error:", response.status)
    }
    let users: User[] = await response.json()
    return users.filter(u => u.id == loggedIn.id)[0]
}

export async function getNewUser(loggedIn: User) : Promise<User> {
    let response = await fetch(BASE_URL, {method: 'GET'});
    if(!response.ok){
        console.error("HTTP Error:", response.status)
    }
    let users: User[] = await response.json()
    return users.filter(u=> u.email == loggedIn.email && u.password == loggedIn.password)[0]
}

export async function updateUser(updatedUser: User): Promise<boolean>{
    let response = await fetch(`${BASE_URL}/${updatedUser.id}`, {
        method: 'PATCH',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(updatedUser)
    });
    if (!response.ok){
        return false
    }
    else {
        return true
    }
}