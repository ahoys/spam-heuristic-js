const Immutable = require('immutable');

module.exports = class Suspect {

    constructor() {
        this.history = Immutable.OrderedMap({})
    }
};