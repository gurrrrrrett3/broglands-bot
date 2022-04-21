import { Router } from 'express';
import Util from '../../bot/util';
const router = Router();

router.get("/ticker", (req, res) => {

    let tickerContent = [
        `Players Online: ${Util.getPlayerFile().length}`,
        `AFK: ${Util.getAfkPlayers().length}`,
        `Not AFK: ${Util.getPlayerFile().length - Util.getAfkPlayers().length}`,
        `In Broglands %: ${(Util.getPlayersInBroglands().length / Util.getPlayerFile().length * 100).toFixed(2)}%`,
        `Broglands Resident Count: ${Util.getBroglandsResidentCount()}`,
        `Broglands Town Count: ${Util.getBroglandsTownCount()}`,
    ]

    res.json({
        content: tickerContent.join(" | ")
    })


});

export default router;