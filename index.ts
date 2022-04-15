import Discord from "discord.js"
import Bot from "./modules/bot/bot";
import auth from "./auth.json";
import isPointInPolygon from "point-in-polygon"

const Client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_TYPING", "GUILD_INTEGRATIONS"],
    partials: ["REACTION"]
});

export const bot = new Bot(Client);

Client.login(auth.BOT_TOKEN);

const point = [ 5575, 1122 ]
const polygon = [ [ 5647, 1199 ], [ 5647, 1056 ], [ 5504, 1056 ], [ 5504, 1199 ] ]
console.log(isPointInPolygon(point, polygon))