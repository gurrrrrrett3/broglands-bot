import { Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import cuid from "cuid";
import { Location } from "./location";
import { User } from "./user";

@Entity()
export class Town {
  @PrimaryKey()
  id: string = cuid();

  @Property()
  name!: string;

  @OneToOne({
    entity: () => Location,
  })
  location!: Location;

  @ManyToOne({
    entity: () => User,
  })
  mayor!: User;

  @OneToMany({
    entity: () => User,
    mappedBy: "town",
  })
  residents!: User[];

  @Property({
    type: "date",
  })
  founded: Date = new Date();
}
