const Event = require('./class.Event');
const Emphasis = require('./emphasis/event.json');
module.exports = class EventMessage extends Event {

    heuristicMsgVeryShort() {
        try {
            // Make sure this heuristic is relevant to run.
            if (this.msgLength > Emphasis.EventMessage.heuristicMsgVeryShort.length_required_for_relevance)
                return 0;
            // Return severity based on the length of the message.
            return 10 - (10 / this.msgLength);
        } catch (e) {
            console.log(`Error [EventMessage][heuristicMsgVeryShort]: ${e.message}`);
        }
    }

    heuristicMsgHasShortWords() {
        try {
            // Make sure this heuristic is relevant to run.
            if (
                this.msgWordsCount <
                Emphasis.EventMessage.heuristicMsgHasShortWords.words_required_for_relevance
            ) return 0;
            // Count of the short words.
            let count = 0;
            this.msgWordLengths.forEach((length) => {
                if (length <= Emphasis.EventMessage.heuristicMsgHasShortWords.short_word_upper_limit) {
                    count++;
                }
            });
            // Return a percentage of the short words in a message turned into a severity.
            return (count / this.msgWords) * 10;
        } catch (e) {
            console.log(`Error [EventMessage][heuristicMsgHasShortWords]: ${e.message}`);
        }
    }

    heuristicMsgHasLongWords() {
        return 0;
    }

    heuristicMsgHasUrls() {
        return 0;
    }

    heuristicMsgHasCode() {
        return 0;
    }

    heuristicMsgHasSpecialLetters() {
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
        this.msgWordLengths = this.msgWords.map((word) => {
            return word.length;
        });
    }
};