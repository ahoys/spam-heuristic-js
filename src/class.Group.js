const Ensemble = require('../index');
const Suspect = require('./class.Suspect');
const EventMessage = require('./class.EventMessage');
const defaultEmphasis = require('./emphasis/group.json');
const Immutable = require('immutable');
module.exports = class Group {

    /**
     * Returns a percentage of how many of the event values are identical.
     * @param events
     * @returns {number}
     */
    static getPercentageOfRepetitiveEvents(events) {
        try {
            if (events.constructor !== Array) return 0;
            // Count how many times each value has occurred.
            const valueCounts = {};
            events.forEach((event) => {
                valueCounts[event.value] = (valueCounts[event.value] || 0) + 1;
            });
            // Count how many percent of the events are copies.
            let totalRepeatCountPercentage = 0;
            let totalValueCount = events.length;
            Object.keys(valueCounts).forEach((key) => {
                if (valueCounts[key] > 1) {
                    totalRepeatCountPercentage += valueCounts[key] / (totalValueCount || 1) * 100;
                }
            });
            return totalRepeatCountPercentage;
        } catch (e) {
            console.log(`Error [Group][getPercentageOfRepetativeEvents]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns a percentage of how many of the given events are created in less than 2 seconds from each other.
     * @param events
     * @returns {number}
     */
    static getPercentageOfRapidEvents(events) {
        try {
            if (events.constructor !== Array) return 0;
            const timestamps = events.map(event => event.created);
            let previous = 0;
            let rapidEventsCount = 0;
            timestamps.forEach((timestamp, i) => {
                if (i < 1) {
                    previous = timestamp;
                } else {
                    if (timestamp - previous < 2000) rapidEventsCount ++;
                }
            });
            return rapidEventsCount / (events.length || 1) * 100;
        } catch (e) {
            console.log(`Error [Group][getPercentageOfRapidEvents]: ${e.message}`);
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
                // Initial target and settings.
                const suspectObj = this.suspectsMap.get(sId);
                const emphasis = this.emphasisValue;
                // Collect noteworthy records by the suspect.
                // We are only interested about the near history.
                let totalCertainty = 0;
                let maxSeverity = 0;
                const suspectEvents = [];
                this.recordsMap.forEach((record, i) => {
                    if (record.sId === suspectObj.id && i < emphasis.RANGE.recent_history) {
                        // A record by the suspect.
                        if (record.eventObj.certainty >= emphasis.THRESHOLD.min_certainty) {
                            // A noteworthy record.
                            totalCertainty += record.eventObj.certainty;
                            if (record.eventObj.severity > maxSeverity) {
                                maxSeverity = record.eventObj.severity;
                            }
                        }
                        suspectEvents.push(record.eventObj);
                    }
                });
                // Run heuristics.
                const heuristicPercentages = [];
                // Find out whether the recorded events are identical (spam).
                heuristicPercentages.push(this.constructor.getPercentageOfRepetitiveEvents(suspectEvents));
                // Find out whether the suspect is fast spamming.
                heuristicPercentages.push(this.constructor.getPercentageOfRapidEvents(suspectEvents));
                // Analyze the results.
                let max = 0;
                let violations = 0;
                let sum = 0;
                heuristicPercentages.forEach((percentage) => {
                    if (percentage > max) max = percentage;
                    if (percentage > 33) violations++;
                    sum += percentage || 0;
                });
                const testCount = heuristicPercentages.length;
                const multiplier = sum / testCount / 100 + 1;
                totalCertainty += max * multiplier;
                maxSeverity += violations / testCount * 10;
                // Return the final results.
                return {
                    certainty: Math.round(totalCertainty > 100 ? 100 : totalCertainty),
                    severity: Math.round(maxSeverity > 10 ? 10 : maxSeverity)
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