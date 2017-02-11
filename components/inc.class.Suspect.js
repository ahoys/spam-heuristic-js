const Event = require('./inc.class.Event');
const Immutable = require('immutable');
const defaultSettings = require('../configs/defaultSettings.json');

module.exports = class Suspect {

    /**
     * Makes sure eventMap or eventHistoryMap won't get too large.
     * @returns {number}
     */
    static cleanEvents() {
        return 0;
    };

    /**
     * Sets a new event.
     * All events are investigated and validated based on different heuristics.
     * @param target
     */
    setEvent(target) {
        try {
            if (typeof target === 'string') {
                const eId = `${this.suspectId}-${new Date()}`;
                const eventObj = new Event(eId, target);
                if (
                    eventObj.certainty >= defaultSettings.EVENT.HIGHLIGHT_CERTAINTY_THRESHOLD ||
                    eventObj.severity >= defaultSettings.EVENT.HIGHLIGHT_SEVERITY_THRESHOLD
                ) {
                    this.setEventHighlight(eId, eventObj);
                }
                this.eventMap = this.eventMap.set(eId, eventObj);
                return eId;
            } else {
                console.log(`[${new Date()}][Type Error] spam-heuristic: Setting an event failed.`);
                return undefined;
            }
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Setting an event failed.`);
            return undefined;
        }
    }

    static setEventHighlight(eId, event) {
        try {
            if (!this.eventHighlightsMap.has(eId)) {
                this.eventHighlightsMap = this.eventHighlightsMap.set(eId, event);
            } else {
                console.log(`[${new Date()}][Internal Error] spam-heuristic: An event highlight already exists.`);
                return undefined;
            }
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Setting an event highlight failed.`);
            return undefined;
        }
    }

    /**
     * Returns certainty that this subject is a real threat.
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
     * Returns severity of this subject's violations.
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

    get violations() {
        try {
            return Number(this.eventHighlightsMap.size);
        } catch (e) {
            console.log(`[${new Date()}][Internal Error] spam-heuristic: Returning violation count failed.`);
            return 0;
        }
    }

    get id() {
        return this.suspectId;
    }

    /**
     * Returns all the stored events of a suspect.
     * @returns {*}
     */
    get events() {
        return this.eventMap;
    }

    /**
     * Returns an ordered Map of event highlights.
     * By event highlights we mean events worth of noticing because of their high certainty, severity or both.
     * @returns {*}
     */
    get eventHighlights() {
        return this.eventHighlightsMap;
    }

    constructor(id) {
        this.suspectId = String(id);
        this.eventMap = Immutable.OrderedMap({});
        this.eventHighlightsMap = Immutable.OrderedMap({});
    }
};