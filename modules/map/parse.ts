import { parse } from "node-html-parser";
import Town, { TownData } from "../resources/town";
import { Coords } from "../resources/types";
import { isIconMarker, Marker, MarkerFile } from "./markerTypes";

export default class MarkerParser {
  public static parse(data: Marker, world: string): Town | null {
    if (!isIconMarker(data)) return null;
    if (data.icon != "towny_town_icon") return null;

    let townData: TownData = {
      name: "",
      nation: "",
      mayor: "",
      pvp: false,
      residents: [],
      assistants: [],
      coords: {
        x: 0,
        z: 0,
      },
    };

    townData.coords = data.point as Coords;

    const popupData = parse(data.popup).rawText.split("\n");

    townData.name = popupData[2].trim().replace(/ \(.+\)/g, "");
    townData.mayor = popupData[5].trim();
    townData.nation = popupData[2]
      .trim()
      .match(/\(.+\)/g)?.[0]
      .replace(/\(|\)/g, "") as string;
    townData.assistants = popupData[8]
      .trim()
      .split(",")
      .map((r) => r.trim());
    townData.pvp = popupData[11].trim() == "true" ? true : false;
    townData.residents = popupData[13]
      .trim()
      .replace("Residents: ", "")
      .split(",")
      .map((r) => r.trim());

    if (townData.assistants[0] == "None") {
      townData.assistants = [];
    }

    return new Town(world, townData);
  }

  public static parseMarkerFile(world: string, data: MarkerFile): Town[] {
    const towns: Town[] = [];

    const markers = data.find((marker) => marker.name === "Towny")?.markers as Marker[];

    for (const marker of markers) {
      const town = MarkerParser.parse(marker, world);
      if (town) {
        towns.push(town);
      }
    }

    return towns;
  }
}
