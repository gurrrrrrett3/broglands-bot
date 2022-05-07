import { Router } from 'express';
import ews from 'express-ws';

const router = Router();

router.ws("/mod", (ws, req) => {
    ws.on('message', (message) => {

        /* Messsage Format

        all messages are seperated by a newline
        
        On Connect:
        
        CONNECT
        <username>  
        <dateTime> (epoch)
        <serverState> (0 = offline, 1 = online)
        <serverIP> (if online)

        On Chat Message:

        MESSAGE
        <username>
        <dateTime> (epoch)
        <message>
        
        */

        //Clean message
        let messageArray = message.toString().split("\n");
        let messageType = messageArray[0];
        let username = messageArray[1];
        let dateTime = messageArray[2];
        let index4 = messageArray[3];
        let index5 = messageArray[4];
        let index6 = messageArray[5];

        switch (messageType) {
            case "CONNECT":
            console.log(`${username} connected`);
            break;
            case "MESSAGE":
            console.log(`${index4}`);
            break;
            default:
            console.log(`Unknown message type: ${messageType}`);
            break;
        }          
    })

})


export default router;