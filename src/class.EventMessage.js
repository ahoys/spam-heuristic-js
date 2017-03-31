const Event = require('./class.Event');
const Emphasis = require('./emphasis/event.json');
module.exports = class EventMessage extends Event {

    /**
     * Returns the heuristics' results.
     * @returns {object}
     */
    getHeuristicAnalysis() {
        try {
            return {
                getPercentageOfShortWords: Event.getLinearAnalysis(
                    Event.getPercentageOfShortWords(this.parts),
                    this.count
                ),
                getPercentageOfLongWords: Event.getLinearAnalysis(
                    Event.getPercentageOfLongWords(this.parts),
                    this.count
                ),
                getPercentageOfRepetitiveChars: Event.getLinearAnalysis(
                    Event.getPercentageOfRepetitiveChars(this.message),
                    this.length
                ),
                getPercentageOfRepetitiveStrings: Event.getLinearAnalysis(
                    Event.getPercentageOfRepetitiveStrings(this.parts),
                    this.count
                ),
            }
        } catch (e) {
            console.log(`Error [EventMessage][getHeuristicPercentages]: ${e.message}`);
            return {};
        }
    }

    /**
     * Returns the message associated with the instance.
     * @returns {string}
     */
    get message() {
        return String(this.msgValue);
    }

    /**
     * Returns length of the message.
     * @returns {number}
     */
    get length() {
        return Number(this.msgLength);
    }

    /**
     * Returns parts of the message eg. words.
     * @returns {number}
     */
    get parts() {
        return this.msgParts;
    }

    /**
     * Returns count of the message parts eg. words.
     * @returns {Number|*}
     */
    get count() {
        return this.msgPartsLength;
    }

    constructor(msgValue) {
        super(msgValue);
        this.msgValue = String(msgValue);
        this.msgLength = String(msgValue).length;
        this.msgParts = String(msgValue).split(' ');
        this.msgPartsLength = this.msgParts.length;

        // Run heuristics for the value.
        const heuristicAnalysis = this.getHeuristicAnalysis();
        console.log(msgValue);
        console.log(heuristicAnalysis);

        // Set certainty and severity.
        let certainty = 0;
        let severity = 0;
        Object.keys(heuristicAnalysis).forEach((key) => {
            const result = heuristicAnalysis[key];
            // Pick the highest certainty to act as an overall certainty.
            if (result.certainty > certainty) {
                certainty = result.certainty;
            }
            // Pick the highest severity to act as an overall severity.
            if (result.severity > severity) {
                severity = result.severity;
            }
        });

        // Save the results.
        super.certainty = certainty;
        super.severity = severity;
    }
};