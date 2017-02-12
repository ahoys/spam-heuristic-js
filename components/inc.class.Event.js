const defaultSettings = require('../configs/defaultSettings.json');

module.exports = class Event {

    /**
     * Evaluates this event's certainty against multiple heuristics.
     * @param target
     * @returns {number}
     */
    static getCertainty(target) {
        let value = 0;

        // TODO: Heuristics.

        // Return value with a proper range.
        return value <= defaultSettings.EVENT.MAX_CERTAINTY
            ? value >= 0
                ? value
                : 0
            : defaultSettings.EVENT.MAX_CERTAINTY;
    }

    /**
     * Evaluates this event's severity against multiple heuristics.
     * @param target
     * @returns {number}
     */
    static getSeverity(target) {
        let value = 0;

        // TODO: Heuristics.

        // Return value with a proper range.
        return value <= defaultSettings.EVENT.MAX_SEVERITY
            ? value >= 0
                ? value
                : 0
            : defaultSettings.EVENT.MAX_SEVERITY;
    }

    /**
     * Returns the certainty of this event.
     * By certainty we mean how certain we are about our findings (severity) considering this event.
     * @returns {number}
     */
    get certainty() {
        try {
            return Number(this.certaintyValue);
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning event's certainty failed.`);
            return 0;
        }
    }

    /**
     * Returns the severity of this event.
     * By severity we mean how serious violation this event is.
     * @returns {number}
     */
    get severity() {
        try {
            return Number(this.severityValue);
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning event's severity failed.`);
            return 0;
        }
    }

    constructor(target) {
        this.certaintyValue = this.getCertainty(target);
        this.severityValue = this.getSeverity(target);
    }
};