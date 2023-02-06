import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import cuid from "cuid";
import { MapPlayerData } from "../types";
import { Town } from "./town";

@Entity()
export class User {

  @PrimaryKey()
  id: string = cuid();

  @Property()
  username!: string;

  @Property({
    unique: true,
  })
  uuid!: string;

  @Property({
    nullable: true,
  })
  discordId?: string | null = null;

  @ManyToOne({
    entity: () => Town,
    nullable: true,
  })
  town?: Town | null = null;

  public static fromPlayerData(player: MapPlayerData) {
    const user = new User();

    user.username = player.name;
    user.uuid = player.uuid;

    return user;
  }
}
