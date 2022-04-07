import Discord from "discord.js";
import fs from "fs";
import Player, { PlayerOptions } from "../resources/player";
import Town, { TownData } from "../resources/town";
import { Coords, TownDataFile } from "../resources/types";
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
    //escape all underscores
    return player.replace(/_/g, "\\_");
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

  public static getOnlinePlayer(name: string) {
    return Util.getPlayerFile().find((p) => p.name.toLowerCase() === name.toLowerCase());
  }

  public static getDistance(a: Coords, b: Coords) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.z - b.z, 2));
  }

  public static getPlayersInBroglands() {
    const players = Util.getPlayerFile();

    return players.filter((p) => {
      const playerTown = Util.getUserTown(p.name);
      return playerTown && playerTown.nation === "Broglands";
    });
  }

  public static getBroglandsResidentCount() {
    let playercount = 0;
    const towns = Util.getTownFile();
    towns.forEach((town) => {
      if (town.nation === "Broglands") {
        playercount += town.residents.length;
      }
    });
    return playercount;
  }

  public static getPlayersInDatabase() {
    let playercount = 0;
    const towns = Util.getTownFile();
    towns.forEach((town) => {
      playercount += town.residents.length;
    });
    return playercount;
  }

  public static getAfkPlayers() {
    const players = Util.getPlayerFile();
    return players.filter((p) => p.isAfk());
  }

  public static formatTime(time: number) {
    const days = Math.floor(time / 86400000);
    const hours = Math.floor((time % 86400000) / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor(time % 1000);

    return [
      days > 0 ? `${days}d` : "",
      hours > 0 ? `${hours}h` : "",
      minutes > 0 ? `${minutes}m` : "",
      seconds > 0 ? `${seconds}s` : "",
    ]
      .filter((t) => t !== "")
      .join(" ");
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
    ];

    return worlds.indexOf(world);
  }
}
