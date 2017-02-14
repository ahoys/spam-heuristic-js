const HeuristicEngine = require('../index');
const Event = require('./inc.class.Event');
const Immutable = require('immutable');
const defaultSettings = require('../configs/defaultSettings.json');

module.exports = class Suspect {

    /**
     * Returns a full analysis of a suspect.
     * @returns {{certainty: number, severity: number}|*}
     */
    getSuspectAnalysis() {
        try {
            // TODO: heuristics.
            return this.defaultReturn;
        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Returning a suspect analysis failed.`);
            return this.defaultReturn;
        }
    }

    /**
     * Registers an event by a suspect.
     * @param eventObj
     */
    setSuspectEvent(eventObj) {
        try {
            if (eventObj instanceof Event) {
                if (eventObj.isNoteworthy()) {
                    // A noteworthy event found. Write a record.
                    this.eventsHighlightMap = this.eventsHighlightMap.set(
                        HeuristicEngine.getMapId(
                            this.bufferIndexHighlights,
                            defaultSettings.BUFFER.MAX_EVENT_HISTORY_MAP_SIZE), eventObj);
                    this.violationsValue++;
                }
                this.eventsMap = this.eventsMap.set(
                    HeuristicEngine.getMapId(
                        this.bufferIndexEvents,
                        defaultSettings.BUFFER.MAX_EVENT_MAP_SIZE), eventObj);
            }
        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Setting an event for a suspect failed.`);
        }
    }

    /**
     * Returns a violations count of a suspect.
     * @returns {number}
     */
    get violations() {
        return this.violationsValue;
    }

    /**
     * Returns id of a suspect.
     * @returns {*}
     */
    get id() {
        return this.suspectId;
    }

    constructor(suspectId) {
        this.suspectId = suspectId;
        this.eventsMap = Immutable.OrderedMap({});
        this.eventsHighlightMap = Immutable.OrderedMap({});
        this.violationsValue = 0;
        this.defaultReturn = {
            certainty: 0,
            severity: 0
        };
        this.bufferIndexEvents = -1;
        this.bufferIndexHighlights = -1;
    }
};