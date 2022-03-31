import Discord = require("discord.js");
import { bot } from "../../..";
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

      const afkPlayers = players.filter((player) => {
        return player.isAfk();
      });

      const nonAfkPlayers = players.filter((player) => {
        return !player.isAfk();
      });

      players = nonAfkPlayers.concat(afkPlayers);

      const playerList = players.map(
        (p) =>
          `**${p.world.replace(/_/, "\\_")}** ${p.name.replace(/_/, "\\_")} ${
            p.isAfk() ? " | **AFK**" : getPresence(p.getLocation())
          }`
      );
      const embed = new Discord.MessageEmbed()
        .setTitle("Players")
        .setDescription(
          playerList.join("\n") +
            "\n\n" +
            `Total: ${playerList.length} players \n Last updated: <t:${Math.floor(Date.now() / 1000)}>`
        )
        .addField(
          "Preformance",
          `RAM: ${Math.round(process.memoryUsage().rss / 1000000)}MB \n CPU: ${Math.round(
            process.cpuUsage().user / 1000000
          )}% \n Uptime: ${Math.round(process.uptime() / 60)}m \n Node version: ${process.version}`
        )
        .setColor("#0099ff")
        .setFooter({ text: "Last updated" })
        .setTimestamp();
      return embed;
    })
  return embed;
  }
}
