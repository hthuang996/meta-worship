import Worship from "./worship"

class WorshipMgr {
    private static instance: WorshipMgr;
    worships: Map<string, Worship>;

    constructor() {
        this.worships = new Map<string, Worship>;
    }

    join(id: string) {
        if (!this.worships.has(id)) {
            let worship = new Worship(id);
            this.worships.set(id, worship);
        }

        let worship = this.worships.get(id)!;
        worship.join();
    }
}