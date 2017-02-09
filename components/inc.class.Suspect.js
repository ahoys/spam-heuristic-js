const Immutable = require('immutable');

module.exports = class Suspect {

    get id() {
        return this.suspectId;
    }

    constructor(sId) {
        this.suspectId = sId;
        this.history = Immutable.OrderedMap({})
    }
};