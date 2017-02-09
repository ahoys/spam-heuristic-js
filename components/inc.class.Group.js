const Suspect = require('./inc.class.Suspect');
const Immutable = require('immutable');

module.exports = class Group {

    set suspect(sId) {
        if (sId && (typeof sId === 'string' || typeof sId === 'number')) {
            if (this.suspectsMap.has(sId)) {
                throw new Error('A suspect with the same id already exists.');
            } else {
                this.suspectsMap = this.suspectsMap.set(sId, new Suspect());
            }
        } else {
            throw new TypeError('Invalid id for a suspect.')
        }
    }

    get suspects() {
        return this.suspectsMap;
    }

    constructor() {
        this.suspectsMap = Immutable.Map({});
    }
};