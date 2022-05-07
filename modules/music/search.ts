import yts from "ytsr"

export default class MusicSearch {

    public static async youtube(query: string) {
        return yts(query, {
            pages: 1
        })
    }

    public static async continue(sr: yts.Result | yts.ContinueResult) {
        if (sr.continuation) {
        return yts.continueReq(sr.continuation)
        } else {
            console.error("FATAL ERROR: Invalid search result")
            process.exit()
        }
    }
}