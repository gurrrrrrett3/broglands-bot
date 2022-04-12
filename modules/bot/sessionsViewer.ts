import Discord, { InteractionReplyOptions } from "discord.js";
import PlayerSessionManager from "../data/player/playerSessionManager";
import UUIDManager from "../data/player/uuidManager";
import SessionPagedEmbed from "../resources/sessionPagedEmbed";

//Handles generating the session embeds

export default class SessionsViewer {
  
  /**
   * Generates an embed set on page 0 for player sessions
   * @param interaction CommandInteraction from the /sessions command
   * @returns options to generate a new message
   */
  public static displayOnCommandInteraction(
    interaction: Discord.CommandInteraction
  ): InteractionReplyOptions {
    let player = interaction.options.getString("player", true);
    let page = 0;
    return this.generateOptions(player, page);
  }

  /**
   * Edit the options when a button is clicked
   * @param interaction 
   * @param id 
   */
  public static editOnButtonInteraction(interaction: Discord.ButtonInteraction , id: string) {
    const [sess, player, page] = id.split("-");
    interaction.update(this.generateOptions(player, parseInt(page))) 
  }
/**
 * Generates options to use in an interactionReply
 * @param player Player to search for
 * @param page page to get
 * @returns options to generate a new message
 */
  public static generateOptions(player: string, page: number = 0) {
    const pagedEmbed = new SessionPagedEmbed(player);
    const totalPageCount = Math.ceil(PlayerSessionManager.getTotalSessionCount(UUIDManager.getUUID(player) ?? "") / 10)
    console.log(totalPageCount)
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId(`sessions-${player}-0`)
        .setEmoji("⏪")
        .setDisabled(page == 0)
        .setStyle("SUCCESS"),
      new Discord.MessageButton()
        .setCustomId(`sessions-${player}-${page - 1}-start`)
        .setEmoji("⬅")
        .setDisabled(page == 0)
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId(`sessions-${player}-${page + 1}`)
        .setEmoji("➡")
        .setDisabled(totalPageCount == page + 1)
        .setStyle("PRIMARY"),
        new Discord.MessageButton()
        .setCustomId(`sessions-${player}-${totalPageCount - 1}-end`)
        .setEmoji("⏩")
        .setDisabled(page == totalPageCount - 1)
        .setStyle("SUCCESS"),
    );

    return {
      embeds: [pagedEmbed.getEmbed(page)],
      components: [row],
    };
  }
}
