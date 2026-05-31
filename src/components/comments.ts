import { AddComment, DeleteComment, GetComments, GetNewsById, UpdateComment } from "../api/http";
import { getUsers } from "../api/user_handler";
import type { Comment } from "../types/Comment";
import type { News } from "../types/News";
import type { User } from "../types/User";
import { Error } from "./error";
import { GetFormattedDate } from "./getFormattedDate";
import { showPopup } from "./popup";

export async function Comments() {
    const params = new URLSearchParams(window.location.search);
    const newsID = params.get('id');
    const comments: Comment[] = await GetComments(newsID!)
    const users = await getUsers()
    const news: News | string = await GetNewsById(newsID!)
    const loggedIn = localStorage.getItem("aktualisUser")
    const currentUser: User = JSON.parse(loggedIn!)
    let replyingTo = ""
    document.querySelector("#commentsContainer")?.remove()
    document.querySelector("#main")!.insertAdjacentHTML("afterend", `
        <div id="commentsContainer" class="mb-5 p-4">
            <hr style="color:gold;">
            <h3 class="mb-4">Kommentek</h3>
            ${loggedIn ? `
                <div class="btn btn-light text-dark text-center mb-4" id="newComment">
                <div id="newCommentText">
                    <i class="bi bi-pen-fill me-1"></i> Új komment
                </div>
                <div id="newCommentForm" style="display:none;">
                    <textarea placeholder="Írj egy hozzászólást..." class="text-light" maxlength="500"></textarea>
                    <p class="p-0 text-secondary">max. 500 karakter</p>
                    <button id="sendCommentBtn" class="btn btn-info"><i class="bi bi-send-fill"></i></button>
                </div>
            </div>`: "<p>Komment írásához jelentkezz be!</p>"}
            <div id="commentSection"></div>
        </div>
            `)

    if (comments.length === 0) {
        document.querySelector("#commentsContainer")?.insertAdjacentHTML("beforeend", `
            <p class="pt-4">
            <hr style="color:white;">
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
            let element = document.querySelector("#commentSection")!
            if (comment.repliedCommentId !== "") element = document.querySelector(`#replyContainer-${comment.repliedCommentId}`)!

            element?.insertAdjacentHTML("afterbegin", `
            <div class="comment">
                <div class="d-flex align-items-center mb-3">
                    <img src="./backend/downloaded/${user.profilPictureSrc}" class="rounded-3 me-2" style="width:2rem; height:2rem;">
                    <p class="m-0">
                        <span class="fw-bold">${user.name}</span> <span class="text-info">${user.id === news.userId ? "• Szerkesztő <i class='bi bi-pen-fill ms-1'></i>" : ""}</span>
                    </p>
                </div>
                <p class="ms-2" id="commentContent">${comment.content}</p>
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
                    ${loggedIn ? `<button class="btn text-warning replyCommentBtn" data-commentId="${comment.id}"><i class="bi bi-reply-fill"></i></button>` : ""}
                    ${loggedIn && comment.userId === currentUser.id ? `<button class="btn text-secondary deleteCommentBtn" data-commentId="${comment.id}"><i class="bi bi-trash-fill"></i></button>` : ""}
                    
                    </div>
                </div>

            </div>
            <div id="replyContainer-${comment.id}" style="width:90%; padding:0; margin-left:auto; margin-right:0;"></div>
        `);
        }


        document.querySelectorAll(".deleteCommentBtn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const commentId = (btn.attributes as any)["data-commentId"].textContent
                await DeleteComment(commentId)
                Comments()
            })
        })

        const replyField = `<div class="btn btn-light text-dark text-center mb-4" id="replyField">
                <div id="newCommentText">
                    <i class="bi bi-pen-fill me-1"></i> Új komment
                </div>
                <div id="newReplyForm" style="display:none;">
                    <textarea placeholder="Írj egy hozzászólást..." class="text-light" maxlength="500"></textarea>
                    <p class="p-0 text-secondary">max. 500 karakter</p>
                    <button id="sendReplyBtn" class="btn btn-info"><i class="bi bi-send-fill"></i></button>
                </div>
            </div>`


        document.querySelectorAll(".replyCommentBtn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                replyingTo = (btn.attributes as any)["data-commentId"].textContent

                document.querySelector(`#replyField`)?.remove()
                if (!document.querySelector(`#replyField`)) document.querySelector(`#replyContainer-${replyingTo}`)!.insertAdjacentHTML("afterbegin", replyField)
                const newCommentDiv = document.querySelector<HTMLDivElement>("#replyField")!
                const newCommentDiv2 = document.querySelector<HTMLDivElement>("#newComment")!
                setTimeout(() => {
                    newCommentDiv2.style.width = "15rem"
                    newCommentDiv2.style.backgroundColor = "white"
                    newCommentDiv2.style.height = "2.5rem"
                    document.querySelector<HTMLDivElement>("#newCommentForm")!.style.display = "none"
                    newCommentDiv2.className = "btn btn-light text-dark text-center mb-4"

                    newCommentDiv.style.width = "100%"
                    newCommentDiv.style.height = "20rem"
                    newCommentDiv.style.backgroundColor = "#111b31"
                    newCommentDiv.className = "text-light text-start p-3"
                    document.querySelector<HTMLDivElement>("#newReplyForm")!.style.display = "block"

                    document.querySelector("#sendReplyBtn")?.addEventListener("click", async () => {
                        const content = document.querySelector<HTMLTextAreaElement>("#newReplyForm textarea")!
                        if (content.value !== "") await AddComment({
                            id: "",
                            userId: currentUser.id!,
                            newsId: newsID!,
                            repliedCommentId: replyingTo,
                            content: content.value,
                            createdAt: GetFormattedDate(),
                            likers: []
                        }).then(() => Comments())
                        else content.placeholder = "Nem írhatsz üres kommentet!"
                    })
                }, 10);
            })
        })

        document.querySelectorAll(".likeButton").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (loggedIn) {
                    const commentId = (btn.attributes as any)["data-commentId"].textContent
                    let comment
                    for (let c of comments) {
                        if (c.id === commentId) comment = c
                    }

                    if (comment?.userId !== currentUser.id && !comment!.likers.includes(currentUser.id!)) {
                        comment?.likers.push(currentUser.id!)
                    } else {
                        const index = comment!.likers.indexOf(currentUser.id!);
                        if (index !== -1) {
                            comment!.likers.splice(index, 1);
                        }
                    }
                    await UpdateComment(comment!)
                    Comments()
                } else await showPopup({
                    title: "Jelentkezz be a likeoláshoz!",
                    message: undefined,
                    duration: 850
                })

            })
        })

    } else Error(404)
    const newCommentDiv = document.querySelector<HTMLDivElement>("#newComment")!
    newCommentDiv?.addEventListener("click", () => {
        replyingTo = ""
        const reply = document.querySelector<HTMLDivElement>("#replyField")!
        if (reply) {
            reply.style.scale = "0"
            setTimeout(() => {
                reply.remove()
            }, 720);

        }
        if (loggedIn) {
            newCommentDiv.style.width = "100%"
            newCommentDiv.style.height = "20rem"
            newCommentDiv.style.backgroundColor = "#111b31"
            newCommentDiv.className = "text-light text-start p-3"
            document.querySelector<HTMLDivElement>("#newCommentForm")!.style.display = "block"
        } else alert("Jelentkezz be!")
    })

    document.querySelector("#sendCommentBtn")?.addEventListener("click", async () => {
        const content = document.querySelector<HTMLTextAreaElement>("#newCommentForm textarea")!
        if (content.value !== "") await AddComment({
            id: "",
            userId: currentUser.id!,
            newsId: newsID!,
            repliedCommentId: "",
            content: content.value,
            createdAt: GetFormattedDate(),
            likers: []
        }).then(() => Comments())
        else content.placeholder = "Nem írhatsz üres kommentet!"
    })



}