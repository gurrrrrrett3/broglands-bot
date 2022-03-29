import Discord = require("discord.js");
import { bot } from "../../..";
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
      const playerList = players.map(
        (p) => `**${p.world.replace(/_/, "\\_")}** ${p.name.replace(/_/, "\\_")} ${p.isAfk() ? "[AFK]" : ""}`
      );
      const embed = new Discord.MessageEmbed()
        .setTitle("Players")
        .setDescription(playerList.join("\n") + "\n\n" + `Total: ${playerList.length} players \n Last updated: <t:${Math.floor(Date.now() / 1000)}>`)
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
