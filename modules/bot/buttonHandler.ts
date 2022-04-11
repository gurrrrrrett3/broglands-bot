import { ButtonInteraction, Client } from "discord.js";
import SessionsViewer from "./sessionsViewer";

export default class ButtonHandler {
  public client: Client;

  constructor(client: Client) {
    this.client = client;

    client.on("interactionCreate", (interaction) => {
      if (interaction.isButton()) {
        this.handleButtonInteraction(interaction);
      }
    });
  }

  private handleButtonInteraction(interaction: ButtonInteraction) {
    const options = interaction.id.split("-");
    const [comm, arg1, arg2, arg3] = options;

    if (interaction.message.type != "REPLY") return;

    switch (comm) {
      case "sessions":
        SessionsViewer.editOnButtonInteraction(interaction.message, interaction.customId);
        break;
      default:
        break;
    }
  }
}
