import Logger from "../../core/utils/logger";
import MapUtils from "./mapUtils";
import { MapPlayerData } from "./types";
import config from "../../config.json";
import { Frame } from "./entities/frame";
import MapModule from ".";
import { db } from "../../core";
import { Teleport } from "./entities/teleport";

export default class PlayerEventManager {
  public lastPlayers: MapPlayerData[] = [];
  public updateCount: number = 0;

  constructor() {}

  public async updatePlayers(players: MapPlayerData[]) {
    this.updateCount++;

    const newPlayers = players.filter((player) => {
      return !this.lastPlayers.find((lastPlayer) => {
        return lastPlayer.uuid === player.uuid;
      });
    });

    const leftPlayers = this.lastPlayers.filter((player) => {
      return !players.find((lastPlayer) => {
        return lastPlayer.uuid === player.uuid;
      });
    });

    if (newPlayers.length > 0) {
      newPlayers.forEach(async (player) => {
        await MapModule.getMapModule().sessionDatabaseManager.startSession(player);
      });
    }

    if (leftPlayers.length > 0) {
      leftPlayers.forEach(async (player) => {
        await MapModule.getMapModule().sessionDatabaseManager.endSession(player);
      });
    }

    // teleports

    players.forEach(async (player) => {
      const lastPlayer = this.lastPlayers.find((lastPlayer) => {
        return lastPlayer.uuid === player.uuid;
      });

      if (lastPlayer) {
        if (
          lastPlayer.world !== player.world ||
          MapUtils.calcDistance(lastPlayer, player) > config.teleportMinDistance
        ) {
            const teleport = new Teleport()
            teleport.from = await MapModule.getMapModule().locationDatabaseManager.findOrCreateLocation(lastPlayer)
            teleport.to = await MapModule.getMapModule().locationDatabaseManager.findOrCreateLocation(player)
            teleport.user = await MapModule.getMapModule().playerDatabaseManager.findOrCreateUser(player)
            teleport.timestamp = new Date()

            await db.getEntityManager().persistAndFlush(teleport)
        }
      }
    });

    if (this.updateCount % 10 === 0) {
      // make frames
      const frames: Frame[] = [];
      for (const player of players) {
        const frame = new Frame();
        frame.location = await MapModule.getMapModule().locationDatabaseManager.findOrCreateLocation(
          player
        );
        frame.user = await MapModule.getMapModule().playerDatabaseManager.findOrCreateUser(player);
        frames.push(frame);
      }

      MapModule.getMapModule().frameDatabaseManager.updateFrames(frames);
    }

    this.lastPlayers = players;
  }
}
