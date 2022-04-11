import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Discord from "discord.js";
import SessionsViewer from "../bot/sessionsViewer";

const Command = {
  data: new SlashCommandBuilder()
    .setName("sessions")
    .setDescription("Get the recent sessions of a player")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("player")
        .setRequired(true)
        .setDescription("The player to get the sessions of")
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {  
    interaction.reply(SessionsViewer.displayOnCommandInteraction(interaction));
  },
};
module.exports = Command;
