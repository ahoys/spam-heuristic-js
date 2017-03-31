const Ensemble = require('../index');
const Event = require('./class.Event');
const Emphasis = require('./emphasis/event.json');
module.exports = class EventMessage extends Event {

    /**
     * Returns the heuristics' results.
     * @param msgWords
     * @returns {object}
     */
    getHeuristicAnalysis(msgWords) {
        try {
            return {
                getPercentageOfShortWords: this.getAnalysisForShortWords(
                    Event.getPercentageOfShortWords(msgWords)
                ),
                getPercentageOfLongWords: this.getAnalysisForLongWords(
                    Event.getPercentageOfLongWords(msgWords)
                ),
                getPercentageOfRepetitiveChars: this.getAnalysisForRepetitiveChars(
                    Event.getPercentageOfRepetitiveChars(this.message)
                ),
                getPercentageOfRepetitiveStrings: this.getAnalysisForRepetitiveStrings(
                    Event.getPercentageOfRepetitiveStrings(msgWords)
                ),
            }
        } catch (e) {
            console.log(`Error [EventMessage][getHeuristicPercentages]: ${e.message}`);
            return {};
        }
    }

    /**
     * Analyse short words percentage.
     *
     * Certainty
     * Compares the percentage to the word count. Longer the sentence is,
     * the more certain it is that the percentage is correct.
     *
     * Severity
     * Compare the percentage to the word count. Longer the sentence is,
     * the more severe it is to have a high percentage.
     *
     * @param percentage
     * @returns {*}
     */
    getAnalysisForShortWords(percentage) {
        try {
            const wordsCount = this.message.length;
            return {
                certainty: Ensemble.getFromRange(wordsCount * (percentage / 10), 0, 100),
                severity: Ensemble.getFromRange(wordsCount * (percentage / 100), 0, 10),
            };
        } catch (e) {
            console.log(`Error [EventMessage][getAnalysisForShortWords]: ${e.message}`);
            return {
                certainty: 0,
                severity: 0,
            };
        }
    }

    getAnalysisForLongWords(percentage) {
        try {
            return {};
        } catch (e) {
            console.log(`Error [EventMessage][getAnalysisForLongWords]: ${e.message}`);
            return {
                certainty: 0,
                severity: 0,
            };
        }
    }

    getAnalysisForRepetitiveChars(percentage) {
        try {
            return {};
        } catch (e) {
            console.log(`Error [EventMessage][getAnalysisForRepetitiveChars]: ${e.message}`);
            return {
                certainty: 0,
                severity: 0,
            };
        }
    }

    getAnalysisForRepetitiveStrings(percentage) {
        try {
            return {};
        } catch (e) {
            console.log(`Error [EventMessage][getAnalysisForRepetitiveStrings]: ${e.message}`);
            return {
                certainty: 0,
                severity: 0,
            };
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
        const heuristicAnalysis = this.getHeuristicAnalysis(msgWords);

        // Set certainty and severity.
        let certainty = 0;
        let severity = 0;
        heuristicAnalysis.forEach((result) => {
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
        super.certainty = certainty > 100 ? 100 : certainty;
        super.severity = severity > 10 ? 10 : severity;
    }
};