import Dicord from "discord.js";
import TownDataManager from "../data/townDataManager";
import MapUpdate from "../map/mapUpdate";
import CommandHandler from "./commandHandler";
import EmbedManager from "./embedManager";
import KickManager from "./kickmanager";
import LinkManager from "./linkManager";
import UpdateEmbed from "./updateEmbed";
export default class Bot {
  public Client: Dicord.Client;
  public CommandHandler: CommandHandler;
  public kickmanager: KickManager;
  public embedManager: EmbedManager;
  public mapUpdate: MapUpdate;
  //@ts-ignore
  public townDataManager: TownDataManager;
  //@ts-ignore
  public updateEmbedManager: UpdateEmbed;
  public linkManager: LinkManager;

  public updateInterval = setInterval(() => {
    this.embedManager.updateEmbeds();
  }, 10000);

  constructor(client: Dicord.Client) {
    this.Client = client;
    this.CommandHandler = new CommandHandler(client);
    this.kickmanager = new KickManager(client);
    this.embedManager = new EmbedManager(client);
    this.mapUpdate = new MapUpdate();
    this.linkManager = new LinkManager(client);

    this.Client.on("ready", () => {
      console.log(`Logged in as ${this.Client.user?.tag}`);

      this.updateEmbedManager = new UpdateEmbed(client);

      //Register Embeds
      Promise.all([this.embedManager.registerEmbed("playerlist", "953652154579681380", "playerlist")]).then(
        () => {
          this.embedManager.updateEmbeds();
          this.townDataManager = new TownDataManager();
        }
      );
    });

    this.Client.on("messageCreate", (message) => {

      if (message.author.bot) return;

      if (message.content.toLowerCase().includes("broglands")) {
        message.reply("Broglands")
      }

    })
  }
}
