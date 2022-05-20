import ws from "ws";
import SocketMessageParser from "./socketMessageParser";
import SocketSessionManager from "./socketSessionManager";
export default class SocketManager {
  constructor(public server: ws.Server) {
    server.on("connection", (socket , req) => {
      this.onConnection(socket);

      socket.on("message", (data) => {
        this.onMessage(socket, data.toString("utf-8"))
      })

      socket.on("close", (code, reason) => {
        this.onDisconnect(socket, code, reason.toString("utf-8"))
      })
    });
  }

  public onConnection(socket: ws.WebSocket) {
    SocketSessionManager
  }

  public onDisconnect(socket: ws.WebSocket, code: number, reason: string) {
    console.log("Socket disconnected");
  }

  public onMessage(socket: ws, message: string) {
    console.log(message)
    
    
  }
}
