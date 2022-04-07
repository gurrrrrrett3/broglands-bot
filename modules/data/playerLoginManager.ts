import fs from "fs";
import path from "path";
import Util from "../bot/util";

export interface LoginData {
  name: string;
  time: number;
}
export default class PlayerLoginManager {
  public static filePath = path.join(__dirname, "../../../data/playerLogin.json");

  public static newLogin(name: string) {
    const logins = this.openFile();
    if (logins.find((login) => login.name === name)) {
      logins.find((login) => login.name === name)!.time = Date.now(); 
    } else {
      logins.push({ name, time: Date.now() });
    }
    this.saveFile(logins);
  }

  public static getLoginTime(name: string) {
    return this.openFile().find((login) => login.name.toLowerCase() === name.toLowerCase())?.time;
  }

  public static getPlaytime(name: string) {
    const time = this.getLoginTime(name);
    if (!time) {
      return 0;
    }
    return Date.now() - time;
  }

  public static getFormattedPlaytime(name: string) {
    const time = this.getPlaytime(name);
    if (!time) {
      return "0s";
    }
    return Util.formatTime(time);
  }

  public static openFile() {
    return JSON.parse(fs.readFileSync(this.filePath, "utf8")) as LoginData[];
  }

  public static saveFile(data: LoginData[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 4));
  }
}
