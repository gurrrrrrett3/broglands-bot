import { db } from "../../../core";
import Logger from "../../../core/utils/logger";
import { Frame } from "../entities/frame";

export default class FrameDatabaseManager {

    public lastFrameUpdate: Frame[] = [];

    constructor() {}


    public async updateFrames(frames: Frame[]) {
        const newFrames = frames.filter((frame) => {
            return !this.lastFrameUpdate.find((lastFrame) => {
                return lastFrame.location.id === frame.location.id;
            });
        });

        db.getEntityManager().persistAndFlush(newFrames).catch((err) => {
            Logger.error("FrameDatabaseManager", err);
        });

        Logger.debug("FrameDatabaseManager", `Updated ${newFrames.length} frames.`);

        this.lastFrameUpdate = frames;
    }


}