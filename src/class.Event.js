const Ensemble = require('../index');
const Heuristics = require('./emphasis/heuristics.json');
const immutable = require('immutable');
module.exports = class Event {

  /**
   * Returns a directly propotional value that is as big or smaller than
   * the focus of interest, a.
   * @param {number} a : Base value & maximum result.
   * @param {number} b : Reflector. Result will be reflection of this value.
   * @param {number} max : Limitter. If b >= max, the result will be a.
   * @returns {number}
   */
  static getDirectlyProportionalAnalysis(a = 0, b = 100, max = 10) {
    try {
      const result = (a * b) / (max || 1);
      return result > max ? max : result;
    } catch (e) {
      console.log(`Error [Event][getReflectedValue]: ${e.message}`);
      return 0;
    }
  }

  /**
   * Returns whether an event is noteworthy.
   * @returns {boolean}
   */
  isNoteworthy() {
    try {
      return (
        this.certaintyValue >= defaultSettings.EVENT.HIGHLIGHT_CERTAINTY_THRESHOLD ||
        this.severityValue >= defaultSettings.EVENT.HIGHLIGHT_SEVERITY_THRESHOLD
      );
    } catch (e) {
      console.log(`Error [Event][isNoteworthy]: ${e.message}`);
      return false;
    }
  };

  /**
   * Sets certainty for an event.
   * Certainty tells how probable it is that the heuristics have detected a real threat.
   * 0: No threats, 100: fully certain of a threat.
   * @param value {number}
   */
  set certainty(value) {
    try {
      this.certaintyValue = Math.round(Ensemble.getFromRange(value, 0, 100));
    } catch (e) {
      console.log(`Error [Event][set certainty]: ${e.message}`);
    }
  };

  /**
   * Sets severity for an event.
   * Severity tells how serious the violations are.
   * 0: Not serious at all, 10: very serious.
   * @param value {number}
   */
  set severity(value) {
    try {
      this.severityValue = Math.round(Ensemble.getFromRange(value, 0, 10));
    } catch (e) {
      console.log(`Error [Event][set severity]: ${e.message}`);
    }
  };

  /**
   * Sets a new created timestamp.
   * Mainly for testing purposes.
   * @param value {number}
   */
  set created(value) {
    try {
      if (typeof value === 'number') {
        this.createdValue = value;
      }
    } catch (e) {
      console.log(`Error [Event][set created]: ${e.message}`);
    }
  }

  /**
   * Returns certainty of an event.
   * @returns {number}
   */
  get certainty() {
    return this.certaintyValue;
  }

  /**
   * Returns severity of an event.
   * @returns {number}
   */
  get severity() {
    return this.severityValue;
  }

  /**
   * Returns when an event was created.
   * @returns {number}
   */
  get created() {
    return this.createdValue;
  }

  /**
   * Returns the value of an event.
   * @returns {*}
   */
  get value() {
    return this.eventValue;
  }

  constructor(eventValue) {
    this.eventValue = eventValue;
    this.createdValue = Number(new Date().getTime());
    this.certaintyValue = 0;
    this.severityValue = 0;
  }
};