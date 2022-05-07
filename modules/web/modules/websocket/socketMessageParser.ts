import ws from "ws"

export default class SocketMessageParser {

    public static parse(socket: ws, message: string) {
       let options = message.split("\n")
       
        /* MESSAGE TYPES

        <title>
        Date.now()
        Username
        <OTHER DATA>

        --Conection message
        CONNECTION
        Date
        Username
        null

        --Chat Meessage
        MESSAGE
        Date
        Username
        Message

        */

    }
}