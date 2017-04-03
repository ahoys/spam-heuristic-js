const Ensemble = require('../index');
const Heuristics = require('./emphasis/heuristics.json');
const immutable = require('immutable');
module.exports = class Event {

    /**
     * Analyse word length percentages.
     *
     * Certainty
     * Bigger the base value is, the more certain we can be about the result.
     *
     * Severity
     * Bigger the base value is, the more severe it is to have a high percentage.
     *
     * @param percentage
     * @param baseValue
     * @param cMultiplier
     * @param sMultiplier
     * @returns {*}
     */
    static getLinearAnalysis(percentage, baseValue, cMultiplier = 1, sMultiplier = 1) {
        try {
            return {
                certainty: (baseValue * (percentage / 10)) * cMultiplier,
                severity: (baseValue * (percentage / 100)) * sMultiplier,
            };
        } catch (e) {
            console.log(`Error [EventMessage][getAnalysisForStringLength]: ${e.message}`);
            return {
                certainty: 0,
                severity: 0,
            };
        }
    }

    /**
     * Returns a directly propotional value that is as big or smaller than
     * the focus of interest, a.
     * @param {number} a : Base value & maximum result.
     * @param {number} b : Reflector. Result will be reflection of this value. 
     * @param {number} max : Limitter. If b >= max, the result will be a.
     * @returns {number}
     */
    static getDirectlyProportionalAnalysis(a = 0, b = 100, max = 10) {
        try {
            const result = (a * b) / (max || 1);
            return result > max ? max : result;
        } catch (e) {
            console.log(`Error [Event][getReflectedValue]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns a percentage of short words in a string.
     * @param words
     * @param isRelevantCheck
     * @param useMultiplier
     * @returns {number}
     */
    static getPercentageOfShortWords(words, isRelevantCheck = true, useMultiplier = true) {
        try {
            // Words to be processed must exist or otherwise the result is
            // obviously zero.
            if (!words || words.constructor !== Array) return 0;
            // Return zero if the sentence is too short.
            const wordsCount = words.length;
            const emphasis = Heuristics.getPercentageOfShortWords;
            if (
                isRelevantCheck &&
                wordsCount <= emphasis.min_words_before_relevant
            ) return 0;
            // The count of short words of all words.
            let shortWords = 0;
            words.forEach((word) => {
                if (word.length <= emphasis.min_word_length) {
                    shortWords += useMultiplier
                        ? 1 + (emphasis.min_word_length - word.length) * emphasis.multiplier
                        : 1;
                }
            });
            const result = shortWords / (wordsCount || 1) * 100;
            return result <= 100 ? result : 100;
        } catch (e) {
            console.log(`Error [Event][getPercentageOfShortWords]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns a percentage of long words in a string.
     * @param words
     * @param isRelevantCheck - Check whether the sentence is long enough for a check.
     * @param useMultiplier - Increase the result based on how much the results exceed the limits.
     * @returns {number}
     */
    static getPercentageOfLongWords(words, isRelevantCheck = true, useMultiplier = true) {
        try {
            // Words to be processed must exist or otherwise the result is
            // obviously zero.
            if (!words || words.constructor !== Array) return 0;
            // Return zero if the sentence is too short.
            const wordsCount = words.length;
            const emphasis = Heuristics.getPercentageOfLongWords;
            if (
                isRelevantCheck &&
                wordsCount <= emphasis.min_words_before_relevant
            ) return 0;
            // The count of long words of all words.
            let longWords = 0;
            const urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            const regex = new RegExp(urlRegex);
            words.forEach((word) => {
                if (word.length >= emphasis.min_word_length) {
                    // We are not going to count urls.
                    if (!regex.test(word)) {
                        longWords += useMultiplier
                            ? 1 + (word.length - emphasis.min_word_length) * emphasis.multiplier
                            : 1;
                    }
                }
            });
            const result = longWords / (wordsCount || 1) * 100;
            return result <= 100 ? result : 100;
        } catch (e) {
            console.log(`Error [Event][getPercentageOfLongWords]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns a percentage of repetitive chars in a string.
     * @param str
     * @returns {number}
     */
    static getPercentageOfRepetitiveChars(str) {
        try {
            // Validate arguments.
            if (typeof str !== 'string') return 0;
            // Calculate percentage.
            let violations = 0;
            let prevChar = '';
            let prevCharCount = 0;
            for (let i = 0; i < str.length; i++) {
                const char = String(str[i]);
                if (char === prevChar) {
                    prevCharCount++;
                    if (prevCharCount > 2) {
                        violations++;
                    }
                } else {
                    prevChar = String(char);
                }
            }
            return Math.round((violations / str.length) * 100);
        } catch (e) {
            console.log(`Error [Event][getRepetitiveCharsPercentage]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns a percentage of repetitive structure in an array of strings.
     *
     * The functionality is simple: we'll measure distances between distinct words
     * and use that information to determine whether there are patterns.
     *
     * @param strings
     * @returns {number}
     */
    static getPercentageOfRepetitiveStructure(strings) {
        try {
            if (!strings || strings.constructor !== Array) return 0;
            const totalCount = strings.length;
            if (totalCount < 1) return 0;
            const strTable = {};
            // First we'll measure distances between the same words.
            strings.forEach((str, i) => {
                if (strTable[str] === undefined) {
                    // Initialization of a word.
                    // The word can't have a distance as it is the only one.
                    strTable[str] = {
                        indexes: [i],
                        distanceToPrevious: [],
                        sameDistanceAsPreviousCount: 0,
                    };
                } else {
                    // Index of the previous word for a measurement.
                    const prevIndex = strTable[str]
                        .indexes[strTable[str].indexes.length - 1];
                    // The distance of the previous word and its' parent.
                    const prevDistance = strTable[str]
                        .distanceToPrevious[strTable[str]
                        .distanceToPrevious.length - 1];
                    // If the current distance is the same as the previous distance,
                    // we have a pattern.
                    const distance = i - prevIndex;
                    strTable[str].distanceToPrevious.push(distance);
                    if (distance === prevDistance) {
                        // Save how many occurrences there were so that
                        // we can calculate a percentage that tells us how big part
                        // of this word's usage was just repetition.
                        strTable[str].sameDistanceAsPreviousCount++;
                    }
                    strTable[str].indexes.push(i);
                }
            });
            // Next we'll combine the results to find out the sentence level picture of the
            // patterns.
            let sum = 0;
            let count = 0;
            Object.keys(strTable).forEach((key) => {
                const thisStr = strTable[key];
                const distanceCount = thisStr.distanceToPrevious.length - 1;
                sum += thisStr.sameDistanceAsPreviousCount / (distanceCount || 1);
                count++;
            });
            return Math.round(sum / (count || 1) * 100);
        } catch (e) {
            console.log(`Error [Event][getPercentageOfRepetitiveStructure]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns whether an event is noteworthy.
     * @returns {boolean}
     */
    isNoteworthy() {
        try {
            return (
                this.certaintyValue >= defaultSettings.EVENT.HIGHLIGHT_CERTAINTY_THRESHOLD ||
                this.severityValue >= defaultSettings.EVENT.HIGHLIGHT_SEVERITY_THRESHOLD
            );
        } catch (e) {
            console.log(`Error [Event][isNoteworthy]: ${e.message}`);
            return false;
        }
    };

    /**
     * Sets certainty for an event.
     * Certainty tells how probable it is that the heuristics have detected a real threat.
     * 0: No threats, 100: fully certain of a threat.
     * @param value {number}
     */
    set certainty(value) {
        try {
            this.certaintyValue = Math.round(Ensemble.getFromRange(value, 0, 100));
        } catch (e) {
            console.log(`Error [Event][set certainty]: ${e.message}`);
        }
    };

    /**
     * Sets severity for an event.
     * Severity tells how serious the violations are.
     * 0: Not serious at all, 10: very serious.
     * @param value {number}
     */
    set severity(value) {
        try {
            this.severityValue = Math.round(Ensemble.getFromRange(value, 0, 10));
        } catch (e) {
            console.log(`Error [Event][set severity]: ${e.message}`);
        }
    };

    /**
     * Sets a new created timestamp.
     * Mainly for testing purposes.
     * @param value {number}
     */
    set created(value) {
        try {
            if (typeof value === 'number') {
                this.createdValue = value;
            }
        } catch (e) {
            console.log(`Error [Event][set created]: ${e.message}`);
        }
    }

    /**
     * Returns certainty of an event.
     * @returns {number}
     */
    get certainty() {
        return this.certaintyValue;
    }

    /**
     * Returns severity of an event.
     * @returns {number}
     */
    get severity() {
        return this.severityValue;
    }

    /**
     * Returns when an event was created.
     * @returns {number}
     */
    get created() {
        return this.createdValue;
    }

    /**
     * Returns the value of an event.
     * @returns {*}
     */
    get value() {
        return this.eventValue;
    }

    constructor(eventValue) {
        this.eventValue = eventValue;
        this.createdValue = Number(new Date().getTime());
        this.certaintyValue = 0;
        this.severityValue = 0;
    }
};