import fetch from "node-fetch";
import Player from "../resources/player";
import { PlayersFetchReturn } from "../resources/types";
import { Marker, MarkerFile } from "./markerTypes";
export default class MapInterface {
  public static getPlayers(): Promise<Player[]> {
    return fetch("https://map.craftyourtown.com/tiles/players.json")
      .then((res) => res.json())
      .then((res: PlayersFetchReturn) => {
        return res.players.map(p => new Player(p));
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
}
