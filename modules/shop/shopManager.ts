import Player from "../resources/player"
import Shop from "./shop"
import { ShopSession } from "./types"

export default class ShopManager {

        public currentSessions: ShopSession[]
        public static shops: Shop[]

        constructor() {
            this.currentSessions = []
        }

        public onUpdate(playerList: Player[]) {

            //Iterate through player list

        }

}