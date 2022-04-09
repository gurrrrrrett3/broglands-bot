import ws from "ws";
import SocketMessageParser from "./socketMessageParser";
export default class SocketManager {
  constructor(public server: ws.Server) {
    server.on("connection", (socket: ws) => {
      this.onConnection(socket);
    });

    server.on("close", (socket: ws) => {
      this.onDisconnect(socket);
    });

    server.on("message", (socket: ws, message: string) => {
        this.onMessage(socket, message);
        });
  }

  public onConnection(socket: ws) {
    console.log("Socket connected");
  }

  public onDisconnect(socket: ws) {
    console.log("Socket disconnected");
  }

  public onMessage(socket: ws, message: string) {
    SocketMessageParser.parse(socket, message);
  }
}
