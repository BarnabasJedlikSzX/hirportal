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

export async function Nevnapok(month: string, day: string): Promise<string[]> {
    const res = await fetch(`https://api.nevnapok.eu/nap/${month}-${day}`, { method: "GET" })
    return (await res.json())[`${month}-${day}`]
}

export async function DeleteNews(newsId: string) {
    await fetch(`http://localhost:3000/news/${newsId}`, { method: "DELETE" })
}

export async function GetCurrencies() {
    return await Promise.all([
        fetch('https://open.er-api.com/v6/latest/EUR').then(r => r.json()),
        fetch('https://open.er-api.com/v6/latest/USD').then(r => r.json()),
    ]);
}

export async function GetWeather() {
    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${47.4979}&longitude=${19.0402}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=1`
    );
    const data = await res.json();

    const max = data.daily.temperature_2m_max[0];
    const min = data.daily.temperature_2m_min[0];
    const code = data.daily.weathercode[0];

    return { max, min, description: weatherCodeToText(code) };

    function weatherCodeToText(code: number) {
        if (code === 0) return 'Tiszta ég';
        if (code <= 3) return 'Részben felhős';
        if (code <= 49) return 'Köd';
        if (code <= 59) return 'Szitálás';
        if (code <= 69) return 'Eső';
        if (code <= 79) return 'Havazás';
        if (code <= 82) return 'Zápor';
        if (code <= 86) return 'Hózápor';
        if (code <= 99) return 'Zivatar';
        return '';
    }
}