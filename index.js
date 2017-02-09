const defaultEmphasis = require('./configs/defaultEmphasis.json');

class HeuristicEngine {

    /**
     * Returns probability of a spam.
     * @param target
     * @returns {number}
     */
    getProbability(target) {
        return 0;
    };

    /**
     * Returns severity of a spam.
     * @param target
     * @returns {number}
     */
    getSeverity(target) {
        return 0;
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
    };

}

module.exports = HeuristicEngine;