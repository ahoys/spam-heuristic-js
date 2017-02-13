const Suspect = require('./inc.class.Suspect');
const Event = require('./inc.class.Event');
const Immutable = require('immutable');
const defaultSettings = require('../configs/defaultSettings.json');

module.exports = class Group {

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
     * Returns analysis of a group.
     * @returns {{certainty: number, severity: number}|*}
     */
    getGroupAnalysis() {
        try {
            // TODO: heuristics.
            return this.defaultReturn;
        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Returning a group analysis failed.`);
            return this.defaultReturn;
        }
    }

    /**
     * Registers an event in a group.
     * @param suspectObj
     * @param eventObj
     */
    setGroupEvent(suspectObj, eventObj) {
        try {
            if (
                suspectObj instanceof Suspect &&
                eventObj instanceof Event
            ) {
                if (eventObj.isNoteworthy()) {
                    this.eventsHighlightMap = this.eventsHighlightMap.set(this.getMapId('eventsHighlightMap'), {
                        suspect: suspectObj,
                        event: eventObj
                    });
                }
                this.eventsMap = this.eventsMap.set(this.getMapId('eventsMap'), {
                    suspect: suspectObj,
                    event: eventObj
                });
                if (!this.suspectsMap.has(suspectObj.id)) {
                    if (this.suspectsMap.size >= 9999) {
                        // Fail safe.
                        this.suspectsMap = Immutable.OrderedMap({});
                    }
                    this.suspectsMap = this.suspectsMap.set(suspectObj.id, suspectObj);
                }
            }
        } catch (e) {
            console.log(e.stack);
            console.log(`${new Date()}: Setting an event for a group failed.`);
        }
    }

    /**
     * Returns a map of suspects in a group.
     * @returns {Map}
     */
    get suspects() {
        return this.suspectsMap;
    }

    /**
     * Returns id of a group.
     * @returns {*}
     */
    get id() {
        return this.groupId;
    }

    constructor(groupId) {
        this.groupId = groupId;
        this.eventsMap = Immutable.OrderedMap({});
        this.eventsHighlightMap = Immutable.OrderedMap({});
        this.suspectsMap = Immutable.Map({});
        this.defaultReturn = {
            certainty: 0,
            severity: 0
        };
        this.bufferIndexEvents = 0;
        this.bufferIndexHighlights = 0;
    }
};