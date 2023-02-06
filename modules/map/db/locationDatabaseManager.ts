import { db } from "../../../core";
import Logger from "../../../core/utils/logger";
import { Location } from "../entities/location";
import CachedEntity from "./cachedEntity";

export default class LocationDatabaseManager {
  public cache: Map<string, CachedEntity<Location>> = new Map();

  public cacheCleanTimer: NodeJS.Timer;

  constructor() {
    this.cacheCleanTimer = setInterval(() => {
      this.cache.forEach((cachedLocation, id) => {
        if (cachedLocation.isExpired()) {
          this.cache.delete(id);
        }
      });
    }, 1000 * 60 * 5);
  }

  public async getLocation(locationString: string): Promise<Location> {
    const cachedLocation = this.getLocationFromCache(locationString);
    if (cachedLocation) {
      return cachedLocation;
    }
    return this.getLocationFromDb(locationString);
  }

  public getLocationFromCache(locationString: string): Location | null {
    return this.cache.get(locationString)?.get() ?? null;
  }

  public async getLocationFromDb(locationString: string): Promise<Location> {
    const loc = Location.fromString(locationString);

    const location = await db
      .getEntityManager()
      .findOne(Location, {
        world: loc.world,
        x: loc.x,
        z: loc.z,
      })
      .catch((err) => {
        Logger.error("LocationDatabaseManager", err);
      });

    if (!location) {
      throw new Error("Location not found");
    }

    this.cache.set(locationString, new CachedEntity(location));

    return location;
  }

  public async findOrCreateLocation(
    locationString: string | { world: string; x: number; z: number },
  ): Promise<Location> {
    const loc = typeof locationString === "string" ? Location.fromString(locationString) : locationString;

    const foundLocation = await db
      .getEntityManager()
      .findOne(Location, {
        world: loc.world,
        x: loc.x,
        z: loc.z,
      })
      .catch((err) => {
        Logger.error("LocationDatabaseManager", err);
      });

    if (foundLocation) {
      this.cache.set(loc.toString(), new CachedEntity(foundLocation));
      return foundLocation;
    }

    const newLocation = new Location();
    newLocation.world = loc.world;
    newLocation.x = loc.x;
    newLocation.z = loc.z;

    await db.getEntityManager().persistAndFlush(newLocation);

    this.cache.set(loc.toString(), new CachedEntity(newLocation));

    return newLocation;
  }
}
