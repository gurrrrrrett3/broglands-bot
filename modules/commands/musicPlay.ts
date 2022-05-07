import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord, { VoiceChannel } from "discord.js";
import { bot } from "../..";
import SearchEmbed from "../music/resources/searchEmbed";

const Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("MUSIC | Play a song by name, or youtube URL")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("query")
        .setDescription("The search query or URL of the song.")
        .setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const member = interaction.member as Discord.GuildMember;
    const vc = member.voice.channel; 
    const query = interaction.options.getString("query", true);
    
    if (!vc) {
      return interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle("Oops!")
            .setDescription("You need to be in a Voice Channel to use this command!")
            .setTimestamp(),
        ],
      });
    }
    const gm = bot.music.getGuildMusicManager(vc?.guildId ?? "", vc as Discord.VoiceChannel)

    if (gm.isInVoiceChannel() && gm.channel.id != vc.id) {
      return interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle("Oops!")
            .setDescription(
              "I'm already playing something somewhere else! Stop the queue there before playing it here!"
            )
            .setTimestamp(),
        ],
      });
    }


    const p = new SearchEmbed(query);

    await interaction.reply(await p.get(1));
  },
};
module.exports = Command;