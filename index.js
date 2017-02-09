const defaultEmphasis = require('./configs/defaultEmphasis.json');
const Suspect = require('./components/inc.class.Suspect');
const Group = require('./components/inc.class.Group');
const Immutable = require('immutable');

module.exports = class HeuristicEngine {

    /**
     * Sets a new group.
     * @param gId
     */
    setGroup(gId) {
        if (gId && (typeof gId === 'string' || typeof gId === 'number')) {
            if (this.groupsMap.has(gId)) {
                throw new Error('A group with the same id already exists.');
            } else {
                this.groupsMap = this.groupsMap.set(gId, new Group(gId));
            }
        } else {
            throw new TypeError('Invalid id for a group.')
        }
    };

    /**
     * Returns all groups.
     * @returns {Array}
     */
    get groups() {
        try {
            return this.groupsMap;
        } catch (e) {
            throw new Error('Returning all groups failed.');
        }
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
        this.emphasis = this.constructor.getProcessedEmphasis(userEmphasis);
        this.groupsMap = Immutable.Map({});
    };
};