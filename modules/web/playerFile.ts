import MapModule from "../map";
import Player from "../map/resources/player";

export default class PlayerFile {

    public static get() {
        const playerData = MapModule.getMapModule().playerData;
        playerData.players = playerData.players.map((player) => {
            player.name = player.name + (player.world === "minecraft_spawn" && player.x === 66 && player.z === 133 ? " (afk)" : "")
            return player;
        })
        return playerData;
    }

}