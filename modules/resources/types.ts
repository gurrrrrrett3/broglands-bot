import { Message, TextChannel } from "discord.js";
import Player from "./player";

export interface Coords {
  x: number;
  z: number;
}

export interface WorldLocation extends Coords {
  world: string;
}

export interface PlayersFetchReturnPlayer {
    world: string;
    armor: number;
    name: string;
    x: number;
    health: number;
    z: number;
    uuid: string;
    yaw: number;
}

export interface PlayersFetchReturn {
    players: PlayersFetchReturnPlayer[];
    max: number;
}

export interface EmbedClass {
    channel: TextChannel;
    messages: Message[];
    update(): void;
}