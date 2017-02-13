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
                let thisTarget, thisSuspect, suspectAnalysis, groupAnalysis;

                // Target analysis ----------------------------
                thisTarget = new Event(target);

                // TODO: Use heuristics here for the target.

                // Suspect analysis ---------------------------
                if (typeof sId in allowedTypes) {
                    // Register an optional suspect.
                    const thisSuspect = new Suspect();
                    thisSuspect.setEvent(target);
                    suspectAnalysis = thisSuspect.getAnalysis();
                }

                // Group analysis -----------------------------
                if (typeof gId in allowedTypes && thisSuspect) {
                    // Register an optional group.
                    let thisGroup;
                    if (this.groupsMap.has(gId)) {
                        // An existing group.
                        thisGroup = this.groupsMap.get(gId);
                    } else {
                        // A new group.
                        thisGroup = new Group(gId);
                        this.groupsMap = this.groupsMap.set(gId, thisGroup);
                    }
                    thisGroup.setEvent(target, thisSuspect);
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
            console.log(process.version);
            if (userEmphasis !== undefined) {
                console.log(`Error: failed to process the custom emphasis. Please check your arguments.`)
            } else {
                console.log(`Error: Failed to process the default emphasis.`);
            }
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