const Suspect = require('./inc.class.Suspect');
const Event = require('./inc.class.Event');
const Immutable = require('immutable');

module.exports = class Group {

    setEvent(target, suspectObj) {
        try {

        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Setting a group event failed.`);
            return this.defaultReturn;
        }
    }


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

    /**
     * Returns all suspects.
     * @returns {*}
     */
    get suspects() {
        return this.suspectsMap;
    }

    constructor() {
        // All target events.
        this.eventsMap = Immutable.OrderedMap({});
        // Events that got caught to heuristics.
        this.eventsHighlightMap = Immutable.OrderedMap({});
        this.suspectsMap = Immutable.Map({});
    }
};