import { db } from "../../../core";
import Logger from "../../../core/utils/logger";
import { User } from "../entities/user";
import { MapPlayerData } from "../types";
import CachedEntity from "./cachedEntity";

export default class PlayerDatabaseManager {
  public cache: Map<string, CachedEntity<User>> = new Map();
  public cacheCleanTimer: NodeJS.Timer;

  constructor() {
    this.cacheCleanTimer = setInterval(() => {
      this.cache.forEach((cachedUser, uuid) => {
        if (cachedUser.isExpired()) {
          this.cache.delete(uuid);
        }
      });
    }, 1000 * 60 * 5);
  }

  public async getUser(uuid: string): Promise<User> {
    const User = this.getUserFromCache(uuid);
    if (User) {
      return User;
    }
    return this.getUserFromDb(uuid);
  }

  public getUserFromCache(uuid: string): User | null {
    const cachedUser = this.cache.get(uuid);
    if (cachedUser && !cachedUser.isExpired()) {
      return cachedUser.get();
    } else if (cachedUser) {
      this.cache.delete(uuid);
    }
    return null;
  }

  public async getUserFromDb(uuid: string): Promise<User> {
    const user = await db
      .getEntityManager()
      .findOne(User, { uuid })
      .catch((err) => {
        Logger.error("UserDatabaseManager", err);
      });
    if (!user) {
      throw new Error("User not found");
    }
    this.cache.set(uuid, new CachedEntity(user));
    return user;
  }

  public async findOrCreateUser(player: MapPlayerData): Promise<User> {
      const foundUser = await db
        .getEntityManager()
        .findOne(User, { uuid: player.uuid })
        .catch((err) => {
          Logger.error("UserDatabaseManager", err);
        });
      if (foundUser) {
        return foundUser;
      }
    

    const newUser = User.fromPlayerData(player);
    await db
      .getEntityManager()
      .persistAndFlush(newUser)
      .catch((err) => {
        Logger.error("UserDatabaseManager", err);
      });
    return newUser;
  }
}
