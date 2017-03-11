const Event = require('./class.Event');
const Emphasis = require('./emphasis/event.json');
module.exports = class EventMessage extends Event {

    /**
     * Returns the message associated with the instance.
     * @returns {string}
     */
    get message() {
        return String(this.msgValue);
    }

    constructor(msgValue) {
        super(msgValue);
        this.msgValue = String(msgValue);
        const msgWords = this.msgValue.split(" ");
        const msgWordsCount = msgWords.length;

        // Run heuristics for the value.
        const heuristicPercentages = [];
        if (msgWordsCount > 2) {
            heuristicPercentages.push(Event.getPercentageOfShortWords(
                msgWords, Emphasis.EventMessage.short_word_limit));
        }
        heuristicPercentages.push(Event.getPercentageOfLongWords(
            msgWords, Emphasis.EventMessage.long_word_limit));
        heuristicPercentages.push(Event.getPercentageOfRepetitiveChars(
            this.msgValue));
        if (msgWordsCount > 4) {
            heuristicPercentages.push(Event.getPercentageOfRepetitiveStrings(
                msgWords));
        }

        // Analyse the results.
        let sum = 0;
        let max = 0;
        let testCount = heuristicPercentages.length;
        let violations = 0;
        heuristicPercentages.forEach((percentage) => {
            if (percentage > max) {
                max = percentage;
            }
            if (percentage > 33) {
                violations++;
            }
            sum += percentage;
        });
        const multiplier = sum / testCount / 100 + 1;

        // Final results.
        const resultCertainty = max * multiplier;
        const resultSeverity = violations / testCount * 10 ;

        // Save the results.
        super.certainty = resultCertainty > 100 ? 100 : resultCertainty;
        super.severity = resultSeverity > 10 ? 10 : resultSeverity;
    }
};