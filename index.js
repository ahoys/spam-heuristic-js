module.exports = {
    /**
     * Returns a percentage of how likely the given input is spam.
     * @param target
     */
    getSpamProbability: (target) => {
        try {
            // If the target is not in its correct form, return undefined.
            if (target.constructor !== Array && typeof target !== 'string') return undefined;
            // We'll handle the target as an array.
            const targetArr = target.constructor !== Array ? [target] : target;
            // Probability of a detected spam 0: none, 100: fully certain.
            // Severity of s spam 0: low, 10: high.
            let probability = 0, severity = 0;

            // TODO: the actual code.

            // Return the probability and severity.
            return {probability, severity};
        } catch (e) {
            console.log(e.stack);
            console.log(process.version);
            console.log('Error: Failed to process the given input.');
            return undefined;
        }
    }
};