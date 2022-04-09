import SocketMessage from "./socketMessage";
import ws from "ws"

export default class SocketMessageParser {

    public static parse(socket: ws, message: string) {
        const parsedMessage: SocketMessage = JSON.parse(message);
        switch (parsedMessage.type) {
            case "ping":
                socket.send(new SocketMessage({
                    "type": "ping",
                    timestamp: Date.now()
                }).toString());
                break;
            case "pong":
                break;
            default:
                console.log("Unknown message type: " + parsedMessage.type);
                break;
        }
    }
}