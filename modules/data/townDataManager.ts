import Town from "../resources/town";
import fs from "fs";
import UpdateEmbed from "../bot/updateEmbed";
import { bot } from "../..";

export default class TownDataManager {
  public towns: Town[];
  public embedManager: UpdateEmbed;
  private oldTowns: Town[];

  constructor() {
    this.towns = [];
    this.oldTowns = [];
    this.embedManager = bot.updateEmbedManager;
  }

  public async check(townData: Town[]): Promise<void> {
    this.oldTowns = JSON.parse(fs.readFileSync("./data/towns.json", "utf8")) as Town[];
    this.towns = townData;

    const newTowns = this.getNewTowns();
    const removedTowns = this.getRemovedTowns();
    const nationChanges = this.checkForNationChanges();
    const mayorChanges = this.checkForMayorChanges();
    const assistantChanges = this.checkForAssistantChanges();
    const residentChanges = this.checkForResidentChanges();

    //New Towns

    newTowns.forEach((t) => {
      this.embedManager.newTown(t);
    });

    //Removed Towns
    removedTowns.forEach((t) => {
      this.embedManager.removeTown(t);
    });

    //Nation Changes
    nationChanges.forEach((t) => {
      this.embedManager.updateTown(
        t.town,
        `Town Nation Change`,
        `${t.town.name} moved to ${t.newNation} from ${t.oldNation}`
      );
    });

    //Mayor Changes
    mayorChanges.forEach((t) => {
        this.embedManager.updateTown(
            t.town,
            `Town Mayor Change`,
            `${t.town.name}'s mayor changed from ${t.oldMayor} to ${t.newMayor}`
        );
    });

    //Assistant Changes
    assistantChanges.added.forEach((t) => {
        this.embedManager.updateTown(
            t.town,
            `Town Assistant Added`,
            `${t.town.name}'s added ${t.assistant} as an assistant`
        );
    });

    assistantChanges.removed.forEach((t) => {
        this.embedManager.updateTown(
            t.town,
            `Town Assistant Removed`,
            `${t.town.name}'s removed ${t.assistant} as an assistant`
        );
    });

    //Resident Changes

    residentChanges.forEach((t) => {
        t.added.forEach((a) => {
            this.embedManager.updateTown(
                t.town,
                `Town Resident Change`,
                `${a} joined ${t.town.name}`
            );
        })
    });

    residentChanges.forEach((t) => {
        t.removed.forEach((a) => {
            this.embedManager.updateTown(
                t.town,
                `Town Resident Change`,
                `${a} left ${t.town.name}`
            );
        })
    });

    //Save
    fs.writeFileSync("./data/towns.json", JSON.stringify(this.towns, null, 4));
  }

  public getNewTowns(): Town[] {
    return this.towns.filter((t) => !this.oldTowns.find((oldT) => oldT.name === t.name));
  }

  public getRemovedTowns(): Town[] {
    return this.oldTowns.filter((t) => !this.towns.find((oldT) => oldT.name === t.name));
  }

  public checkForNationChanges(): {
    town: Town;
    oldNation: string;
    newNation: string;
  }[] {
    return this.towns
      .filter((t) => {
        const oldTown = this.oldTowns.find((oldT) => oldT.name === t.name);
        if (oldTown) {
          return oldTown.nation !== t.nation;
        }
        return false;
      })
      .map((t) => {
        return {
          town: t,
          oldNation: this.oldTowns.find((oldT) => oldT.name === t.name)?.nation ?? "",
          newNation: t.nation,
        };
      });
  }

  public checkForMayorChanges(): {
    town: Town;
    oldMayor: string;
    newMayor: string;
  }[] {
    return this.towns
      .filter((t) => {
        const oldTown = this.oldTowns.find((oldT) => oldT.name === t.name);
        if (oldTown) {
          return oldTown.mayor !== t.mayor;
        }
        return false;
      })
      .map((t) => {
        return {
          town: t,
          oldMayor: this.oldTowns.find((oldT) => oldT.name === t.name)?.mayor ?? "",
          newMayor: t.mayor,
        };
      });
  }

  public checkForAssistantChanges(): {
    added: {
      town: Town;
      assistant: string;
    }[];
    removed: {
      town: Town;
      assistant: string;
    }[];
  } {
    const added: {
      town: Town;
      assistant: string;
    }[] = [];
    const removed: {
      town: Town;
      assistant: string;
    }[] = [];

    this.towns.forEach((t) => {
      const oldTown = this.oldTowns.find((oldT) => oldT.name === t.name);
      if (oldTown) {
        t.assistants.forEach((a) => {
          if (!oldTown.assistants.find((oldA) => oldA === a)) {
            added.push({
              town: t,
              assistant: a,
            });
          }
        });
        oldTown.assistants.forEach((a) => {
          if (!t.assistants.find((oldA) => oldA === a)) {
            removed.push({
              town: t,
              assistant: a,
            });
          }
        });
      }
    });

    return {
      added,
      removed,
    };
  }

  public checkForResidentChanges(): {
    town: Town;
    added: string[];
    removed: string[];
  }[] {
    const out: {
      town: Town;
      added: string[];
      removed: string[];
    }[] = [];

    this.towns.forEach((t) => {
      const oldTown = this.oldTowns.find((oldT) => oldT.name === t.name);
      const townOut: {
        town: Town;
        added: string[];
        removed: string[];
        } = {
        town: t,
        added: [],
        removed: [],
        };
      if (oldTown) {
        t.residents.forEach((r) => {
          if (!oldTown.residents.find((oldR) => oldR === r)) {
            townOut.added.push(r);
          }
        });
        oldTown.residents.forEach((r) => {
          if (!t.residents.find((oldR) => oldR === r)) {
            townOut.removed.push(r);
          }
        });
      }
        out.push(townOut);
    });

    return out;
  }
}
