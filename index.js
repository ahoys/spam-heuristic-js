const defaultEmphasis = require('./configs/defaultEmphasis.json');
const Suspect = require('./components/inc.class.Suspect');
const Group = require('./components/inc.class.Group');

module.exports = class HeuristicEngine {

    /**
     * Sets a new group.
     * @param id
     */
    setGroup(id) {
        if (id && (typeof id === 'string' || typeof id === 'number')) {
            try {
                const groupObj = new Group(id);
                this.groupsArr.push(groupObj);
            } catch (e) {
                throw new Error('Failed to set a new group.')
            }
        } else {
            throw new TypeError('Invalid id for a group.')
        }
    };

    /**
     * Sets a new suspect.
     * @param id
     */
    setSuspect(id) {
        if (id && (typeof id === 'string' || typeof id === 'number')) {
            try {
                const suspectObj = new Suspect(id);
                this.suspectsArr.push(suspectObj);
            } catch (e) {
                throw new Error('Failed to set a new suspect.')
            }
        } else {
            throw new TypeError('Invalid id for a suspect.')
        }
    };

    /**
     * Returns all groups.
     * @returns {Array}
     */
    get groups() {
        try {
            return this.groupsArr;
        } catch (e) {
            throw new Error('Returning all groups failed.');
        }
    }

    /**
     * Returns all suspects.
     * @returns {Array}
     */
    get suspects() {
        try {
            return this.suspectsArr;
        } catch (e) {
            throw new Error('Returning all suspects failed.');
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
        this.groupsArr = [];
        this.suspectsArr = [];
    };
};