import Player from "./player";
import PlayerMgr from "./playerMgr";

export default class Worship {
    id: string;
    players: Map<string, Player>;

    constructor(id: string) {
        this.players = new Map<string, Player>();
        this.id = id;
    }

    join(id: string) {
        let player = new Player(id);
        if (this.players.has(id)) {
            return;
        }

        this.players.set(id, player);
    }

    moveTo(pos: any) {

    }

    quit() {

    }
}