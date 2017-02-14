const HeuristicEngine = require('../index');
const Suspect = require('./inc.class.Suspect');
const Event = require('./inc.class.Event');
const Immutable = require('immutable');
const defaultSettings = require('../configs/defaultSettings.json');

module.exports = class Group {

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
                    this.eventsHighlightMap = this.eventsHighlightMap.set(
                        HeuristicEngine.getMapId(
                            this.bufferIndexHighlights,
                            defaultSettings.BUFFER.MAX_EVENT_HIGHLIGHT_MAP_SIZE),
                        {suspect: suspectObj, event: eventObj});
                }
                this.eventsMap = this.eventsMap.set(HeuristicEngine.getMapId(
                    this.bufferIndexEvents,
                    defaultSettings.BUFFER.MAX_EVENT_MAP_SIZE),
                    {suspect: suspectObj, event: eventObj});
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

    constructor(groupId, emphasisJSON) {
        this.groupId = groupId;
        this.eventsMap = Immutable.OrderedMap({});
        this.eventsHighlightMap = Immutable.OrderedMap({});
        this.suspectsMap = Immutable.Map({});
        this.defaultReturn = {
            certainty: 0,
            severity: 0
        };
        this.bufferIndexEvents = -1;
        this.bufferIndexHighlights = -1;
    }
};