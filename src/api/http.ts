import type { News } from "../types/News";

export async function AddNews(news: News) {
    await fetch("http://localhost:3000/news", {
        method: "POST",
        body: JSON.stringify(news)
    })
}

export async function GetNews(): Promise<News[]> {
    const res = await fetch("http://localhost:3000/news", { method: "GET" })
    return await res.json()
}