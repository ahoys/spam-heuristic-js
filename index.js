const defaultEmphasis = require('./configs/defaultEmphasis.json');
const Event = require('./components/inc.class.Event');
const Suspect = require('./components/inc.class.Suspect');
const Group = require('./components/inc.class.Group');
const Immutable = require('immutable');

module.exports = class HeuristicEngine {

    /**
     * Returns a full analysis of a target string.
     * @param target {string} mandatory
     * @param sId {number} optional
     * @param gId {number} optional
     * @returns {{certainty: number, severity: number}}
     */
    getAnalysis(target, sId, gId) {
        try {
            if (typeof target === 'string') {
                const allowedTypes = ['string', 'number'];
                let thisEvent, thisSuspect, suspectAnalysis, groupAnalysis;

                // Target analysis ----------------------------
                thisEvent = new Event(target);

                // TODO: Use heuristics here for the target.

                // Suspect analysis ---------------------------
                if (typeof sId in allowedTypes) {
                    // Register an optional suspect.
                    thisSuspect = this.suspectsMap.has(sId) ? this.suspectsMap.get(sId) : new Suspect();
                    thisSuspect.setEvent(thisEvent);
                    this.suspectsMap = this.suspectsMap.set(sId, thisSuspect);
                    suspectAnalysis = thisSuspect.getAnalysis();
                }

                // Group analysis -----------------------------
                if (typeof gId in allowedTypes && thisSuspect) {
                    // Register an optional group.
                    const thisGroup = this.groupsMap.has(gId) ? this.groupsMap.get(gId) : new Group();
                    thisGroup.setEvent(thisSuspect);
                    this.groupsMap = this.groupsMap.set(gId, thisGroup);
                    groupAnalysis = thisGroup.getAnalysis();
                }

                // Combine results ----------------------------
                // TODO: Use heuristics to combine results.
                return this.defaultReturn;
            }
            return this.defaultReturn;
        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Returning analysis failed.`);
            return this.defaultReturn;
        }
    }

    /**
     * Returns the emphasis.
     * @returns {object}
     */
    get emphasis() {
        return this.emphasisJSON;
    }

    /**
     * Returns all suspects in an immutable map.
     * @returns {Map}
     */
    get suspects() {
        return this.suspectsMap;
    }

    /**
     * Returns all groups in an immutable map.
     * @returns {Map}
     */
    get groups() {
        return this.groupsMap;
    }

    /**
     * Sets an emphasis for the heuristics.
     * Emphasis includes severity values for different heuristics, it will basically tell
     * how serious some distinct form of spam is.
     * @param userEmphasis
     */
    static getProcessedEmphasis(userEmphasis) {
        try {
            return userEmphasis !== undefined
                ? JSON.parse(userEmphasis)
                    ? userEmphasis
                    : defaultEmphasis
                : defaultEmphasis;
        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Failed to process the emphasis.`);
            return defaultEmphasis;
        }
    };

    constructor(userEmphasis) {
        this.emphasisJSON = this.constructor.getProcessedEmphasis(userEmphasis);
        this.suspectsMap = Immutable.Map({});
        this.groupsMap = Immutable.Map({});
        this.defaultReturn = {
            certainty: 0,
            severity: 0
        }
    };
};

/*

 Idea of usage:

 const Heuristics = new Heuristics(emphasis);
 const results = Heuristics.getAnalysis(msg, suspectId, groupId);

 */