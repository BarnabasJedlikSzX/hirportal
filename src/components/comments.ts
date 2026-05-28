import { GetComments } from "../api/http";
import type { Comment } from "../types/Comment";

export async function Comments() {
    const params = new URLSearchParams(window.location.search);
    const newsID = params.get('id');
    const comments: Comment[] = await GetComments(newsID!)


    document.querySelector("#main")!.insertAdjacentHTML("afterend", `<div id="commentsContainer" class="row mb-5 p-3">
        <hr style="color:gold;">
        <h3 class="mb-4">Kommentek</h3>
        </div>`)

    if (comments.length === 0) {
        document.querySelector("#commentsContainer")?.insertAdjacentHTML("beforeend", `
            <p>
                Még nincsenek kommentek
            </p>
        `);
    }
    else for (let comment of comments) {
        const difference = Date.now() - new Date(comment.createdAt).getTime();

        const totalMinutes = Math.floor(difference / 1000 / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeStamp = `${hours === 0 ? "" : hours + " óra "}${minutes} perce`.trim();

        document.querySelector("#commentsContainer")?.insertAdjacentHTML("beforeend", `
            <div class="comment">
                ${comment.content}
            </div>
        `);


    }



}