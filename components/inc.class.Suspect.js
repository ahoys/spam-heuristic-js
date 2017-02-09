const Immutable = require('immutable');

module.exports = class Suspect {

    constructor(id) {
        this.id = id;
        this.history = Immutable.OrderedMap({})
    }
};