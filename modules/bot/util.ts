import Discord from "discord.js";
import fs from "fs";
import Player from "../resources/player";
import Town, { TownData } from "../resources/town";
import { TownDataFile } from "../resources/types";
export default class Util {
  public static async purgeChannel(channel: Discord.TextChannel, limit: number) {
    const messages = await channel.messages.fetch({ limit: limit });

    await channel.bulkDelete(messages);
  }

  public static getTownFile(): Town[] {
    const towns = JSON.parse(fs.readFileSync("./data/towns.json", "utf8")) as TownDataFile[];
    return towns.map((t) => new Town(t.world, t as TownData));
  }

  public static getPlayerFile(): Player[] {
    return JSON.parse(fs.readFileSync("./data/players.json", "utf8")) as Player[];
  }

  public static formatPlayer(player: string): string {
    return player.replace(/\s/g, "_");
  }

  public static bound(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  
}