import MapModule from "..";
import { db } from "../../../core";
import { Session } from "../entities/session";
import { MapPlayerData } from "../types";

export default class SessionDatabaseManager {
  public async startSession(player: MapPlayerData): Promise<void> {
    const session = db.getEntityManager().create(Session, {
      loginLocation: await MapModule.getMapModule().locationDatabaseManager.findOrCreateLocation(player),
      user: await MapModule.getMapModule().playerDatabaseManager.findOrCreateUser(player),
      loginTimestamp: new Date(),
    });

    await db.getEntityManager().persistAndFlush(session);
  }

    public async endSession(player: MapPlayerData): Promise<void> {
        const session = await db.getEntityManager().findOne(Session, {
            user: await MapModule.getMapModule().playerDatabaseManager.findOrCreateUser(player),
            logoutTimestamp: null,
        });

        if (!session) {
            return;
        }

        session.logoutTimestamp = new Date();
        session.logoutLocation = await MapModule.getMapModule().locationDatabaseManager.findOrCreateLocation(player);
        await db.getEntityManager().persistAndFlush(session);
    }
}
