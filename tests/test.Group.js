// nodeunit tests/index.js
const Group = require('../components/inc.class.Group');
const Immutable = require('immutable');

// Tests --------------------------------------

exports.initialize = function (test) {
    const groupObj = new Group(0);
    test.equal(typeof groupObj, 'object');
    test.equal(groupObj.id, 0);
    test.deepEqual(groupObj.suspects, Immutable.Map({}));
    test.deepEqual(groupObj.getGroupAnalysis(), {
        certainty: 0,
        severity: 0
    });
    test.expect(4);
    test.done();
};