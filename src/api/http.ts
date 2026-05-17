import type { News } from "../types/News";

export async function AddNews(news: News) {
    await fetch("http://localhost:3000/news", {
        method: "POST",
        body: JSON.stringify(news)
    })
}

export async function EditNews(news: News) {
    await fetch(`http://localhost:3000/news/${news.id}`, {
        method: "PATCH",
        body: JSON.stringify(news)
    })
}

export async function GetNews(): Promise<News[]> {
    const res = await fetch("http://localhost:3000/news", { method: "GET" })
    return await res.json()
}

export async function GetNewsById(newsId: string): Promise<News | string> {
    if (newsId) {
        const res = await fetch(`http://localhost:3000/news/${newsId}`, { method: "GET" })
        const json = await res.json()
        if (json.error) return "Not Found"
        return json
    } else return "Not Found"
}