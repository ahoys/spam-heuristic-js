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
        if (gId !== undefined && (typeof gId === 'string' || typeof gId === 'number')) {
            if (this.groupsMap.has(gId) === false) {
                const newGroupObj = new Group();
                this.groupsMap = this.groupsMap.set(gId, newGroupObj);
                return newGroupObj;
            } else {
                return undefined;
            }
        } else {
            throw new TypeError('Invalid id for a group.')
        }
    };

    /**
     * Returns an existing group.
     * @param gId
     * @returns {undefined}
     */
    getGroup(gId) {
        try {
            return this.groupsMap.has(gId) ? this.groupsMap.get(gId) : undefined;
        } catch (e) {
            console.log(`[${new Date()}] spam-heuristic: Returning a group failed.`);
        }
    }

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