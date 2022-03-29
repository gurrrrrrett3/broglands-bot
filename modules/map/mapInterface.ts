import fetch from "node-fetch";
import Player from "../resources/player";
import fs from "fs";
import { PlayersFetchReturn, WorldLocation } from "../resources/types";
import { Marker, MarkerFile } from "./markerTypes";
export default class MapInterface {
  public static getPlayers(): Promise<Player[]> {
    return fetch("https://map.craftyourtown.com/tiles/players.json")
      .then((res) => res.json())
      .then((res: PlayersFetchReturn) => {
        const playerList = res.players.map(p => new Player(p));
        fs.writeFileSync("./data/players.json", JSON.stringify(playerList, null, 4));
        return playerList;
      });
  }
  public static async getWorldMarkers(): Promise<MarkerFile> {
    return fetch("https://map.craftyourtown.com/tiles/world/markers.json")
      .then((res) => res.json())
      .then((res: MarkerFile) => res);
  }

  public static async getEarthMarkers(): Promise<MarkerFile> {
    return fetch("https://map.craftyourtown.com/tiles/earth/markers.json")
      .then((res) => res.json())
      .then((res: MarkerFile) => res);
  }

  public static generateMapLink(location: WorldLocation, zoom: number): string {
    return `https://map.craftyourtown.com/#${location.world};${location.x};0;${location.z};${zoom}`;
  }
}
