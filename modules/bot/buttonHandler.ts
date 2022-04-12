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
    const options = interaction.customId.split("-");
    const [comm, arg1, arg2, arg3] = options;
    
    console.log(options)

    switch (comm) {
      case "sessions":
        SessionsViewer.editOnButtonInteraction(interaction, interaction.customId);
        break;
      default:
        break;
    }
  }
}
