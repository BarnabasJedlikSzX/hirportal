export interface Comment {
    id: string
    userId: string
    newsId: string
    repliedCommentId: string
    likes: number
    content: string
    createdAt: string
    likers:string[]
}