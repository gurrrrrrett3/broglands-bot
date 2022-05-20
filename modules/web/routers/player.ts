import { Router } from "express";
import path from  "path";
import Util from "../../bot/util";
import PlayerSessionManager from "../../data/player/playerSessionManager";
import UUIDManager from "../../data/player/uuidManager";
const router = Router();

router.get("/:id/data", (req, res) => {
  const id = req.params.id;

  let uuid: string = id;

  if (id.length != 32) {
    let u = UUIDManager.getUUID(id);

    if (!u) {
      res.send({
        success: false,
        error: `Player "${id}" not found`,
      });
      return;
    }
    uuid = u
  }

  let username = UUIDManager.getUsername(uuid);

  if (!username) {
    res.send({
      success: false,
      error: `Player "${id}" not found`,
    });
    return;
  }

  let onlineData = Util.getOnlinePlayer(username);
  let currentLocation = onlineData ? Util.isPlayerInTown(onlineData) : undefined;
  let sessions = PlayerSessionManager.getPlayerSessions({
      amount: 10,
      uuid: uuid
  })

  let data = {
    online: onlineData ? true : false,
    username,
    onlineData,
    sessions,
    town: Util.getUserTown(username),
    currentLocation,
  };

  res.send(data);
});

router.get("/:id", (req, res) => {
    res.sendFile(path.resolve("./modules/web/public/pages/player.html"))
})

export default router;
