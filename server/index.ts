import PlayerMgr from "./playerMgr";
import WorshipMgr from "./worshipMgr";

declare global {
    namespace NodeJS {
        interface Global {
            playerMgr: PlayerMgr;
            worshipMgr: WorshipMgr;
        }
    }
}