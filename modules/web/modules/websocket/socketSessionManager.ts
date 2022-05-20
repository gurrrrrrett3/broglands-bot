import SocketSession from "./socketSession";
import ws from "ws"

export default class SocketSessionManager {

    public sessions: SocketSession[] = []
    
    
    constructor() {

    }

    public newSession(socket: ws.WebSocket) {
        let session = new SocketSession(socket)
        this.sessions.push(session)
    }
    

}