import path from "path";
import fs from "fs";
import { PlayerDataError, PlayerDataTypes, PlayerSessionData, PlayerTeleportData } from "./types";

export default class PlayerDataManager {
  public static readonly FOLDER_PATH = path.resolve("./data/players/");

  public static openPlayerData(uuid: string, type: "teleport"): PlayerTeleportData;
  public static openPlayerData(uuid: string, type: "session"): PlayerSessionData;
  public static openPlayerData(uuid: string, type: PlayerDataTypes) {
    const filePath = path.join(PlayerDataManager.FOLDER_PATH, uuid, `${type}.json`);
    if (!fs.existsSync(filePath)) {
      this.makeFolders(uuid);
      return []
    } else {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  }
  public static savePlayerData(uuid: string, type: "session", data: PlayerSessionData): void
  public static savePlayerData(uuid: string, type: "teleport", data: PlayerTeleportData): void
  public static savePlayerData(
    uuid: string,
    type: PlayerDataTypes,
    data: PlayerTeleportData | PlayerSessionData
): void {
    this.makeFolders(uuid);
    const filePath = path.join(PlayerDataManager.FOLDER_PATH, uuid, `${type}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
  }

  private static makeFolders(uuid: string) {
    const folderPath = path.join(PlayerDataManager.FOLDER_PATH, uuid);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Created folder for ${uuid}`);
    }

    const teleportPath = path.join(folderPath, "teleport.json");
    if (!fs.existsSync(teleportPath)) {
      fs.writeFileSync(teleportPath, JSON.stringify([], null, 4));
    }

    const sessionPath = path.join(folderPath, "session.json");
    if (!fs.existsSync(sessionPath)) {
      fs.writeFileSync(sessionPath, JSON.stringify([], null, 4));
    }
  }
}
