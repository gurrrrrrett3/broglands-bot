import { Router } from 'express';
import path from "path"
const router = Router();

router.get("/trank", (req, res) => {
    res.sendFile(path.resolve("data/teleportData.json"))
})

router.get("/towns", (req, res) => {
    res.sendFile(path.resolve("data/towns.json"))
})

export default router;