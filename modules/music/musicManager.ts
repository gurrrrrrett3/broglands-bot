import { AudioResource } from "@discordjs/voice"
import Discord from "discord.js"
import Connection from "./connection"
import GuildManager from "./guildManager"
import Queue from "./queue"
import Track from "./track"

export default class MusicManager {

    public client: Discord.Client
    public guilds: GuildManager[] = []


    constructor(client: Discord.Client) {

        this.client = client

    }

    public newGuild(channel: Discord.VoiceChannel) {
        const gm = new GuildManager(channel)
        this.guilds.push(gm)
        return gm
    }

    public getGuildMusicManager(guildId:  string, vc: Discord.VoiceChannel) {
        let gm = this.guilds.find((m) => m.guild.id == guildId)
        if (gm) {
            return gm
        } else {
            gm = new GuildManager(vc)
            return gm
        }
    }


}