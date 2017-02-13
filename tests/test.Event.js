// nodeunit tests/index.js
const Event = require('../components/inc.class.Event');

// Tests --------------------------------------

exports.initialize = function (test) {
    const eventObj = new Event('msg');
    test.equal(typeof eventObj, 'object');
    test.equal(eventObj.certainty, 0);
    test.equal(eventObj.severity, 0);
    test.equal(typeof eventObj.created, 'number');
    test.equal(eventObj.isNoteworthy(), false);
    test.expect(5);
    test.done();
};