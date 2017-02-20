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
        let violationsTotal = 3;
        let violations = 0;
        // Run heuristics for the value.
        const heuristicPercentages = [];
        heuristicPercentages.push(super.getPercentageOfShortWords(
            this.msgWords, Emphasis.EventMessage.short_word_limit));
        if (heuristicPercentages[0] > 10) violations++;
        heuristicPercentages.push(super.getPercentageOfLongWords(
            this.msgWords, Emphasis.EventMessage.long_word_limit));
        if (heuristicPercentages[1] > 10) violations++;
        heuristicPercentages.push(super.getRepetitiveCharsPercentage(
            this.msgValue));
        if (heuristicPercentages[2] > 10) violations++;
        // Analyse the results.
        let heuristicSum = 0;
        heuristicPercentages.forEach((result) => {
            heuristicSum = heuristicSum + result;
        });
        super.certainty = (violations / violationsTotal) * 100;
        super.severity = (heuristicSum / heuristicPercentages.length) / 10;
    }
};