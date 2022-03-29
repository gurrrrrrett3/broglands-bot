import { SlashCommandBuilder } from '@discordjs/builders';
import Discord from 'discord.js';
import { bot } from "../.."

const Command = {
    data: new SlashCommandBuilder()
        .setName('kicklist')
        .setDescription('ADMIN COMMAND: Lists all users on the kicklist.'),
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
            if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
                interaction.reply("You do not have permission to use this command.");
                return;
            }
            const kicklist = bot.kickmanager.kicklist;
            await interaction.reply(`\`\`\`${kicklist.join("\n")}\`\`\``);
        }
}
module.exports = Command;