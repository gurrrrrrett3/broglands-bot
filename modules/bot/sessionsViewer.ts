import Discord, { InteractionReplyOptions } from "discord.js";
import SessionPagedEmbed from "../resources/sessionPagedEmbed";
export default class SessionsViewer {
  public static displayOnCommandInteraction(
    interaction: Discord.CommandInteraction
  ): InteractionReplyOptions {
    let player = interaction.options.getString("player", true);
    let page = 0;
    return this.generateOptions(player, page);
  }

  public static editOnButtonInteraction(message: Discord.Message, id: string) {
    const [sess, player, page] = id.split("-");
    message.edit(this.generateOptions(player, parseInt(page)));
  }

  public static generateOptions(player: string, page: number = 0) {
    const pagedEmbed = new SessionPagedEmbed(player);
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId(`sessions-${player}-${page - 1}`)
        .setEmoji("⬅")
        .setDisabled(page == 0)
        .setStyle("PRIMARY"),
      new Discord.MessageButton()
        .setCustomId(`sessions-${player}-${page + 1}`)
        .setEmoji("➡")
        .setDisabled(false)
        .setStyle("PRIMARY")
    );

    return {
      embeds: [pagedEmbed.getEmbed(page)],
      components: [row],
    };
  }
}
