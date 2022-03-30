import Discord from "discord.js"
import Bot from "./modules/bot/bot";
import auth from "./auth.json";

const Client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_TYPING", "GUILD_INTEGRATIONS"]
});

export const bot = new Bot(Client);

Client.login(auth.BOT_TOKEN);

