import { bot } from "../../core";
import Module from "../../core/base/module";
import express from "express";
import path from "path";
import fetch from "node-fetch";
import PlayerFile from "./playerFile";
import MarkerFile from "./markerFile";
import MapTileCache from "./mapTileCache";

export default class WebModule extends Module {
  name = "web";
  description = "manages website";

  public app = express();

  override async onLoad(): Promise<boolean> {
    // disable cors
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    this.app.use("/", express.static(path.resolve("modules/web/assets")));

    this.app.get("/tiles/settings.json", (req, res) => {
      res.sendFile(path.resolve("modules/web/data/settings.json"));
    });

    this.app.get("/tiles/:world/settings.json", (req, res) => {
      const world = req.params.world;

      res.sendFile(path.resolve(`modules/web/data/world.settings.json`));
    });

    this.app.get("/tiles/:world/:zoom/:coords.png", async (req, res) => {
      const world = req.params.world;
      const zoom = req.params.zoom;
      const coords = req.params.coords;

      const img = await MapTileCache.getTile(coords, world, Number(zoom));
        res.setHeader("Content-Type", "image/png");
        res.send(img);
    });

    this.app.get("/tiles/players.json", (req, res) => {
        res.json(PlayerFile.get());
    });

    this.app.get("/tiles/:world/markers.json", async (req, res) => {

        res.json(await MarkerFile.get(req.params.world));
    })

    this.app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });

    return true;
  }

  public static getWebModule(): WebModule {
    return bot.moduleLoader.getModule("web") as WebModule;
  }
}
