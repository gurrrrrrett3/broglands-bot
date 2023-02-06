import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import cuid from "cuid";
import { Town } from "./town";

enum TownUpdateType {
    "TOWN_CREATE",
    "TOWN_DELETE",
    "RESIDENT_ADD",
    "RESIDENT_REMOVE",
    "TOWN_CLAIM",
    "TOWN_UNCLAIM",
    "TOWN_MAYOR_CHANGE",
}

@Entity()
export class TownUpdate {

    @PrimaryKey()
    id: string = cuid();

    @Property()
    type!: TownUpdateType;
    
    @ManyToOne()
    town!: Town;

    @Property({
        type: "date",
    })
    timestamp: Date = new Date();

    @Property({
        type: "json",
    })
    data!: 
    // TownCreate
    {
        name: string;
        mayor: string;
    } |
    // TownDelete
    {} |
    // ResidentAdd
    // ResidentRemove
    {
        resident: string;
    } |
    // TownClaim
    // TownUnclaim
    {
        location: string;
    } |
    // TownMayorChange
    {
        oldMayor: string;
        mayor: string;
    };

}