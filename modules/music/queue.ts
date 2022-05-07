import Track from "./track";
import { bot } from "../..";

export default class Queue {
  public tracks: Track[];
  private id: string;

  constructor(guildId: string) {
    this.tracks = [];
    this.id = guildId;
  }

  public enqueue(track: Track) {
    this.tracks.push(track);

    console.log(this.tracks);
    if (this.tracks.length == 1) {
    }
  }

  public skip() {
    this.tracks.shift();
  }

  public clear() {
    this.tracks = [];
  }
}
