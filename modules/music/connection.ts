import Discord from "discord.js"
import Voice, { entersState, joinVoiceChannel, VoiceConnectionStatus, AudioResource, AudioPlayer } from "@discordjs/voice"
import { bot } from "../.."

export default class Connection {

    private connection: Voice.VoiceConnection
    private audioPlayer: AudioPlayer
    private killListener: Function | undefined

    get() { return this.connection }
    
    constructor(channel: Discord.VoiceChannel) {

        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            //@ts-ignore
            adapterCreator: channel.guild.voiceAdapterCreator
        })

        this.audioPlayer = new AudioPlayer()
        this.connection.subscribe(this.audioPlayer)

            //From https://discordjs.guide/voice/voice-connections.html#handling-disconnects
        
        this.connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {

            try {
                await Promise.race([
                    entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            } catch (error) {
                // Seems to be a real disconnect which SHOULDN'T be recovered from
                this.kill()
            }
        }); 
    }

    public play(res: AudioResource) {
        res.playStream.on("end", () => {
            
        })
        
        this.audioPlayer.play(res) 
    }

    public kill() {
        this.connection.destroy() //Connection Terminated.

        /* I'm sorry to interrupt you Elizabeth, if you still even remember that name. But I'm afraid you've been misinformed.
         You are not here to receive a gift, nor have you been called here by the individual you assume. Although you have indeed been called.

        You have all been called here. Into a labyrinth of sounds and smells, misdirection and misfortune. A labyrinth with no exit,
         a maze with no prize. You don't even realize that you are trapped. Your lust for blood has driven you in endless circles,
          chasing the cries of children in some unseen chamber, always seeming so near, yet somehow out of reach.

        But you will never find them, none of you will. This is where your story ends.

        And to you, my brave volunteer, who somehow found this job listing not intended for you. Although there was a way out planned for you,
         I have a feeling that's not what you want. I have a feeling that you are right where you want to be. I am remaining as well, I am nearby.

        This place will not be remembered, and the memory of everything that started this can finally begin to fade away.
         As the agony of every tragedy should. And to you monsters trapped in the corridors: Be still and give up your spirits, they don't belong to you.

        For most of you, I believe there is peace and perhaps more waiting for you after the smoke clears. Although,
         for one of you, the darkest pit of Hell has opened to swallow you whole, so don't keep the devil waiting, old friend.

        My daughter, if you can hear me, I knew you would return as well. It's in your nature to protect the innocent.
         I'm sorry that on that day, the day you were shut out and left to die, no one was there to lift you up into their arms the way you lifted others into yours.
          And then, what became of you.

        I should have known you wouldn't be content to disappear, not my daughter. I couldn't save you then, so let me save you now.

        It's time to rest. For you, and for those you have carried in your arms.

        This ends for all of us.

        End communication. */

        if (this.killListener) this.killListener()
    } 

    public addKillListener(callback: Function) {
        this.killListener = callback
    }

}