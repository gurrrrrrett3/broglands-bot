import Discord = require("discord.js");
import { bot } from "../../..";
import PlayerLoginManager from "../../data/playerLoginManager";
import ParkourAdvancedPresence from "../../map/advancedPresence/parkour";
import { getPresence } from "../../map/advancedPresence/presenceManager";
import MapInterface from "../../map/mapInterface";
import { EmbedClass } from "../../resources/types";
import Util from "../util";

export default class PlayerListEmbed implements EmbedClass {
  public channel: Discord.TextChannel;
  public message: Discord.Message | null = null;
  public timer: NodeJS.Timer = setTimeout(() => {
    this.resend();
    //1 hour
  }, 3600000);

  constructor(channel: Discord.TextChannel) {
    this.channel = channel;
    return this;
  }

  public async update(): Promise<void> {
    if (this.message) {
      this.message.edit({ embeds: [await this.getEmbed()] });
    } else {
      this.resend();
    }
  }
  public async resend(): Promise<void> {
    Util.purgeChannel(this.channel, 100).then(async () => {
      this.channel.send({ embeds: [await this.getEmbed()] }).then((msg) => {
        this.message = msg;
      });
    });
  }

  public async getEmbed(): Promise<Discord.MessageEmbed> {
    const embed = await MapInterface.getPlayers().then((players) => {
      players.sort((a, b) => {
        let score = Util.getWorldLevel(a.world) - Util.getWorldLevel(b.world);
        score += a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        return score;
      });

      const afkPlayers = Util.getAfkPlayers();

      const nonAfkPlayers = players.filter((player) => {
        return !player.isAfk();
      });


      const playerList = nonAfkPlayers.map(
        (p) =>
          `**${p.world.replace(/_/, "\\_")}** ${p.getName()} ${ getPresence(p.getLocation())
          } | ${PlayerLoginManager.getFormattedPlaytime(p.name)}`
      );

      const afkList = afkPlayers.map(
        (p) => `${p.getName()} | ${PlayerLoginManager.getFormattedPlaytime(p.name)}`
      );

      const allPlayers = playerList.concat(afkList)

      const broglandsPercent = (Util.getPlayersInBroglands().length / players.length) * 100;

      const des = playerList.join("\n");

      const embed = new Discord.MessageEmbed()
        .setTitle("Online Players")
        .setDescription(des)
        .addField("AFK", afkList.join("\n"))
        .addField(
          "Data",
          `Total: ${allPlayers.length} players\nNon AFK: ${nonAfkPlayers.length}\nAFK: ${afkList.length}\nAFK Percentage: ${(
            (afkPlayers.length / allPlayers.length) *
            100
          ).toFixed(2)}%\nOnline in Nation: ${
            Util.getPlayersInBroglands().length
          }\nNation Percentage: ${broglandsPercent.toFixed(
            2
          )}%\nNation Size: ${Util.getBroglandsResidentCount()} Players\nPlayers in database: ${Util.getPlayersInDatabase()} Players\n\n Last updated: <t:${Math.floor(
            Date.now() / 1000
          )}>`
        )
        .addField(
          "Preformance",
          `Embed limit: ${((des.length / 4096) * 100).toFixed(2)}% (${des.length} / 4096) 
          RAM: ${Math.round(process.memoryUsage().rss / 1000000)}MB \n CPU: ${Math.round(
            process.cpuUsage().user / 1000000
          )}% \n Uptime: ${Util.formatTime(process.uptime() * 1000)} \n Node version: ${process.version}`
        )
        .setColor("#0099ff")
        .setFooter({ text: "Last updated" })
        .setTimestamp();
      return embed;
    });
    return embed;
  }
}
