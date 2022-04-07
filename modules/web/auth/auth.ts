
import { Router } from 'express';
import StateManager from './stateManager';
import UserManager from './userManager';
import Util from '../modules/util';
import auth from '../../../auth.json';
const router = Router();

router.get("/login", (req, res) => {
    console.log(`Request from ${req.ip}`)
    res.redirect(Util.buildDiscordAuthURL(auth.CLIENT_ID, auth.REDIRECT_URI, auth.SCOPE));
});

router.get('/callback', (req, res) => {

    const code = req.query.code;
    const state = req.query.state;

    if (!code || !state) {
        res.send("Error: No code or state");
        return;
    }

    if (StateManager.checkState(state.toString())) {
        UserManager.authUser(code.toString()).then(user => {
            if (user.ign) {
                res.redirect(`/view/${user.ign}`)
            } else {
                res.redirect(`/weblink/`)
            }

        }
        ).catch(err => {
            res.status(500).json(err);
        }
        );
    } else {
        res.send("Error: Invalid state, you may have been redirected here by a third party site. Please try again.");
    }
});

export default router;