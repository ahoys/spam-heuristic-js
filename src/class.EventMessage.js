const Event = require('./class.Event');
const Emphasis = require('./emphasis/event.json');
module.exports = class EventMessage extends Event {

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
        this.msgWords = this.msgValue.split(" ");

        // Run heuristics for the value.
        const heuristicPercentages = [];
        heuristicPercentages.push(super.getPercentageOfShortWords(
            this.msgWords, Emphasis.EventMessage.short_word_limit));
        heuristicPercentages.push(super.getPercentageOfLongWords(
            this.msgWords, Emphasis.EventMessage.long_word_limit));
        heuristicPercentages.push(super.getRepetitiveCharsPercentage(
            this.msgValue));

        // Analyse the results.
        let violations = 0;
        let heuristicSum = 0;
        heuristicPercentages.forEach((percentage) => {
            if (percentage > 10) violations++;
            heuristicSum = heuristicSum + percentage;
        });

        // Save the results.
        super.certainty = (violations / heuristicPercentages.length) * 100;
        super.severity = (heuristicSum / heuristicPercentages.length) / 10;
    }
};