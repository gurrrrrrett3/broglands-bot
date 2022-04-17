import Player from "../../resources/player";
import config from "../../../config.json"
import Util from "../../bot/util";
import PlayerDataManager from "./playerDataManager";

export default class PlayerTeleportManager {

    public static handleTeleports(ops: Player[], nps: Player[]): void {    
       const plist = ops.filter((v) => nps.find((p) => p.uuid == v.uuid))
       //@ts-ignore
       plist.forEach((p) => this.handleTeleport(ops.find((o) => o.uuid == p.uuid), nps.find((n) => n.uuid == p.uuid)))
    }


    private static handleTeleport(op: Player, np: Player) {

        const dis = Util.getDistance(op.getCoords(), np.getCoords())
        if (config.TELEPORT.DISTANCE > dis && op.world == np.world) return

        const data = PlayerDataManager.openPlayerData(op.uuid, "teleport")

        data.push({
            time: Date.now(),
            start: op.getLocation(),
            end: np.getLocation()
        })

        PlayerDataManager.savePlayerData(op.uuid, "teleport", data)

        console.log(`${np.name} teleported from ${op.world} to ${np.world}, traveled ${dis} blocks`)
    }

}