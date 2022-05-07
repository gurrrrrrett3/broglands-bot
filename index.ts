import Discord from "discord.js"
import Bot from "./modules/bot/bot";
import auth from "./auth.json";
import CanvasUtil from "./modules/canvas/canvasUtil";

const Client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_TYPING", "GUILD_INTEGRATIONS"],
    partials: ["REACTION"]
});

export const bot = new Bot(Client);

Client.login(auth.BOT_TOKEN);


//Testing
CanvasUtil.convertMinecraftFormat("&btest")