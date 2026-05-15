import './styles/style.css'

// Itt meg dobja a hibát
let sessionData = sessionStorage.getItem("aktualisUser")
if (sessionData){
    let user = JSON.parse(sessionData)
    console.log(user)
}