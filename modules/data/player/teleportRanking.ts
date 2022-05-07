import { TeleportData, TeleportRank } from "./types";
import path from "path";
import fs from "fs";
import { WorldLocation } from "../../resources/types";
import Util from "../../bot/util";
import Player from "../../resources/player";

export default class TeleportRanking {
  public static readonly TELEPORT_DATA_FILE = path.resolve("./data/teleportData.json");

  public static onTeleport(player: Player, tele: TeleportData) {
    const data = this.openTeleportDataFile();
    const td = this.getTeleportByWorldLocation(tele.end);
    // If the teleport is in the same place as a previous teleport, increment the count
    if (td) {
      if (td.world.includes("resource")) return;
      td.count++; 
      if (!td.firstUsed) td.firstUsed = td.lastUsed;
      td.lastUsed = Date.now();
      if (!td.players.includes(player.uuid)) {
        td.players.push(player.uuid);
      }

     
      //sort player list to put uuid at top
      td.players.sort((a, b) => {
        if (a == player.uuid) return -1;
        if (b == player.uuid) return 1;
        return 0;
      });

      //save data
      const i = data.findIndex((t) => t.name == td.name);
      data[i] = td;
    } else {
      // If the teleport is not in the same place as a previous teleport, create a new teleport
      const tData: TeleportRank = {
        name: `${tele.end.world}|${tele.end.x}|${tele.end.z}`,
        count: 1,
        players: [player.uuid],
        world: tele.end.world,
        x: tele.end.x,
        z: tele.end.z,
        lastUsed: Date.now(),
        owner: undefined,
        description: undefined,
        tags: undefined,
        editedBy: undefined,
        firstUsed: Date.now(),
      };
      data.push(tData);
    }
    this.saveTeleportData(data);
  }

  public static getTeleportByWorldLocation(loc: WorldLocation) {
    return this.openTeleportDataFile().find(
      (r) =>
        r.world == loc.world &&
        Util.getDistance(
          {
            x: r.x,
            z: r.z,
          },
          {
            x: loc.x,
            z: loc.z,
          }
        ) < 5
    );
  }

  public static getTeleportDataByName(name: string) {
    return this.openTeleportDataFile().find((r) => r.name.toLowerCase() == name.toLowerCase());
  }

  public static getTeleportDataByCoords(x: number, z: number, world: string) {
    return this.openTeleportDataFile().find((r) => r.x == x && r.z == z && r.world == world);
  }

  public static editTeleportData(
    name: string,
    data: {
      name?: string;
      owner?: string;
      description?: string;
      tags?: string[];
      editedBy: string;
    }
  ) {
    const f = this.openTeleportDataFile();
    const tele = this.getTeleportDataByName(name);
    const index = f.findIndex((r) => r.name == tele?.name);

    if (!tele) return `Could not find teleport with name ${name}`;

    tele.name = data.name || tele.name;
    tele.owner = data.owner || tele.owner;
    tele.description = data.description || tele.description;
    tele.tags = data.tags || tele.tags;
    tele.editedBy = data.editedBy;

    f[index] = tele;
    this.saveTeleportData(f);

    return `Teleport data for ${tele.name} has been edited.`;
  }

  public static getLeaderboard(sortBy: "uses" | "unique" | "ratio") {
    const tele = this.openTeleportDataFile();
    const sorted = tele.sort((a, b) => {
      if (sortBy == "uses") {
        return b.count - a.count;
      } else if (sortBy == "unique") {
        return b.players.length - a.players.length;
      } else if (sortBy == "ratio") {
        return b.count / b.players.length - a.count / a.players.length;
      } else {
        return 0;
      }
    });
    return sorted.slice(0, 25);
  }

  public static getDataSummary() {
    const tele = this.openTeleportDataFile();

    let players: string[] = [];

    tele.forEach((r) => {
      r.players.forEach((p) => {
        if (!players.includes(p)) players.push(p);
      }
      );
    });

    return {
      total: tele.length,
      uses: tele.reduce((a, b) => a + b.count, 0),
      players: tele.reduce((a, b) => a + b.players.length, 0),
      unique: players.length,
    }
  }

  public static openTeleportDataFile() {
    return JSON.parse(fs.readFileSync(this.TELEPORT_DATA_FILE, "utf-8")) as TeleportRank[];
  }

  public static saveTeleportData(data: TeleportRank[]) {
    fs.writeFileSync(
      this.TELEPORT_DATA_FILE,
      JSON.stringify(
        data.sort((a, b) => b.count - a.count),
        null,
        4
      )
    );
  }
}