import Discord = require("discord.js");
import { bot } from "../../..";
import ParkourAdvancedPresence from "../../map/advancedPresence/parkour";
import { getPresence } from "../../map/advancedPresence/presenceManager";
import MapInterface from "../../map/mapInterface";
import { EmbedClass } from "../../resources/types";
import Util from "../util";

export default class PlayerListEmbed implements EmbedClass {
  public channel: Discord.TextChannel;
  public messages: Discord.Message[] = [];

  constructor(channel: Discord.TextChannel) {
    this.channel = channel;
    return this;
  }

  public update(): void {
    MapInterface.getPlayers().then((players) => {
      
      players.sort((a, b) => {
        let score = Util.getWorldLevel(a.world) - Util.getWorldLevel(b.world)
        score += a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        return score;
      })

      const afkPlayers = players.filter((player) => {
        return player.isAfk();
      });

      const nonAfkPlayers = players.filter((player) => {
        return !player.isAfk();
      });

      players = nonAfkPlayers.concat(afkPlayers);

      const playerList = players.map(
        (p) => `**${p.world.replace(/_/, "\\_")}** ${p.name.replace(/_/, "\\_")} ${p.isAfk() ? " | **AFK**" : getPresence(p.getLocation())}`
      );
      const embed = new Discord.MessageEmbed()
        .setTitle("Players")
        .setDescription(playerList.join("\n") + "\n\n" + `Total: ${playerList.length} players \n Last updated: <t:${Math.floor(Date.now() / 1000)}>`)
        .addField("Preformance", `RAM: ${Math.round(process.memoryUsage().rss / 1000000)}MB \n CPU: ${Math.round(process.cpuUsage().user / 1000000)}% \n Uptime: ${Math.round(process.uptime() / 60)}m \n Node version: ${process.version}`)
        .setColor("#0099ff")
        .setFooter({ text: "Last updated" })
        .setTimestamp();

      if (this.messages.length > 0) {
        this.messages.forEach((m) => {
          m.edit({ embeds: [embed] });
        });
      } else {
        Util.purgeChannel(this.channel, 100).then(() => {
          this.channel.send({ embeds: [embed] }).then((msg) => {
            this.messages.push(msg);
          });
        });
      }
    });
  }
}
