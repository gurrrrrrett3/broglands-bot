import Player from "../resources/player";
import { bot } from "../..";

export default class playerUpdate {

    public players: Player[] = [];
    public oldPlayers: Player[] = [];

    constructor() {}

    public update(players: Player[]) {
        this.players = players;
        
        if (this.oldPlayers.length == 0) {
            this.oldPlayers = players; // First time
        }
        
        // Check for new players
        this.players.forEach((p) => {
            if (!this.oldPlayers.find((op) => op.name == p.name)) {
                // New player
                bot.updateEmbedManager.playerJoin(p);
            }
        });

        // Check for players that left
        this.oldPlayers.forEach((op) => {
            if (!this.players.find((p) => p.name == op.name)) {
                // Player left
                bot.updateEmbedManager.playerLeave(op);
            }
        })
        this.oldPlayers = this.players;
    }
}