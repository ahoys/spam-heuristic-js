const Event = require('./inc.class.Event');
const Immutable = require('immutable');
const defaultSettings = require('../configs/defaultSettings.json');

module.exports = class Suspect {

    /**
     * Returns a suitable id for an event or event highlight.
     * @param type
     * @returns {number}
     */
    static getMapId(type) {
        try {
            // Use indexing to make sure the buffer limits are not exceeded.
            let id = 0;
            if (type === 'eventsMap') {
                id = this.bufferIndexEvents;
                this.bufferIndexEvents = (this.bufferIndexEvents + 1) < defaultSettings.BUFFER.MAX_EVENT_MAP_SIZE
                    ? this.bufferIndexEvents + 1
                    : 0;
            } else if (type === 'eventsHighlightMap') {
                id = this.bufferIndexHighlights;
                this.bufferIndexHighlights = (this.bufferIndexHighlights + 1) < defaultSettings.BUFFER.MAX_EVENT_HISTORY_MAP_SIZE
                    ? this.bufferIndexHighlights + 1
                    : 0;
            }
            return id;
        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Returning an id failed.`);
            return 0;
        }
    }

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
                        this.getMapId('eventsHighlightMap'), eventObj);
                    this.violationsValue++;
                }
                this.eventsMap = this.eventsMap.set(this.getMapId('eventsMap'), eventObj);
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
        this.bufferIndexEvents = 0;
        this.bufferIndexHighlights = 0;
    }
};