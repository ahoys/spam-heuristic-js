const Immutable = require('immutable');

module.exports = class Suspect {

    setHistoryLine(ln) {
        try {
            if (ln !== undefined) {
                this.historyMap = this.historyMap.push(new Date(), String(ln));
            }
        } catch (e) {
            throw new Error(`[${new Date()}] spam-heuristic: Setting a new history line failed.`);
        }
    }

    get history() {
        return this.historyMap;
    }

    constructor() {
        this.historyMap = Immutable.Stack();
    }
};