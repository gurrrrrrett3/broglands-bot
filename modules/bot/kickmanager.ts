import Discord from "discord.js";
import fs from "fs";
import path from "path";
export default class KickManager {
  private static readonly KICK_FILE_LOCATION = path.resolve("./data/kicklist.json");
  public kicklist: string[] = [];

  constructor(client: Discord.Client) {
    this.loadKicklist();
    const delay = Math.random() * 5000;
    client.on("guildMemberAdd", (member) => {
      if (this.kicklist.includes(member.user.id)) {
        setTimeout(() => {
          member.kick(`${member.user.tag} was kicked for being on the kicklist. Delay was ${delay}ms`);
        }, delay);
      }
    });
  }

  private loadKicklist() {
    if (!fs.existsSync(KickManager.KICK_FILE_LOCATION)) {
      return;
    }

    const kicklist = fs.readFileSync(KickManager.KICK_FILE_LOCATION, "utf8");
    this.kicklist = JSON.parse(kicklist) as string[];
  }
}
