const Core = require('../index');
const Suspect = require('./class.Suspect');
const EventMessage = require('./class.EventMessage');
const Immutable = require('immutable');
module.exports = class Group {

    /**
     * Returns how many of the events in a groups recent history has
     * been violating events (regular spam with variation).
     */
    static getPercentageOfPreviousViolatingEvents(events, maxDelay) {
        try {
            return 0;
        } catch (e) {
            console.log(`Error [Group][getPercentageOfPreviousViolatingEvents]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns how many of the events in a groups recent history has
     * been identical events (regular spam).
     */
    static getPercentageOfPreviousIdenticalEvents(events, maxDelay) {
        try {
            return 0;
        } catch (e) {
            console.log(`Error [Group][getPercentageOfPreviousIdenticalEvents]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Sets a new record.
     * A record is a combination of a suspect and an event.
     * @param sId
     * @param eventFrame
     */
    setRecord(sId, eventFrame) {
        try {
            // Validate arguments.
            const validFrames = ['string'];
            if (
                typeof sId !== 'string' ||
                !validFrames.includes(typeof eventFrame)
            ) return;

            // Keep track of the suspects.
            if (!this._suspectsMap.has(sId)) {
                this._suspectsMap = this._suspectsMap.set(
                    sId,
                    new Suspect(sId)
                );
            }

            // Construct a new event.
            let thisEvent;
            if (typeof eventFrame === 'string') {
                thisEvent = new EventMessage(eventFrame);
            }

            // Make a record.
            if (typeof thisEvent === 'object') {
                this._recordsMap = this._recordsMap.set(
                    Core.getMapId(this._recordsMapId, 128),
                    {
                        suspect: this._suspectsMap.get(sId),
                        event: thisEvent
                    }
                );
            }
        } catch (e) {
            console.log(`Error [Group][setRecord]: ${e.message}`);
        }
    }

    get id() {
        return this._id;
    }

    constructor(_id) {
        this._id = _id;
        this._recordsMap = Immutable.OrderedMap({});
        this._recordsMapId = -1;
        this._suspectsMap = Immutable.Map({});
    }
};