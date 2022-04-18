import { TeleportData, TeleportRank } from "./types";
import path from "path";
import fs from "fs";
import { WorldLocation } from "../../resources/types";
import Util from "../../bot/util";
import Player from "../../resources/player";

export default class TeleportRanking {
  public static readonly TELEPORT_DATA_FILE = path.resolve("./data/teleportData.json");

  public static onTeleport(player: Player, tele: TeleportData) {
      const data = this.openTeleportDataFile()
      const td = this.getTeleportByWorldLocation(tele.end)
      if (td) {
          if (td.world.includes("resource")) return
          td.count ++
          if (!td.players.includes(player.uuid)) {
            td.players.push(player.uuid)
          }
        const i = data.findIndex((t) => t.name == td.name)
        data[i] = td
      } else {
          const tData: TeleportRank = {
                name: `${tele.end.world}|${tele.end.x}|${tele.end.z}`,
                count: 1,
                players: [player.uuid],
                world: tele.end.world,
                x: tele.end.x,
                z: tele.end.z,
                lastUsed: Date.now()
          }
          data.push(tData)
      }
      this.saveTeleportData(data)
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

  public static openTeleportDataFile() {
    return JSON.parse(fs.readFileSync(this.TELEPORT_DATA_FILE, "utf-8")) as TeleportRank[];
  }

  public static saveTeleportData(data: TeleportRank[]) {
    fs.writeFileSync(this.TELEPORT_DATA_FILE, JSON.stringify(data, null, 4));
  }
}
