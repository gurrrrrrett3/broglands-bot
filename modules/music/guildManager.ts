import Discord from "discord.js"
import Connection from "./connection"
import Queue from "./queue"
import Track from "./track"
export default class GuildManager {

    public guild: Discord.Guild
    public connection: Connection | undefined
    public queue: Queue 

    constructor(public channel: Discord.VoiceChannel) {
        this.guild = channel.guild
        this.queue = new Queue(this.guild.id)
    }

    public join() {
        this.connection = new Connection(this.channel)
    }

    public async play(track: Track) {
        this.connection?.play(await track.get())
    }

    public enqueue(track: Track) {
        this.queue.enqueue(track)
    }

    public skip() {
        this.queue.skip()
    }

    public disconnect() {
        if (this.connection) this.connection.kill()
    } 

    public stop() {
        this.queue.clear()
        this.disconnect()
    }

    public isInVoiceChannel() {
        return this.connection != undefined
    }



}