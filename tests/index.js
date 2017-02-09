// nodeunit tests/index.js
const Heuristic = require('../index');
const Immutable = require('immutable');

exports.initialize = function (test) {
    const actual = new Heuristic();
    test.equal(typeof actual, 'object');
    test.expect(1);
    test.done();
};

exports.getEmptyGroupsObject = function (test) {
    const actual = new Heuristic();
    const expected = Immutable.Map({});
    test.deepEqual(actual.groups, expected);
    test.expect(1);
    test.done();
};

exports.setGroup = function (test) {
    const actual = new Heuristic();
    actual.setGroup('0');
    const expected = {
        suspectsMap: Immutable.Map({})
    };
    test.deepEqual(actual.groups.get('0'), expected);
    test.expect(1);
    test.done();
};