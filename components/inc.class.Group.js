const Suspect = require('./inc.class.Suspect');
const Immutable = require('immutable');

module.exports = class Group {

    set suspect(id) {
        if (id && (typeof id === 'string' || typeof id === 'number')) {
            this.suspectsMap = this.suspectsMap.set(id, new Suspect());
        }
    }

    get suspects() {
        return this.suspectsMap;
    }

    constructor(groupId) {
        this.suspectsMap = Immutable.Map({});
    }
};