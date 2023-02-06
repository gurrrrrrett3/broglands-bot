import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import cuid from "cuid";

@Entity()
export class Location {
  @PrimaryKey()
  id: string = cuid();

  @Property()
  world!: string;

  @Property()
  x!: number;

  @Property()
  z!: number;

  public toString() {
    return `(${this.world}, ${this.x}, ${this.z})`;
  }

  public static fromString(str: string) {
    const [world, x, z] = str.replace(/[()]/g, "").split(", ");

    const location = new Location();

    location.world = world;
    location.x = Number(x);
    location.z = Number(z);

    return location;
  }
}
