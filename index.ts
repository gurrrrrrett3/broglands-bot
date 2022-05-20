import Discord from "discord.js"
import Bot from "./modules/bot/bot";
import auth from "./auth.json";
import CanvasUtil from "./modules/canvas/canvasUtil";
import UUIDManager from "./modules/data/player/uuidManager";
import PlayerSessionManager from "./modules/data/player/playerSessionManager";
import fs from "fs"

const Client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_TYPING", "GUILD_INTEGRATIONS"],
    partials: ["REACTION"]
});

export const bot = new Bot(Client);

Client.login(auth.BOT_TOKEN);

//Preform startup repair...
const uuids = UUIDManager.openFile()

let amount = 0
let broken: string[] = []

uuids.forEach((uuid) => {
    const u = uuid.UUID
    let data = PlayerSessionManager.getPlayerSessions({
        amount: -1,
        uuid: u
    })
    let b = 0
    data.forEach((s, i) => {
        if (s.logout.time == 0) {
            data.splice(i, 1)
            amount ++
            b ++
        }
   
    })
    if (b > 0) {
        broken.push(uuid.username)
        fs.writeFileSync(`/root/broglands-bot/data/players/${u}/session.json`, JSON.stringify(data))
    }
})

console.log(`Removed ${amount} broken sessions`)