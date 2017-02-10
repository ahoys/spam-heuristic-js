const Suspect = require('./inc.class.Suspect');
const Immutable = require('immutable');

module.exports = class Group {

    setSuspect(sId) {
        try {
            if (
                sId !== undefined &&
                (typeof sId === 'string' || typeof sId === 'number') &&
                this.suspectsMap.has(sId) === false
            ) {
                this.suspectsMap = this.suspectsMap.set(sId, new Suspect())
            }
        } catch (e) {
            throw new Error(`[${new Date()}] spam-heuristic: Setting a new suspect failed.`);
        }
    }

    getSuspect(sId) {
        try {
            return this.suspectsMap.has(sId) ? this.suspectsMap.get(sId) : undefined;
        } catch (e) {
            throw new Error(`[${new Date()}] spam-heuristic: Returning a suspect failed.`);
        }
    }

    get suspects() {
        return this.suspectsMap;
    }

    constructor() {
        this.suspectsMap = Immutable.Map({});
    }
};