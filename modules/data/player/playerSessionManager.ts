import Player from "../../resources/player";
import PlayerDataManager from "./playerDataManager";

export interface GetPlayerSessionOptions {
    uuid: string;
    amount: number;
    after?: number;
    before?: number;
}

export default class PlayerSessionManager {

    public static getPlayerSessions(options: GetPlayerSessionOptions) {
        const sessions = PlayerDataManager.openPlayerData(options.uuid, "session");

        const filteredSessions = sessions.filter((session) => {
            if (options.after && session.login.time < options.after) {
                return false;
            }
            if (options.before && session.logout.time > options.before) {
                return false;
            }
            return true;
        });

        const sortedSessions = filteredSessions.sort((a, b) => {
            if (a.login.time < b.login.time) {
                return -1;
            }
            if (a.login.time > b.login.time) {
                return 1;
            }
            return 0;
        })

        const slicedSessions = sortedSessions.slice(0, options.amount);

        return slicedSessions;
    }


    public static onPlayerLogin(player: Player) {
        const sessions = PlayerDataManager.openPlayerData(player.uuid, "session");

        const newSession = {
            login: {
                time: Date.now(),
                world: player.world,
                x: player.x,
                z: player.z
            },
            logout: {
                time: 0,
                world: "",
                x: 0,
                z: 0
            }
        };

        sessions.push(newSession);
        PlayerDataManager.savePlayerData(player.uuid, "session", sessions);
    }

    public static onPlayerLogout(player: Player) {
        const sessions = PlayerDataManager.openPlayerData(player.uuid, "session");

        if (sessions.length == 0) {
            // No sessions?
            return
        }

        const lastSession = sessions[sessions.length - 1];
        lastSession.logout.time = Date.now();
        lastSession.logout.world = player.world;
        lastSession.logout.x = player.x;
        lastSession.logout.z = player.z;

        PlayerDataManager.savePlayerData(player.uuid, "session", sessions);
    }

}