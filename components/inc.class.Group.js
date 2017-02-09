const Suspect = require('./inc.class.Suspect');
const Immutable = require('immutable');

module.exports = class Group {

    set suspect(id) {
        if (id && (typeof id === 'string' || typeof id === 'number')) {
            if (this.suspectsMap.has(id)) {
                throw new Error('A suspect with the same id already exists.');
            } else {
                this.suspectsMap = this.suspectsMap.set(id, new Suspect());
            }
        } else {
            throw new TypeError('Invalid id for a suspect.')
        }
    }

    get suspects() {
        return this.suspectsMap;
    }

    constructor(groupId) {
        this.suspectsMap = Immutable.Map({});
    }
};