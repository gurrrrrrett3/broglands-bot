import { Client, Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";

export default class SelectMenuManager {
  public modals: Map<string, Function> = new Map();

  constructor(private client: Client) {
    this.client.on("interactionCreate", (interaction) => {
      if (!interaction.isModalSubmit()) return;

      const menuId = interaction.customId;
      const menuFunc = this.modals.get(menuId);
      if (!menuFunc) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(`This Modal has expired.`)
              .setColor(Colors.Red)
              .setFooter({ text: `modalId: ${interaction.customId}` }),
          ],
          ephemeral: true,
        });
        return;
      }
      menuFunc(interaction);
    });
  }

  public registerModal(id: string, callback: (interaction: ModalSubmitInteraction) => Promise<any>) {
    this.modals.set(id, callback);
  }

  public unregisterModal(id: string) {
    this.modals.delete(id);
  }
}
