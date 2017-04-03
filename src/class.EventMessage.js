const Event = require('./class.Event');
const Emphasis = require('./emphasis/event.json');
const StringAnalysis = require('string-analysis-js');
module.exports = class EventMessage extends Event {

    /**
     * Returns the heuristics' results.
     * @returns {object}
     */
    getHeuristicAnalysis() {
        try {
            // Use available tools to measure the string.
            const heuristics = {
                getPercentageOfShortWords: [
                    StringAnalysis.getPercentageOfShortWords,
                    'parts'],
                getPercentageOfLongWords: [
                    StringAnalysis.getPercentageOfLongStrings,
                    'parts'],
                getPercentageOfRepetitiveChars: [
                    StringAnalysis.getPercentageOfRepetitiveChars,
                    'message'],
                getPercentageOfRepetitiveStructure: [
                    StringAnalysis.getPercentageOfRepetitiveStructure,
                    'parts'],
            }
            // Analyse the results reflecting on the size of the source material.
            const certainties = [];
            Object.keys(heuristics).forEach((key, i) => {
                const thisHeuristic = heuristics[key];
                if (thisHeuristic[1] === 'parts') {
                    const value = thisHeuristic[0](this.parts);
                    certainties[i] = Event.getDirectlyProportionalAnalysis(
                        value,
                        this.count / 100,
                        value
                    ) * 100;
                } else if (thisHeuristic[1] === 'message') {
                    const value = thisHeuristic[0](this.message);
                    certainties[i] = Event.getDirectlyProportionalAnalysis(
                        value,
                        this.length / 100,
                        value
                    ) * 100;
                }
            });
            return {
                certainty: Math.max(...certainties),
                severity: 0,
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

        // Save the results.
        super.certainty = heuristicAnalysis.certainty;
        super.severity = heuristicAnalysis.severity;
    }
};