const Immutable = require('immutable');

module.exports = class Suspect {

    /**
     * Makes sure eventMap or eventHistoryMap won't get too large.
     * @returns {number}
     */
    static cleanEvents() {
        return 0;
    };

    /**
     * Sets a new event.
     * All events are investigated and validated based on different heuristics.
     * @param event
     * @param date
     */
    setEvent(event, date) {
        try {
            if (
                event !== undefined &&
                (typeof event === 'string' || typeof event === 'number')
            ) {
                const eId = Object.prototype.toString.call(date) === '[object Date]'
                    ? date
                    : new Date();

                // TODO: use heuristics and create an event object with probability and severity.

                this.eventMap = this.eventMap.set(eId, event);
                return eId;
            } else {
                return undefined;
            }
        } catch (e) {
            console.log(`[${new Date()}] spam-heuristic: Settings an event failed.`);
        }
    }

    /**
     * Returns all the stored events of a suspect.
     * @returns {*}
     */
    get events() {
        return this.eventMap;
    }

    /**
     * Returns the entire event history of a suspect.
     * @returns {*}
     */
    get eventHistory() {
        return this.eventHistoryMap;
    }

    constructor() {
        this.eventMap = Immutable.OrderedMap({});
        this.eventHistoryMap = Immutable.OrderedMap({});
    }
};