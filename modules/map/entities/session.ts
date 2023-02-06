import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import cuid from "cuid";
import { User } from "discord.js";
import { Location } from "./location";

@Entity()
export class Session {
  @PrimaryKey()
  id: string = cuid();

  @ManyToOne()
  user!: User;

  @ManyToOne({
    entity: () => Location,
  })
  loginLocation!: Location;

  @ManyToOne({
    entity: () => Location,
    nullable: true,
  })
  logoutLocation?: Location;

  @Property({
    type: "date",
  })
  loginTimestamp: Date = new Date();

  @Property({
    type: "date",
    nullable: true,
  })
  logoutTimestamp?: Date;
}
