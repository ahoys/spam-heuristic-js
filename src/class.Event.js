module.exports = class Event {

    /**
     * Returns a percentage of short words in a string.
     * @param words
     * @param wordCount
     * @param minWordLength
     * @returns {number}
     */
    static getPercentageOfShortWords(words, wordCount, minWordLength) {
        try {
            // Validate arguments.
            if (
                words.constructor !== Array ||
                typeof wordCount !== 'number' ||
                typeof minWordLength !== 'number'
            ) return 0;
            // Calculate percentage.
            let count = 0;
            count = count + words.forEach((word) => {return word.length < minWordLength ? 1 : 0});
            return (count / wordCount) * 100;
        } catch (e) {
            console.log(`Error [Event][getPercentageOfShortWords]: ${e.message}`);
        }
    }

    /**
     * Returns a percentage of long words in a string.
     * @param words
     * @param wordCount
     * @param maxWordLength
     * @returns {number}
     */
    static getPercentageOfLongWords(words, wordCount, maxWordLength) {
        try {
            // Validate arguments.
            if (
                words.constructor !== Array ||
                typeof wordCount !== 'number' ||
                typeof maxWordLength !== 'number'
            ) return 0;
            // Calculate percentage.
            let count = 0;
            count = count + words.forEach((word) => {return word.length > maxWordLength ? 1 : 0});
            return (count / wordCount) * 100;
        } catch (e) {
            console.log(`Error [Event][getPercentageOfLongWords]: ${e.message}`);
        }
    }

    /**
     * Returns a percentage of repetitive chars in a string.
     * @param str
     * @param length
     * @returns {number}
     */
    static getRepetitiveCharsPercentage(str, length) {
        try {
            // Validate arguments.
            if (
                typeof str !== 'string' ||
                typeof length !== 'number'
            ) return 0;
            // Calculate percentage.
            let violations = 0;
            let prevChar = '';
            let prevCharCount = 0;
            for (let i = 0; i < length; i++) {
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
            return (violations / length) * 100;
        } catch (e) {
            console.log(`Error [Event][getRepetitiveCharsPercentage]: ${e.message}`);
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
     * @param cValue
     */
    set certainty(cValue) {
        try {
            this.certaintyValue = Number(cValue);
        } catch (e) {
            console.log(`Error [Event][set certainty]: ${e.message}`);
        }
    };

    /**
     * Sets severity for an event.
     * Severity tells how serious the violations are.
     * 0: Not serious at all, 10: very serious.
     * @param sValue
     */
    set severity(sValue) {
        try {
            this.severityValue = Number(sValue);
        } catch (e) {
            console.log(`Error [Event][set severity]: ${e.message}`);
        }
    };

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

    constructor() {
        this.createdValue = Number(new Date().getTime());
        this.certaintyValue = 0;
        this.severityValue = 0;
    }
};