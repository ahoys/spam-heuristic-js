const defaultEmphasis = require('./configs/defaultEmphasis.json');
const Group = require('./src/class.Group');
const Immutable = require('immutable');

module.exports = class Ensemble {

    /**
     * Returns a suitable next key for an array or a map.
     * On the first run you should give -1 as a currentKey as otherwise your first index will be 1.
     * @param currentKey
     * @param maxKey
     * @returns {number}
     */
    static getMapId(currentKey, maxKey) {
        try {
            if (typeof currentKey === 'number' && typeof maxKey === 'number') {
                return currentKey < maxKey ? currentKey + 1 : 0 ;
            }
            console.log(`Error [HeuristicEnsemble][getMapId]: Invalid key format.`);
            return -1;
        } catch (e) {
            console.log(`Error [HeuristicEnsemble][getMapId]: ${e.message}`);
            return -1;
        }
    }

    /**
     * Returns true if the given targets are valid.
     * @param targets
     * @param allowedTypes
     * @returns {boolean}
     */
    static isValidType(targets, allowedTypes) {
        const BreakException = {};
        try {
            if (
                targets === undefined ||
                allowedTypes === undefined ||
                targets.constructor !== Array ||
                allowedTypes.constructor !== Array
            ) return false;
            targets.forEach((target, i) => {
                if (allowedTypes[i] !== undefined && allowedTypes[i].constructor === Array) {
                    // allowedTypes construct: [["", ""], [""], ["", "", ""]];
                    if (!allowedTypes[i].includes(typeof target)) throw BreakException;
                } else {
                    // allowedTypes construct: ["", "", ""];
                    if (!allowedTypes.includes(typeof target)) throw BreakException;
                }
            });
            return true;
        } catch (e) {
            if (e === BreakException) return false;
            console.log(`Error [HeuristicEnsemble][isValidType]: ${e.message}`);
            return false;
        }
    }

    /**
     * Returns an analysis for an event of a suspect of a group.
     * This is the main method of using this module.
     * @param gId
     * @param sId
     * @param event
     * @returns {*}
     */
    getAnalysis(gId, sId, event) {
        try {
            // Validate input.
            if (!this.constructor.isValidType([gId, sId, event], ['string', 'number'])) return {};

            // Initialize a group.
            const groupObj = this._groupsMap.has(gId) ? this._groupsMap.get(gId) : new Group(gId, this._emphasis);

            // Process the event.
            groupObj.setRecord(sId, event);

            // Save the results.
            this._groupsMap = this._groupsMap.set(gId, groupObj);

            // Return a suspect analysis.
            return groupObj.getSuspectAnalysis(sId);
        } catch (e) {
            console.log(`Error [HeuristicEnsemble][getAnalysis]: ${e.message}`);
            return {};
        }
    };

    constructor(_emphasis) {
        this._emphasis = !!JSON.parse(_emphasis)
            ? _emphasis
            : defaultEmphasis;
        this._groupsMap = Immutable.Map({});
    }
};