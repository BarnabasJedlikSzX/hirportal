import { GetComments, GetNewsById, UpdateComment } from "../api/http";
import { getUsers } from "../api/user_handler";
import type { Comment } from "../types/Comment";
import type { News } from "../types/News";
import type { User } from "../types/User";
import { Error } from "./error";

export async function Comments() {
    const params = new URLSearchParams(window.location.search);
    const newsID = params.get('id');
    const comments: Comment[] = await GetComments(newsID!)
    const users = await getUsers()
    const news: News | string = await GetNewsById(newsID!)
    const loggedIn = localStorage.getItem("aktualisUser")
    const currentUser: User = JSON.parse(loggedIn!)
    document.querySelector("#commentsContainer")?.remove()
    document.querySelector("#main")!.insertAdjacentHTML("afterend", `<div id="commentsContainer" class="row mb-5 p-4 justify-content-end">
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
    else if (typeof news !== "string") {

        for (let comment of comments) {
            const difference = Date.now() - new Date(comment.createdAt).getTime();

            const totalMinutes = Math.floor(difference / 1000 / 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const timeStamp = totalMinutes < 24 * 60 ? `${hours === 0 ? "" : hours + " óra "}${minutes} perce`.trim() : comment.createdAt;



            let user = users[0]
            for (let u of users) {
                if (comment.userId === u.id) user = u
            }
            let element = document.querySelector("#commentsContainer")!
            if (comment.repliedCommentId !== "") element = document.querySelector(`#replyContainer-${comment.repliedCommentId}`)!

            element.insertAdjacentHTML("beforeend", `
            <div class="comment">
                <div class="d-flex align-items-center mb-3">
                    <img src="./backend/downloaded/${user.profilPictureSrc}" class="rounded-3 me-2 border border-2 border-white" style="width:2rem; height:2rem;">
                    <p class="m-0">
                        <span class="fw-bold">${user.name}</span> <span class="text-info">${user.id === news.userId ? "• Szerkesztő <i class='bi bi-pen-fill ms-1'></i>" : ""}</span>
                    </p>
                </div>
                <p class="ms-2">
                ${comment.content}
                </p>
                <div class="d-flex justify-content-between">
                    <div class="d-flex align-items-center ">
                        
                        ${loggedIn && comment!.likers.includes(currentUser.id!) ? `
                            <button class="btn me-2 likeButton text-warning" data-commentId="${comment.id}">
                                <i class="bi bi-hand-thumbs-up-fill"></i> ${comment.likers.length}
                            </button>
                            ` : `
                            <button class="btn me-2 likeButton" data-commentId="${comment.id}">
                                <i class="bi bi-hand-thumbs-up"></i> ${comment.likers.length}
                            </button>
                            `} 
                        <span style="color:grey; font-size:0.8rem;">
                        ${timeStamp}
                        </span>
                    </div>
                    <div>
                    <button class="btn text-warning"><i class="bi bi-reply-fill"></i></button>
                    ${comment.userId === currentUser.id ? `<button class="btn text-secondary"><i class="bi bi-pencil-fill"></i></button>` : ""}
                    
                    </div>
                </div>

            </div>
            <div id="replyContainer-${comment.id}" style="width:90%; padding:0; margin-left:auto; margin-right:0;"></div>
        `);
        }

        document.querySelectorAll(".likeButton").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (loggedIn) {
                    const commentId = (btn.attributes as any)["data-commentId"].textContent
                    let comment
                    for (let c of comments) {
                        if (c.id === commentId) comment = c
                    }

                    console.log(comment!.likers)
                    if (!comment!.likers.includes(currentUser.id!)) {
                        comment?.likers.push(currentUser.id!)
                    } else {
                        const index = comment!.likers.indexOf(currentUser.id!);
                        if (index !== -1) {
                            comment!.likers.splice(index, 1);
                        }
                    }
                    await UpdateComment(comment!)
                    Comments()
                } else (alert("jelentkezz be a lájkoláshoz!"))

            })
        })

    } else Error(404)



}