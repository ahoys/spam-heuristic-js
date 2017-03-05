const Ensemble = require('../index');
const Suspect = require('./class.Suspect');
const EventMessage = require('./class.EventMessage');
const defaultEmphasis = require('../configs/defaultEmphasis.json');
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
                groupObj.recordsMap.forEach((record) => {
                    if (record.isNoteworthy()) violationC++;
                });
                return Math.round((violationC / groupObj.recordsMap.size) * 100);
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
                groupObj.recordsMap.forEach((record) => {
                    const eventRecord = record.event;
                    if (eventRecord.constructor.name === eventType) {
                        if (
                            eventType === 'eventMessage' &&
                            eventRecord.message === eventObj.message
                        ) identicalC++;
                    }
                });
                return Math.round((identicalC / groupObj.recordsMap.size) * 100);
            }
        } catch (e) {
            console.log(`Error [Group][getPercentageOfIdenticalEvents]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns percentage of how many of the event values are identical.
     * @param events
     * @returns {number}
     */
    static getPercentageOfRepetitiveEvents(events) {
        try {
            return 0;
        } catch (e) {
            console.log(`Error [Group][getPercentageOfRepetativeEvents]: ${e.message}`);
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
            if (this.suspectsMap.has(sId)) {
                const suspectObj = this.suspectsMap.get(sId);
                const emphasis = this.emphasisValue;
                // Collect noteworthy records by the suspect.
                // We are only interested about the near history.
                let i = 0;
                let totalCertainty = 0;
                let maxSeverity = 0;
                const suspectEvents = this.recordsMap.filter((record) => {
                    if (record.sId === suspectObj.id && i < emphasis.RANGE.recent_history) {
                        // A record by the suspect.
                        i++;
                        console.log(record.eventObj.certainty);
                        if (record.eventObj.certainty >= emphasis.THRESHOLD.min_certainty) {
                            // A noteworthy record.
                            totalCertainty += record.eventObj.certainty;
                            if (record.eventObj.severity > maxSeverity) {
                                maxSeverity = record.eventObj.severity;
                            }
                        }
                        return record.eventObj;
                    }
                });
                // Find out whether the recorded events are identical (spam).
                const repeat = this.constructor.getPercentageOfRepetitiveEvents(suspectEvents);
                return {
                    certainty: Math.round(totalCertainty / (i || 1)),
                    severity: Math.round(maxSeverity)
                }
            }
            return {
                certainty: 0,
                severity: 0
            };
        } catch (e) {
            console.log(`Error [Group][getSuspectAnalysis]: ${e.message}`);
            return {};
        }
    }

    /**
     * Sets a new record for Group.
     * A record is a combination of suspect's id and Event.
     * @param sId
     * @param eventObj
     */
    setRecord(sId, eventObj) {
        try {
            // Validate input.
            if (!Ensemble.isValidType([sId, eventObj], [['string', 'number'], ['object']])) return;

            // Register distinct suspects.
            if (!this.suspectsMap.has(sId)) {
                this.suspectsMap = this.suspectsMap.set(sId, new Suspect(sId));
            }

            // Create a record.
            this.recordsMapId = Ensemble.getMapId(this.recordsMapId, 128);
            this.recordsMap = this.recordsMap.set(
                this.recordsMapId,
                {
                    sId: sId,
                    eventObj: eventObj
                }
            );
        } catch (e) {
            console.log(`Error [Group][setRecord]: ${e.message}`);
        }
    }

    /**
     * Returns identification of Group.
     * @returns {*}
     */
    get id() {
        return this.idValue;
    }

    /**
     * Returns emphasis used by Group.
     * @returns {*}
     */
    get emphasis() {
        return this.emphasisValue;
    }

    /**
     * Returns all records of events Group has.
     * Do note: only a limited amount of records are stored at once.
     * @returns {Map} immutable
     */
    get records() {
        return this.recordsMap;
    }

    /**
     * Returns all distinct suspects Group has.
     * @returns {Map} immutable
     */
    get suspects() {
        return this.suspectsMap;
    }

    constructor(idValue, emphasisValue) {
        this.idValue = idValue;
        // Emphasis used in the heuristics.
        this.emphasisValue = emphasisValue !== undefined && !!JSON.parse(emphasisValue)
            ? emphasisValue
            : defaultEmphasis;
        // All events as records of suspect id, event and time.
        this.recordsMap = Immutable.OrderedMap({});
        this.recordsMapId = -1;
        // Every distinct suspect a group has.
        this.suspectsMap = Immutable.Map({});
    }
};