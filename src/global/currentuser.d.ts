declare global {
  interface Window {
    // Ide írd be a globális változód nevét és a típusát
    globalisUser: {
        id?: string
        email: string 
        name: string
        author: boolean
    } | null; // Kezdetben null, amíg nincs bejelentkezve
  }
}
export {}