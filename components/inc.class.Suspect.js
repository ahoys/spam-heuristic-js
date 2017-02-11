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
            if (type === 'eventMap') {
                return this.eventMap.size < defaultSettings.BUFFER.MAX_EVENT_MAP_SIZE
                    ? Number(this.eventMap.size)
                    : 0;
            } else if (type === 'eventHighlightsMap') {
                return this.eventHighlightsMap.size < defaultSettings.BUFFER.MAX_EVENT_HISTORY_MAP_SIZE
                    ? Number(this.eventHighlightsMap.size)
                    : 0;
            }
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Creation of an id failed.`);
            return 0;
        }
    }

    /**
     * Records a new event highlight.
     * @param eventObj
     * @returns {string}
     */
    static setEventHighlight(eventObj) {
        try {
            // Log the highlight and return the id of this record.
            const ehId = this.getMapId('eventHighlightsMap');
            this.eventHighlightsMap = this.eventHighlightsMap.set(ehId, eventObj);
            return String(ehId);
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Setting an event highlight failed.`);
            return '';
        }
    }

    /**
     * Sets a new event for a suspect.
     * All events are investigated and validated based on different heuristics.
     * @param target
     * @returns {string}
     */
    setEvent(target) {
        try {
            if (typeof target === 'string') {
                // Create a new event based on the target string.
                const eId = this.getMapId('eventMap');
                const eventObj = new Event(eId, target);
                if (
                    eventObj.certainty >= defaultSettings.EVENT.HIGHLIGHT_CERTAINTY_THRESHOLD ||
                    eventObj.severity >= defaultSettings.EVENT.HIGHLIGHT_SEVERITY_THRESHOLD
                ) {
                    // A noteworthy event found. Write a record.
                    this.setEventHighlight(eventObj);
                }
                // Log the event and return the id of this record.
                this.eventMap = this.eventMap.set(eId, eventObj);
                return String(eId);
            } else {
                console.log(`[${new Date()}][Type Error] spam-heuristic: Setting an event failed.`);
                return '';
            }
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Setting an event failed.`);
            return '';
        }
    }

    /**
     * Returns certainty that a subject is a real threat.
     * @returns {number}
     */
    get certainty() {
        try {
            // TODO: based on event certainty, calculate certainty.
            return 0;
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning certainty failed.`);
            return 0;
        }
    }

    /**
     * Returns severity of a subject's violations.
     * @returns {number}
     */
    get severity() {
        try {
            // TODO: based on event severity, calculate severity.
            return 0;
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning severity failed.`);
            return 0;
        }
    }

    /**
     * Returns a number of violations by a suspect.
     * @returns {number}
     */
    get violations() {
        try {
            return Number(this.eventHighlightsMap.size);
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning violation count failed.`);
            return 0;
        }
    }

    /**
     * Returns id of a suspect.
     * @returns {string}
     */
    get id() {
        try {
            return String(this.suspectId);
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning suspect's id failed.`);
            return '';
        }
    }

    /**
     * Returns all the stored events of a suspect.
     * @returns {Map}
     */
    get events() {
        try {
            return this.eventMap;
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning suspect's event map failed.`);
            return Immutable.Map({});
        }
    }

    /**
     * Returns a map of event highlights.
     * By event highlights we mean events worth of noticing because of their high certainty, severity or both.
     * @returns {Map}
     */
    get eventHighlights() {
        try {
            return this.eventHighlightsMap;
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning suspect's highlights map failed.`);
            return Immutable.Map({});
        }
    }

    constructor(id) {
        this.suspectId = String(id);
        this.eventMap = Immutable.OrderedMap({});
        this.eventHighlightsMap = Immutable.OrderedMap({});
    }
};