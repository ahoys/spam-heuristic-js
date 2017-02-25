const Core = require('../index');
const Suspect = require('./class.Suspect');
const EventMessage = require('./class.EventMessage');
const Immutable = require('immutable');
module.exports = class Group {

    /**
     * Returns percentage of events in a group's recent history that has
     * been violating events (regular spam with variation).
     * @param groupObj
     */
    static getPercentageOfViolatingEvents(groupObj) {
        try {
            return 0;
        } catch (e) {
            console.log(`Error [Group][getPercentageOfViolatingEvents]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns percentage of events in a group's recent history that has
     * been identical events (regular spam).
     * @param groupObj
     * @param eventObj
     */
    static getPercentageOfIdenticalEvents(groupObj, eventObj) {
        try {
            return 0;
        } catch (e) {
            console.log(`Error [Group][getPercentageOfIdenticalEvents]: ${e.message}`);
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
            if (
                ['string', 'number'].includes(typeof sId) &&
                ['string'].includes(typeof eventFrame)
            ) {
                // Keep track of the suspects.
                // There will be only one suspect with a distinct id.
                if (!this._suspectsMap.has(sId)) {
                    this._suspectsMap = this._suspectsMap.set(
                        sId,
                        new Suspect(sId)
                    );
                }

                // Construct a new event.
                // Events are always new.
                let thisEvent;
                if (typeof eventFrame === 'string') {
                    thisEvent = new EventMessage(eventFrame);
                }

                // Make a record.
                // A records holds the suspect id who triggered the event and
                // the event itself.
                if (typeof thisEvent === 'object') {
                    this._recordsMap = this._recordsMap.set(
                        Core.getMapId(this._recordsMapId, 128),
                        {
                            suspect: sId,
                            event: thisEvent
                        }
                    );
                }
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