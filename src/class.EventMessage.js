const Event = require('./class.Event');
const Emphasis = require('./emphasis/event.json');
module.exports = class EventMessage extends Event {

    static heuristicMsgVeryShort() {
        try {
            return {
                heuristicIsThreat: this.msgLength < Emphasis.EventMessage.heuristicMsgVeryShort.str_length_limit,
                heuristicSeverity: 10 - (10 / this.msgLength)
            }
        } catch (e) {
            console.log(`Error [EventMessage][heuristicLength]: ${e.message}`);
        }
    }

    static heuristicMsgHasShortWords() {
        return 0;
    }

    static heuristicMsgHasLongWords() {
        return 0;
    }

    static heuristicMsgHasUrls() {
        return 0;
    }

    static heuristicMsgHasCode() {
        return 0;
    }

    static heuristicMsgHasSpecialLetters() {
        return 0;
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
        this.msgLength = this.msgValue.length;
        this.msgWords = this.msgValue.split(" ");
        this.msgWordsCount = this.msgWords.length;
    }
};