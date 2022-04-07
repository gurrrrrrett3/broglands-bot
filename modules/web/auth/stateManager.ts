import fs from "fs";
import path from "path"
const p = path.resolve("./data/states.json")
export default class StateManager {
  public static genSatate(): string {
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const data = this.openFile();
    data.push(state);
    this.saveFile(data);
    return state;
  }

  public static checkState(state: string): boolean {
    const data = this.openFile();
    const index = data.indexOf(state);
    if (index > -1) {
      data.splice(index, 1);
      this.saveFile(data);
      return true;
    }
    return false;
  }

  private static openFile(): string[] {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  }

  private static saveFile(data: string[]): void {
    fs.writeFileSync(p, JSON.stringify(data));
  }
}
