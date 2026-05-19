export function Error(code: number) {
    let html = `<h2>Error</h2>`
    switch (code) {
        case 404: html = `<h2>404 Not found</h2>`
            break
        case 401: html = `<h2>401 Unauthorized</h2>`
            break
    }

    document.querySelector("#main")!.innerHTML = html
}