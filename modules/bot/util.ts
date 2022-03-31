import Discord from "discord.js";
import fs from "fs";
import Player, { PlayerOptions } from "../resources/player";
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
    const players = JSON.parse(fs.readFileSync("./data/players.json", "utf8")) as PlayerOptions[];
    return players.map((p) => new Player(p));
  }

  public static formatPlayer(player: string): string {
    return player.replace(/\s/g, "_");
  }

  public static bound(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  public static getMemberList() {
    const towns = Util.getTownFile();
    let residents: string[] = [];
    towns.forEach((town) => {
      town.residents.forEach((resident) => {
        residents.push(resident);
      });
    });
    return residents;
  }

  public static getTownList() {
    const towns = Util.getTownFile();
    let townsList: string[] = [];
    towns.forEach((town) => {
      townsList.push(town.name);
    });
    return townsList;
  }

  public static getResidentRankList(): {
    name: string;
    rank: "resident" | "assistant" | "mayor";
  }[] {
    const towns = Util.getTownFile();
    let residents: {
      name: string;
      rank: "resident" | "assistant" | "mayor";
    }[] = [];
    towns.forEach((town) => {
      town.residents.forEach((resident) => {
        residents.push({
          name: resident,
          rank:
            town.mayor === resident ? "mayor" : town.assistants.includes(resident) ? "assistant" : "resident",
        });
      });
    });
    return residents;
  }

  public static getUserRank(user: string): "resident" | "assistant" | "mayor" | "none" {

    const residents = Util.getResidentRankList();
    const resident = residents.find((r) => r.name === user);
    if (resident) {
      return resident.rank;
    }
    return "none";
  }

  public static getTown(name: string) {
    const towns = Util.getTownFile();
    return towns.find((t) => t.name === name);
  }

  public static getUserTown(user: string) {
    const towns = Util.getTownFile();
    return towns.find((t) => t.residents.includes(user));
  }

  public static getWorldLevel(world: string) {
    const worlds = [
      "world",
      "earth",
      "parkour",
      "extras",
      "hotel",
      "world_nether",
      "world_the_end",
      "resource",
      "nether_resource",
    ]

    return worlds.indexOf(world);
  }
}
