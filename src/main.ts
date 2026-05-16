import './styles/style.css'
import { Navbar } from './components/navbar';

document.querySelector("#navbar")!.innerHTML = Navbar()

// Itt meg dobja a hibát
let sessionData = sessionStorage.getItem("aktualisUser")
if (sessionData){
    let user = JSON.parse(sessionData)
    console.log(user)
}