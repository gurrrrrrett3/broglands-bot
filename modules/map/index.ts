import axios from "axios";
import { bot } from "../../core";
import Module from "../../core/base/module";
import Logger from "../../core/utils/logger";
import FrameDatabaseManager from "./db/frameDatabaseManager";
import LocationDatabaseManager from "./db/locationDatabaseManager";
import PlayerDatabaseManager from "./db/playerDatabaseManager";
import SessionDatabaseManager from "./db/sessionDatabaseManager";
import PlayerEventManager from "./playerEventManager";
import { MapPlayerData } from "./types";

export default class MapModule extends Module {
  name = "map";
  description = "manages map info";

  playerData: {
    max: number;
    players: MapPlayerData[];
  } = {
    max: 0,
    players: [] as any,
  };

  instance = axios.create({
    baseURL: "https://map.craftyourtown.com/tiles",
  });

  playerEventManager = new PlayerEventManager();
  playerDatabaseManager = new PlayerDatabaseManager();
  locationDatabaseManager = new LocationDatabaseManager();
  sessionDatabaseManager = new SessionDatabaseManager();
  frameDatabaseManager = new FrameDatabaseManager();

  timers = {
    playerDataTimer: setInterval(() => {
      this.instance.get("/players.json").then(async (res) => {
        this.playerData = res.data;
        this.playerEventManager.updatePlayers(this.playerData.players);
      }).catch((err) => Logger.error("map", err));
    }, 1000),
    markerDataTimer: setInterval(() => {

    }, 10000)
  };


  public static getMapModule(): MapModule {
    return bot.moduleLoader.getModule("map") as MapModule;
  }
}
