import Discord from "discord.js";
import UUIDManager from "../data/player/uuidManager";
import PlayerSessionManager from "../data/player/playerSessionManager";
import Util from "../bot/util";
import PlayerLoginManager from "../data/playerLoginManager";
export default class SessionPagedEmbed {
  public username: string;
  public uuid: string;

  constructor(username: string) {
    this.username = username;
    this.uuid = UUIDManager.getUUID(username) || "";
  }

  public getEmbed(page: number) {
    const sessions = PlayerSessionManager.getPlayerSessionsByPage(this.uuid, page);

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${this.username}'s sessions`)
      .setFooter({ text: `Page ${page + 1}` });

    let disc: string[] = [];
    disc.push(`**${PlayerSessionManager.getTotalSessionCount(this.uuid)} sessions found over ${Util.formatTime(PlayerSessionManager.getPlayerPlaytime({uuid: this.uuid, before: Date.now()}))}**`);

    for (const session of sessions) {
      const login = session.login.time;
      const logout = session.logout.time;

      if (logout == 0) {
        disc.push(`${Util.formatDiscordTime(login, "shortDateTime")} - Currently online | ${PlayerLoginManager.getFormattedPlaytime(this.username)}`);
      } else {
        disc.push(
          `${Util.formatDiscordTime(login, "shortDateTime")} - ${Util.formatDiscordTime(
            logout,
            "shortDateTime"
          )} | ${Util.formatTime(logout - login)}`
        );
      }
    }

    embed.setDescription(disc.join("\n"));

    return embed;
  }
}
