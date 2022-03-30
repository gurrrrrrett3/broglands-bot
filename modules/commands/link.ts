import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import Discord from 'discord.js';
import { bot } from '../..'

const Command = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your minecraft account to your discord account')
        .addStringOption(
            new SlashCommandStringOption().setName('username').setDescription('Minecraft username').setRequired(true)
        )
        ,
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
            const username = interaction.options.getString('username', true);
            
            bot.linkManager.newLink(interaction, username);
        }
}
module.exports = Command;