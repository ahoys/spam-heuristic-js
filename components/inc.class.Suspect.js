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
            console.log(`${new Date()}: Returning analysis failed.`);
            return this.defaultReturn;
        }
    }

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
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Creation of an id failed.`);
            return 0;
        }
    }

    /**
     * Sets an event for a suspect.
     * @param eventObj
     */
    setEvent(eventObj) {
        try {
            if (eventObj instanceof Event) {
                const eId = this.getMapId('eventsMap');
                if (
                    eventObj.certainty >= defaultSettings.EVENT.HIGHLIGHT_CERTAINTY_THRESHOLD ||
                    eventObj.severity >= defaultSettings.EVENT.HIGHLIGHT_SEVERITY_THRESHOLD
                ) {
                    // A noteworthy event found. Write a record.
                    const ehId = this.getMapId('eventsHighlightMap');
                    this.eventsHighlightMap = this.eventsHighlightMap.set(ehId, eventObj);
                }
                this.eventsMap = this.eventsMap.set(eId, eventObj);
            }
        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Setting an event for a suspect failed.`);
        }
    }

    constructor() {
        this.eventsMap = Immutable.OrderedMap({});
        this.eventsHighlightMap = Immutable.OrderedMap({});
        this.defaultReturn = {
            certainty: 0,
            severity: 0
        };
        this.bufferIndexEvents = 0;
        this.bufferIndexHighlights = 0;
    }
};