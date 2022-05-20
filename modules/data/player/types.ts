import { WorldLocation } from "../../resources/types";

export type PlayerDataTypes = "session" | "teleport"

export type PlayerSessionData = SessionData[]

export interface SessionData {
  login: LoginLogoutData;
  logout: LoginLogoutData;
}

export type LoginLogoutData = {
  time: number;
  world: string;
  x: number;
  z: number;
};

export type PlayerTeleportData = TeleportData[]

export interface RankedTeleportData extends TeleportData {
  count: number;
}

export interface RankedTeleportEndData extends WorldLocation {
  count: number;
}

export interface TeleportData {
  time: number;
  start: WorldLocation;
  end: WorldLocation;
}

export interface PlayerDataError {
    success: false;
    error: string;
}

export interface UUID {
    UUID: string;
    username: string;
}

export interface TeleportRank {
  name: string;
  owner: string | undefined;
  description: string | undefined;
  tags: string[] | undefined;
  editedBy: string | undefined;
  count: number;
  players: string[];
  x: number;
  z: number;
  world: string;
  lastUsed: number;
  firstUsed: number;
}