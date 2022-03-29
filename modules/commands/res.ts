import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import GetPlayerInfo from "../data/getPlayerInfo";

const Command = {
  data: new SlashCommandBuilder()
    .setName("res")
    .setDescription("Get info on player")
    .addStringOption(
      new SlashCommandStringOption().setName("name").setDescription("Player IGN").setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const options = interaction.options
    const data = GetPlayerInfo.res(options.getString("name", true))
    const online = data.online ? `Currently on ${data.online.world}` : "Offline"
    
    const embed = new Discord.MessageEmbed()
        .setTitle(GetPlayerInfo.getPlayerNameCapitalized(data.name) || data.name)
        .setColor(data.online ? "#00ff00" : "#ff0000")
        .addField("Town", data.town, true)
        .addField("Online", online, true)
    
    if (data.mayor) embed.addField("Roles", `Mayor of ${data.town}`, true)
    if (data.assistant) embed.addField("Roles", `Assistant for ${data.town}`, true)
    
    interaction.reply({embeds: [embed]})
  },
};
module.exports = Command;
