import { GetNews } from "../api/http"

const news = await GetNews()
document.querySelector("#main")!.insertAdjacentHTML("beforebegin", `<div id="latestNewsContainer" class="row m-3"></div>`)

export function LatestNews() {
    const hoursAgo = 3 * 60 * 60 * 1000;

    const sorted = [...news]
        .map(n => {
            const normalized = n.createdAt.replace(" (szerkesztve)", "")
                .replace(/\.\s*/g, "-")
                .replace(/-(\d{2}:\d{2})$/, "T$1")
                .replace(/-$/, "");
            return { ...n, _date: new Date(normalized) };
        })
        .filter(n => Date.now() - n._date.getTime() <= hoursAgo)
        .sort((a, b) => b._date.getTime() - a._date.getTime())
        .slice(0, 5);

    for (let n of sorted) {
        const difference = Date.now() - n._date.getTime();

        const totalMinutes = Math.floor(difference / 1000 / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeStamp = `${hours === 0 ? "" : hours + " óra"} ${minutes} perce`;

        document.querySelector("#latestNewsContainer")?.insertAdjacentHTML("beforeend", `
            <a href="read.html?id=${n.id}" style="text-decoration:none; min-width:0;" class="text-white latestNews col">
                <ul>
                    <li style="list-style-type: square;" class="text-info">
                        ${timeStamp}
                    </li>
                    <p class="truncate">${n.title}</p>
                </ul>
            </a>
        `);
    }
}
