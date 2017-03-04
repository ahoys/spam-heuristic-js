const Ensemble = require('../index');
const Immutable = require('immutable');
module.exports = class Suspect {

    setViolation(eventObj) {
        try {
            // Validate arguments.
            if (typeof eventObj !== 'object') return;
            // Save violation to a map.
            this._violations = this._violations.set(
                Ensemble.getMapId(this._violationsId, 8),
                eventObj
            );
        } catch (e) {
            console.log(`Error [Suspect][setViolation]: ${e.message}`);
        }
    }

    get id() {
        return this._id;
    }

    get violations() {
        return this._violations;
    }

    constructor(_id) {
        this._id = _id;
        this._violations = Immutable.OrderedMap({}); // All violating events in a chronological order.
        this._violationsId = -1;
    }
};