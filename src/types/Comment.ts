export interface Comment {
    id: string
    userId: string
    newsId: string
    repliedCommentId: string
    content: string
    createdAt: string
    likers: string[]
}