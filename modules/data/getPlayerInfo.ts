import { bot } from "../..";
import Util from "../bot/util";
export default class GetPlayerInfo {
  public static res(name: string) {
    const town = GetPlayerInfo.getPlayerTown(name);

    let out = {
      name: name,
      town: town ? town.name : "None",
      assistant: town?.assistants.find((a) => a.toLowerCase() === name.toLowerCase()),
      mayor: town?.mayor.toLowerCase() == name.toLowerCase(),
      online: GetPlayerInfo.getPlayerOnlineData(name),
    };

    return out;
  }

  public static getPlayerTown(name: string) {
    const towns = Util.getTownFile();

    return towns.find((t) => t.residents.find((a) => a.toLowerCase() === name.toLowerCase()));
  }

  public static getPlayerOnlineData(name: string) {
    return Util.getPlayerFile().find((p) => p.name === name);
  }

  public static getPlayerNameCapitalized(name: string) {
    return this.getResList().find((r) => r.toLowerCase() === name.toLowerCase());
  }

  public static getResList() {
    const towns = Util.getTownFile();
    const out: string[] = [];
    towns.forEach((t) => {
      t.residents.forEach((r) => {
        out.push(r);
      });
    });
    return out;
  }
}
