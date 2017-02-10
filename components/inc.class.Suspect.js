const Immutable = require('immutable');

module.exports = class Suspect {

    /**
     * Sets a new event.
     * @param event
     * @param date
     */
    setEvent(event, date) {
        try {
            if (
                event !== undefined &&
                (typeof event === 'string' || typeof event === 'number')
            ) {
                this.eventMap = this.eventMap.set(
                    Object.prototype.toString.call(date) === '[object Date]'
                        ? date
                        : new Date(),
                    event
                );
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