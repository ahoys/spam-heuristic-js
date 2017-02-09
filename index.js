const defaultEmphasis = require('./configs/defaultEmphasis.json');
const immutable = require('immutable');

class HeuristicEngine {

    /**
     * Sets a new suspect for heuristics.
     * Each suspect has their own probability of being a spammer.
     * @param uId: mandatory
     * @param immune: optional
     */
    setSuspect(uId, immune) {
        this.subjects = this.subjects.set(uId, {
            id: uId,
            immune: Boolean(immune),
            probability: 0,
            severity: 0
        });
    };

    /**
     * Returns a suspect.
     * @param uId
     * @returns {*}
     */
    getSuspect(uId) {
        return this.subjects.has(uId)
            ? this.subjects.get(uId)
            : undefined;
    };

    /**
     * Returns all suspects.
     * @returns {*}
     */
    getSubjects() {
        return this.suspects.toJS();
    };

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
        this.emphasis = this.constructor.getProcessedEmphasis(userEmphasis);
        this.suspects = new immutable.Map({});
    };

}

module.exports = HeuristicEngine;