import { Coords, WorldLocation } from "./types";

export interface TownData {
  name: string;
  nation: string;
  mayor: string;
  pvp: boolean;
  residents: string[];
  assistants: string[];
  coords: {
    x: number;
    z: number;
  };
}

export default class Town {
    
    public world: string;
    public name: string;
    public nation: string;
    public mayor: string;
    public pvp: boolean;
    public residents: string[];
    public assistants: string[];
    public coords: {
        x: number;
        z: number;
    };

    constructor(world: string, data: TownData) {
        this.world = world;
        this.name = data.name;
        this.nation = data.nation;
        this.mayor = data.mayor;
        this.pvp = data.pvp;
        this.residents = data.residents;
        this.assistants = data.assistants;
        this.coords = data.coords;

        if (this.assistants == ["None"]) {
            this.assistants = [];
        }
    }

    public getCoords(): Coords {
        return {
            x: this.coords.x,
            z: this.coords.z,
        };
    }

    public getLocation(): WorldLocation {
        return {
            world: this.world,
            x: this.coords.x,
            z: this.coords.z,
        };
    }

}
