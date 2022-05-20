import ws from "ws";

export default class SocketMessageParser {
  public static parse(socket: ws, message: string) {
    let options = message.split("\n");

    /* MESSAGE TYPES

        <title>
        Date.now()
        Username
        <OTHER DATA>

        --Conection message
        CONNECT
        Date
        Username
        null

        --Chat Meessage
        MESSAGE
        Date
        Username
        Message

        */

    let date = new Date(options[1]);
    let username = options[2];

    switch (options[0]) {
      case "CONNECT":
        return {
          type: "CONNECT",
          date: date,
          username: username,
        };
      case "MESSAGE":
        return {
          type: "MESSAGE",
          date: date,
          username: username,
          message: options[3],
        };
    }
  }
}
