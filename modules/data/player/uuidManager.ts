import path from "path";
import fs from "fs";
import { UUID } from "./types";
import Player from "../../resources/player";
export default class UUIDManager {
  public static readonly UUID_FILE_LOCATION = path.resolve("./data/uuid.json");

  public static openFile() {
    if (!fs.existsSync(UUIDManager.UUID_FILE_LOCATION)) {
      fs.writeFileSync(UUIDManager.UUID_FILE_LOCATION, "[]");
      return [];
    }
    const uuidFile = fs.readFileSync(UUIDManager.UUID_FILE_LOCATION, "utf8");
    return JSON.parse(uuidFile) as UUID[];
  }

  public static saveFile(uuid: UUID[]) {
    fs.writeFileSync(UUIDManager.UUID_FILE_LOCATION, JSON.stringify(uuid, null, 4));
  }

  public static update(p: Player) {
    const d = this.openFile();
    const u = d.find((u) => u.UUID === p.uuid);
    if (u && u.username !== p.name) {
      u.username = p.name;
    } else {
      d.push({
        UUID: p.uuid,
        username: p.name,
      });
    }

    this.saveFile(d);
  }

  public static getUsername(uuid: string) {
    const d = this.openFile();
    const u = d.find((u) => u.UUID === uuid);
    if (u) {
      return u.username;
    }
    return undefined;
  }

  public static getUUID(username: string) {
    const d = this.openFile();
    const u = d.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (u) {
      return u.UUID;
    }
    return undefined;
  }
}
