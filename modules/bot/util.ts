import Discord from "discord.js";
import fs from "fs";
import Player from "../resources/player";
import Town from "../resources/town";
export default class Util {
  public static async purgeChannel(channel: Discord.TextChannel, limit: number) {
    const messages = await channel.messages.fetch({ limit: limit });

    await channel.bulkDelete(messages);
  }

  public static getTownFile(): Town[] {
    return JSON.parse(fs.readFileSync("./data/towns.json", "utf8")) as Town[];
  }

  public static getPlayerFile(): Player[] {
    return JSON.parse(fs.readFileSync("./data/players.json", "utf8")) as Player[];
  }
}
