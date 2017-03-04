const Ensemble = require('../index');
const Suspect = require('./class.Suspect');
const Event = require('./class.Event');
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
            if (groupObj instanceof Group) {
                let violationC = 0;
                groupObj._recordsMap.forEach((record) => {
                    if (record.isNoteworthy()) violationC++;
                });
                return Math.round((violationC / groupObj._recordsMap.size) * 100);
            }
            return 0;
        } catch (e) {
            console.log(`Error [Group][getPercentageOfViolatingEvents]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns percentage of events in a group's recent history that has
     * been identical events (regular spam). Do note that the suspects may vary.
     * @param groupObj
     * @param eventObj
     */
    static getPercentageOfIdenticalEvents(groupObj, eventObj) {
        try {
            if (groupObj instanceof Group && eventObj instanceof Event) {
                const eventType = eventObj.constructor.name;
                let identicalC = 0;
                groupObj._recordsMap.forEach((record) => {
                    const eventRecord = record.event;
                    if (eventRecord.constructor.name === eventType) {
                        if (
                            eventType === 'eventMessage' &&
                            eventRecord.message === eventObj.message
                        ) identicalC++;
                    }
                });
                return Math.round((identicalC / groupObj._recordsMap.size) * 100);
            }
        } catch (e) {
            console.log(`Error [Group][getPercentageOfIdenticalEvents]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns a group level analysis for a suspect.
     * @param sId
     * @returns {{certainty: number, severity: number, violations: number}|*}
     */
    getSuspectAnalysis(sId) {
        try {
            const suspectObj = this._suspectsMap.has(sId)
                ? this._suspectsMap.get(sId)
                : undefined;
            if (suspectObj) {
                // An existing suspect.
            }
            return {};
        } catch (e) {
            console.log(`Error [Group][getSuspectAnalysis]: ${e.message}`);
            return {};
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
                        Ensemble.getMapId(this._recordsMapId, 128),
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

    constructor(_id, _emphasis) {
        this._id = _id;
        this._emphasis = _emphasis;
        this._recordsMap = Immutable.OrderedMap({});
        this._recordsMapId = -1;
        this._suspectsMap = Immutable.Map({});
    }
};