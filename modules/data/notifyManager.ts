import fs from "fs";
import path from "path";

export interface Notify {
    staffID: string,
    playerIGN: string
}

//The Data storage Manager for the /notify command

export default class NotifyManager {
  public static readonly filePath = path.join(__dirname, "../../../data/notify.json");
  

  public static newNotify(staffID: string, playerIGN: string) {
    const items = this.openFile();
    items.push({ staffID, playerIGN });
    this.saveFile(items);
  }

  public static getNotfyByID(id: string) {
    return this.openFile().filter((link) => link.staffID === id);
  }

  public static getNotifyByIGN(ign: string) {
    return this.openFile().filter((link) => link.playerIGN === ign);
  }

  public static openFile() {
    return JSON.parse(fs.readFileSync(NotifyManager.filePath, "utf8")) as Notify[]
  }

  public static saveFile(data: Notify[]) {
    fs.writeFileSync(NotifyManager.filePath, JSON.stringify(data, null, 4));
  }  
}
