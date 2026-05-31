export function Error(code: number | undefined = undefined) {
    let text = `<h1>Ismeretlen Hiba</h1>`
    switch (code) {
        case 404: text = `
        <h1>
            Az oldal nem található
        </h1>
        <h5 class="text-secondary">
            Úgy tűnik a keresett tartalom nem létezik, áthelyezték vagy törölték.
        </h5>
        `
            break
        case 401: text = `
        <h1>
            Hozzáférés megtagadva
        </h1>
        <h5 class="text-secondary">
            Úgy tűnik nem vagy bejelentkezve, vagy nincs hozzáférésed a tartalomhoz.
        </h5>
        `
            break
    }

    document.querySelector("body")!.style.minHeight = `${window.outerHeight}px`
    document.querySelector("body")!.style.overflow = `hidden`
    document.querySelector("body")!.innerHTML = `
    <div class="text-center">
    
        <h1 class="d-flex align-items-center p-0 justify-content-center fw-bold mt-5" style="font-size:9rem;">
        ${code ?
            `4<img src="./src/img/logo2.png" class="d-block" style="width:9rem;">${code === 404 ? 4 : 1}`
            : "0"}
        </h1>
        ${text}
        <a class="btn btn-warning w-25 mt-5" href="index.html" id="errorHomeBtn"><i class="bi bi-house-fill me-1"></i>Vissza a főoldalra</a>
        <div class="error-illustration d-block m-auto mt-5">
        <img src="./src/img/error.png">
</div>
    </div>
    
    `

}