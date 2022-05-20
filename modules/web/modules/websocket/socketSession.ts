import ws from "ws"
import ChatParser from "../../../bot/chat/chatParser";
import IncomingMessage from "../../../bot/chat/incomingMessage";
import SocketMessageParser from "./socketMessageParser";

export default class SocketSession {

    public socket: ws.WebSocket;
    public username: string;
    public desync: number;


    constructor(socket: ws.WebSocket) {

        this.socket = socket;

        this.desync = 0;
        this.username = "";

        this.socket.on("message", (message) => {
            let data = SocketMessageParser.parse(this.socket, message.toString());  
            if (!data) return;
            
            switch (data.type) {
                case "CONNECT":
                    this.username = data.username;
                    this.desync = Date.now() - data.date.getTime();

                    console.log(`${this.username} has connected to the websocket with an estimated desync of ${this.desync}.`)
                    break
                case "MESSAGE":
                    this.onMessage(data.message as string, data.date)
                    break;
            }
        });
    }

    public onMessage(message: string, time: Date = new Date()) {
       ChatParser.parse(new IncomingMessage({
              username: this.username,
                time: time,
                message: message
            }));

    }

    public send(message: string) {
        this.socket.send(message);
    }

    public disconnect() {
        this.socket.close();
    }
}