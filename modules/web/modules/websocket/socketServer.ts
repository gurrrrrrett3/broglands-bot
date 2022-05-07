import ws, { WebSocketServer } from "ws";
import SocketManager from "./socketManager";

export default class SocketServer {

    private server: ws.Server;
    public manager: SocketManager;

    constructor() {
        this.server = new WebSocketServer({
           noServer: true
        })
        this.manager = new SocketManager(this.server);
    }

    get() {
        return this.server
    }
}