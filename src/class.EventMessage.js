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
            const certainties = [];
            this.tools.forEach((tool) => {
                const { func, preferredStringFormat } = tool;
                const percentage = func(
                    preferredStringFormat === 'Array' ? this.parts : this.message
                );
                const size = preferredStringFormat === 'Array' ? this.count : this.length;
                console.log(tool.key, percentage, preferredStringFormat === 'Array' ? this.parts : this.message);
                certainties.push(
                  Event.getDirectlyProportionalAnalysis(
                    percentage,
                    size,
                    percentage
                  ) * 100
                );
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

    /**
    * Returns and array of string tools available.
    * @returns {Array}
    */
    get tools() {
        return this.strTools;
    }

    constructor(msgValue) {
        super(msgValue);
        this.msgValue = String(msgValue);
        this.msgLength = String(msgValue).length;
        this.msgParts = String(msgValue).split(' ');
        this.msgPartsLength = this.msgParts.length;
        this.strTools = StringAnalysis.getAll()
          .filter(x => ['Array', 'string'].indexOf(x.preferredStringFormat) !== -1);

        // Run heuristics for the value.
        const heuristicAnalysis = this.getHeuristicAnalysis();

        // Save the results.
        super.certainty = heuristicAnalysis.certainty;
        super.severity = heuristicAnalysis.severity;
    }
};