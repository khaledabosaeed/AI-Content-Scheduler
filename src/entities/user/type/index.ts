export type User = {
    id: string,
    username: string,
    image?: string,
    role: "admin" | "user" | "moderator"
    createdAt: string
}