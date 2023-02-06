import { MapPlayerData } from "../types";

export default class Player {

    public name: string;
    public uuid: string;
    public world: string;
    public x: number;
    public z: number;
    public yaw: number;
    public health: number;
    public armor: number;

    constructor(data: MapPlayerData) {
        this.name = data.name;
        this.uuid = data.uuid;
        this.world = data.world;
        this.x = data.x;
        this.z = data.z;
        this.yaw = data.yaw;
        this.health = data.health;
        this.armor = data.armor;
    }

    public static fromMapPlayerData(data: MapPlayerData): Player {
        return new Player(data);
    }

    public static fromMapPlayerDataArray(data: MapPlayerData[]): Player[] {
        return data.map((player) => {
            return Player.fromMapPlayerData(player);
        });
    }

    public isAfk(): boolean {
        return this.world === "minecraft_spawn" && this.x === 66 && this.z === 133;
    }
    
}
