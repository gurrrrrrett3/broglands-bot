import Player from "../../resources/player";
import config from "../../../config.json";
import Util from "../../bot/util";
import PlayerDataManager from "./playerDataManager";
import TeleportRanking from "./teleportRanking";
import { GetPlayerSessionOptions } from "./playerSessionManager";

export default class PlayerTeleportManager {
  public static handleTeleports(ops: Player[], nps: Player[]): void {
    const plist = ops.filter((v) => nps.find((p) => p.uuid == v.uuid));
    //@ts-ignore
    plist.forEach((p) =>
      this.handleTeleport(
        ops.find((o) => o.uuid == p.uuid) as Player,
        nps.find((n) => n.uuid == p.uuid) as Player
      )
    );
  }

  private static handleTeleport(op: Player, np: Player) {
    const dis = Util.getDistance(op.getCoords(), np.getCoords());
    if (config.TELEPORT.DISTANCE > dis && op.world == np.world) return;

    const data = PlayerDataManager.openPlayerData(op.uuid, "teleport");
    const tpd = {
      time: Date.now(),
      start: op.getLocation(),
      end: np.getLocation(),
    };

    data.push(tpd);

    TeleportRanking.onTeleport(np, tpd);
    PlayerDataManager.savePlayerData(op.uuid, "teleport", data);

    console.log(`${np.name} teleported from ${op.world} to ${np.world}, traveled ${dis} blocks`);
  }

  public static getTimedTeleportCount(uuid: string, after?: number, before?: number) {
    const teleports = PlayerDataManager.openPlayerData(uuid, "teleport");

    const a = after || 0;
    const b = before || Date.now();

    const filteredteleports = teleports.filter((teleport) => {
      if (teleport.time < a) {
        return false;
      }
      if (teleport.time > b) {
        return false;
      }
      return true;
    });

    return filteredteleports.length;
  }

  public static getPlayerTeleportsByPage(page: number, options: GetPlayerSessionOptions) {
    const teleports = PlayerDataManager.openPlayerData(options.uuid, "teleport");

    const filteredteleports = teleports.filter((teleport) => {
      if (options.after && teleport.time < options.after) {
        return false;
      }
      if (options.before && teleport.time > options.before) {
        return false;
      }
      return true;
    });

    const sortedteleports = filteredteleports.sort((a, b) => {
      if (a.time > b.time) {
        return -1;
      }
      if (a.time < b.time) {
        return 1;
      }
      return 0;
    });

    const slicedTeleports = sortedteleports.slice(page * 10, (page + 1) * 10);

    return slicedTeleports;
  }
}
