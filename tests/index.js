// nodeunit tests/index.js
const Heuristic = require('../index');

/**
 * Initializes an empty class and returns empty.
 * @param test
 */
exports.initialize = function (test) {
    const hObj = new Heuristic();
    test.equal(typeof hObj, 'object');
    test.expect(1);
    test.done();
};

exports.getEmptyGroupsAndSuspectsArrays = function (test) {
    const hObj = new Heuristic();
    test.deepEqual(hObj.groups, []);
    test.deepEqual(hObj.suspects, []);
    test.expect(2);
    test.done();
};

exports.setGroup = function (test) {
    const hObj = new Heuristic();
    hObj.setGroup('0');
    test.deepEqual(hObj.groups.length, 1);
    test.expect(1);
    test.done();
};

exports.setSuspect = function (test) {
    const hObj = new Heuristic();
    hObj.setSuspect('0');
    test.deepEqual(hObj.suspects.length, 1);
    test.expect(1);
    test.done();
};