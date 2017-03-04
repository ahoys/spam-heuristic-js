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
     * Returns a group level analysis for a suspect.
     * @param sId
     * @returns {{certainty: number, severity: number, violations: number}|*}
     */
    getSuspectAnalysis(sId) {
        try {
            const suspectObj = this.suspectsMap.has(sId)
                ? this.suspectsMap.get(sId)
                : undefined;
            if (suspectObj) {
                // Collect noteworthy records by the suspect.
                const suspectRecords = this.recordsMap
                    .filter(x => x.sId === suspectObj.id &&
                    x.eventObj.certainty >= this.emphasisValue.THRESHOLD.certainty &&
                    x.eventObj.severity >= this.emphasisValue.THRESHOLD.severity);
                if (suspectRecords.size > 0) {
                    // Calculate base values.
                    let totalCertainty = 0;
                    let totalSeverity = 0;
                    let totalShortCertainty = 0;
                    let totalShortSeverity = 0;
                    let maxSeverity = 0;
                    const size = suspectRecords.size;
                    const last5i = size - 5;
                    const last25i = size - 25;
                    suspectRecords.forEach((record, i) => {
                        console.log('pass: ', record.eventObj, i);
                        totalCertainty = totalCertainty + record.eventObj.certainty;
                        totalSeverity = totalSeverity + record.eventObj.severity;
                        if (size <= 5 || i >= last5i) {
                            // Last 5 records for certainty.
                            totalShortCertainty = totalShortCertainty + record.eventObj.certainty;
                        }
                        if (size <= 25 || i >= last25i) {
                            // Last 25 records for severity.
                            totalShortSeverity = totalShortSeverity + record.eventObj.severity;
                        }
                        if (record.eventObj.severity > maxSeverity) {
                            maxSeverity = record.eventObj.severity;
                        }
                    });
                    // Calculate averages.
                    const avgCertainty = size / totalCertainty * 100;
                    const avgShortCertainty = 5 / totalShortCertainty * 100;
                    // We now have results for a long term analysis and a short term analysis.
                    // Results are average of the two analysis.
                    return {
                        certainty: Math.round((avgCertainty + avgShortCertainty) / 2),
                        severity: Math.round(maxSeverity)
                    };
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
     * @param eventFrame
     */
    setRecord(sId, eventFrame) {
        try {
            // Validate input.
            if (!Ensemble.isValidType([sId, eventFrame], [['string', 'number'], ['object']])) return;
            if (!Ensemble.isValidType([eventFrame.type, eventFrame.value], [['string'], ['string', 'number']])) return;

            // Register distinct suspects.
            if (!this.suspectsMap.has(sId)) {
                this.suspectsMap = this.suspectsMap.set(sId, new Suspect(sId));
            }

            // Create an event based on the eventFrame.
            // Events are always new.
            let thisEvent;
            if (eventFrame.type === 'eventMessage') {
                // EventMessage
                thisEvent = new EventMessage(eventFrame.value);
            }

            if (thisEvent) {
                this.recordsMapId = Ensemble.getMapId(this.recordsMapId, 128);
                this.recordsMap = this.recordsMap.set(
                    this.recordsMapId,
                    {
                        sId: sId,
                        eventObj: thisEvent
                    }
                );
            }
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