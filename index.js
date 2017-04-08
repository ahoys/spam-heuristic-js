const Group = require('./src/class.Group');
const EventMessage = require('./src/class.EventMessage');
const Immutable = require('immutable');

module.exports = class Ensemble {

  /**
   * Returns value inside a given range.
   * @param value
   * @param min
   * @param max
   * @returns {*}
   */
  static getFromRange(value = 0, min = 0, max = 0) {
    try {
      return value < min
        ? min
        : value > max
          ? max
          : value;
    } catch (e) {
      console.log(`Error [HeuristicEnsemble][getFromRange]: ${e.message}`);
      return 0;
    }
  }

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
        return currentKey < maxKey ? currentKey + 1 : 0;
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
   * @param eventValue
   * @returns {*}
   */
  getAnalysis(gId, sId, eventValue) {
    try {
      // Validate input.
      if (!this.constructor.isValidType([gId, sId, eventValue], ['string', 'number'])) return {};

      // Initialize a group.
      const groupObj = this._groupsMap.has(gId) ? this._groupsMap.get(gId) : new Group(gId, this.emphasis);

      // Process an event.
      if (typeof eventValue === 'string' || typeof eventValue === 'number') {
        // EventMessage
        groupObj.setRecord(sId, new EventMessage(String(eventValue)));
      }

      // Save the results.
      this._groupsMap = this._groupsMap.set(gId, groupObj);

      // Return a suspect analysis.
      return groupObj.getSuspectAnalysis(sId);
    } catch (e) {
      console.log(`Error [HeuristicEnsemble][getAnalysis]: ${e.message}`);
      return {};
    }
  };

  constructor() {
    this._groupsMap = Immutable.Map({});
  }
};