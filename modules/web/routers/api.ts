import { Router } from "express";
import Util from "../../bot/util";
import MapInterface from "../../map/mapInterface";
import dataRouter from "./dataApi"

const router = Router();

router.use("/data", dataRouter)

router.get("/ticker", (req, res) => {
  let tickerContent = [
    `Players Online: ${Util.getPlayerFile().length}`,
    `AFK: ${Util.getAfkPlayers().length}`,
    `Not AFK: ${Util.getPlayerFile().length - Util.getAfkPlayers().length}`,
    `In Broglands %: ${((Util.getPlayersInBroglands().length / Util.getPlayerFile().length) * 100).toFixed(
      2
    )}%`,
    `Broglands Resident Count: ${Util.getBroglandsResidentCount()}`,
    `Broglands Town Count: ${Util.getBroglandsTownCount()}`,
  ];

  res.json({
    content: tickerContent.join(" | "),
  });
});

router.get("/table", (req, res) => {
  const players = Util.getPlayerFile();

    const afkPlayers = Util.getAfkPlayers();
    const nonAfkPlayers = players.filter((player) => {
        return !player.isAfk();
    });

    nonAfkPlayers.sort((a, b) => {    
        return a.name.localeCompare(b.name)
    });

    let playerList = nonAfkPlayers.concat(afkPlayers);

  let out: [boolean, string, string, string, string, string][] = [];

  playerList.forEach((player) => {
    out.push([player.isAfk(), player.name, player.world, `${player.x}, ${player.z}`, Util.formatPresence(player), MapInterface.generateMapLink(player.getLocation(), 5)]);
  });

  res.json({
    content: out,
  });
});

export default router;
