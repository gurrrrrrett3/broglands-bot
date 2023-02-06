import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import cuid from "cuid";
import { User } from "./user";
import { Location } from "./location";

@Entity()
export class Frame {
  @PrimaryKey()
  id: string = cuid();

  @ManyToOne()
  user!: User;

  @ManyToOne({
    entity: () => Location,
  })
  location!: Location;

  @Property({
    type: "date",
  })
  timestamp: Date = new Date();

}
