import { EmbedBuilder } from "@discordjs/builders";
import { Colors } from "discord.js";
import SlashCommandBuilder from "../../../core/loaders/objects/customSlashCommandBuilder";

const Command = new SlashCommandBuilder()
  .setName("constitution")
  .setEnabled(false)
  .setDescription("View the constitution of the server.")
  .setFunction(async (interaction) => {
        interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Broglands Discord Rules")
                    .setDescription("**1.** Respect all members and treat them with kindness and fairness.\n**2.** No hate speech or discrimination.\n**3.** No spamming messages or excessive use of capital letters, emojis, or voice changers.\n**4.** No sharing personal information of yourself or others.\n**5.** Do not excessively argue or cause drama in the discord.\n**6.** If you have a problem with another member, try to resolve it peacefully through private messaging.\n**7.** Use appropriate channels for specific types of discussions or topics.\n**8.** Have fun and enjoy the community!")
                    .setColor(Colors.Yellow)
            ]
        })
  });

export default Command;