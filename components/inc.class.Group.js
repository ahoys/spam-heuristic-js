const Suspect = require('./inc.class.Suspect');
const Immutable = require('immutable');

module.exports = class Group {

    /**
     * Sets a new suspect.
     * @param sId
     * @returns {*}
     */
    setSuspect(sId) {
        try {
            if (
                sId !== undefined &&
                (typeof sId === 'string' || typeof sId === 'number') &&
                this.suspectsMap.has(sId) === false
            ) {
                const newSuspectObj = new Suspect();
                this.suspectsMap = this.suspectsMap.set(sId, newSuspectObj);
                return newSuspectObj;
            } else {
                return undefined;
            }
        } catch (e) {
            console.log(`[${new Date()}] spam-heuristic: Setting a new suspect failed.`);
        }
    }

    /**
     * Returns an existing suspect.
     * @param sId
     * @returns {undefined}
     */
    getSuspect(sId) {
        try {
            return this.suspectsMap.has(sId) ? this.suspectsMap.get(sId) : undefined;
        } catch (e) {
            console.log(`[${new Date()}] spam-heuristic: Returning a suspect failed.`);
        }
    }

    get suspects() {
        return this.suspectsMap;
    }

    constructor() {
        this.suspectsMap = Immutable.Map({});
    }
};