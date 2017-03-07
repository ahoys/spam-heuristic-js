const immutable = require('immutable');
module.exports = class Event {

    /**
     * Returns a percentage of short words in a string.
     * @param words
     * @param minWordLength
     * @returns {number}
     */
    static getPercentageOfShortWords(words, minWordLength) {
        try {
            // Validate arguments.
            if (words.constructor !== Array || typeof minWordLength !== 'number') return 0;
            // Calculate percentage.
            const wordCount = words.length;
            let count = 0;
            words.forEach((word) => {
                if (typeof word === 'string' && word.length < minWordLength) {
                    count++;
                }
            });
            return Math.round((count / wordCount) * 100);
        } catch (e) {
            console.log(`Error [Event][getPercentageOfShortWords]: ${e.message}`);
            return 0;
        }
    }

    /**
     * Returns a percentage of long words in a string.
     * @param words
     * @param maxWordLength
     * @returns {number}
     */
    static getPercentageOfLongWords(words, maxWordLength) {
        try {
            // Validate arguments.
            if (words.constructor !== Array || typeof maxWordLength !== 'number') return 0;
            // Calculate percentage.
            let count = 0;
            words.forEach((word) => {
                if (typeof word === 'string' && word.length > maxWordLength) {
                    count++;
                }
            });
            return Math.round((count / words.length) * 100);
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
     * Returns a percentage of repetitive strings in an array.
     * @param strings
     * @returns {number}
     */
    static getPercentageOfRepetitiveStrings(strings) {
        try {
            if (strings.constructor !== Array) return 0;
            let totalStrCount = strings.length;
            let totalRepeatCountPercentage = 0;
            const stringCounts = {};
            // Count words.
            strings.forEach((str) => {
                stringCounts[str] = (stringCounts[str] || 0) + 1;
            });
            Object.keys(stringCounts).forEach((key) => {
                if (stringCounts[key] > 1) {
                    totalRepeatCountPercentage += stringCounts[key] / totalStrCount * 100;
                }
            });
            return Math.round(totalRepeatCountPercentage);
        } catch (e) {
            console.log(`Error [Event][getRepetitiveStrings]: ${e.message}`);
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
     * @param value
     */
    set certainty(value) {
        try {
            if (value > 100) this.certaintyValue = 100;
            if (value < 0) this.certaintyValue = 0;
            this.certaintyValue = Math.round(Number(value));
        } catch (e) {
            console.log(`Error [Event][set certainty]: ${e.message}`);
        }
    };

    /**
     * Sets severity for an event.
     * Severity tells how serious the violations are.
     * 0: Not serious at all, 10: very serious.
     * @param value
     */
    set severity(value) {
        try {
            if (value > 10) this.severityValue = 10;
            if (value < 0) this.severityValue = 0;
            this.severityValue = Math.round(Number(value));
        } catch (e) {
            console.log(`Error [Event][set severity]: ${e.message}`);
        }
    };

    /**
     * Sets a new created timestamp.
     * Mainly for testing purposes.
     * @param value
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