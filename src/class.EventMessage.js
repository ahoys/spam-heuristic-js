const Event = require('./class.Event');
const Emphasis = require('./emphasis/event.json');
module.exports = class EventMessage extends Event {

    /**
     * Returns the heuristics' results.
     * @param msgWords
     * @returns {Array}
     */
    getHeuristicPercentages(msgWords) {
        try {
            const heuristicPercentages = [];
            const msgWordsCount = msgWords.length;
            heuristicPercentages.push(Event.getPercentageOfShortWords(msgWords));
            heuristicPercentages.push(Event.getPercentageOfLongWords(msgWords));
            heuristicPercentages.push(Event.getPercentageOfRepetitiveChars(
                this.msgValue));
            if (msgWordsCount > 4) {
                heuristicPercentages.push(Event.getPercentageOfRepetitiveStrings(
                    msgWords));
            }
            return heuristicPercentages;
        } catch (e) {
            console.log(`Error [EventMessage][getHeuristicPercentages]: ${e.message}`);
            return [];
        }
    }

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

        // Run heuristics for the value.
        const heuristicPercentages = this.getHeuristicPercentages(msgWords);

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