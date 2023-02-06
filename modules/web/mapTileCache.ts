import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export default class MapTileCache {
  public static readonly UPDATE_LOG = path.resolve("data/tiles/lastUpdated.json");

  public static async getTile(coords: string, world: string, zoom: number): Promise<Buffer> {
    const filePath = path.resolve(`data/tiles/${world}/${zoom}/${coords}.png`);

    const lastUpdatedFile = JSON.parse(fs.readFileSync(MapTileCache.UPDATE_LOG, "utf-8"));
    const lastUpdated = lastUpdatedFile[world]
      ? lastUpdatedFile[world][zoom]
        ? lastUpdatedFile[world][zoom][coords]
        : undefined
      : undefined;

    if (!fs.existsSync(filePath) || !lastUpdated || lastUpdated < Date.now() - 1000 * 60 * 60 * 24) {
      const tile = await fetch(`https://map.craftyourtown.com/tiles/${world}/${zoom}/${coords}.png`);
      const buffer = await tile.buffer();

      if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, buffer);

        if (!lastUpdatedFile[world]) lastUpdatedFile[world] = {};
        if (!lastUpdatedFile[world][zoom]) lastUpdatedFile[world][zoom] = {};
        lastUpdatedFile[world][zoom][coords] = Date.now();
        
      fs.writeFileSync(MapTileCache.UPDATE_LOG, JSON.stringify(lastUpdatedFile, null, 2));

      return buffer;
    }

    return fs.readFileSync(filePath);
  }
}
