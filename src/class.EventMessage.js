const Event = require('./class.Event');
module.exports = class EventMessage extends Event {

    /**
     * Returns analysis for an event.
     * @returns {{certainty: number, severity: number, created: number, isNoteworthy: boolean}}
     */
    getAnalysis() {
        return {
            certainty: super.certainty,
            severity: super.severity,
            created: super.created,
            isNoteworthy: super.isNoteworthy()
        };
    }

    /**
     * Returns the message associated with the instance.
     * @returns {string}
     */
    get msg() {
        return String(this.msgValue);
    }

    constructor(msgValue) {
        super();
        this.msgValue = String(msgValue);
    }
};