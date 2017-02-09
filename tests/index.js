// nodeunit tests/index.js
const Heuristic = require('../index');

/**
 * Initializes an empty class and returns empty.
 * @param test
 */
exports.initialize = function (test) {
    const hObj = new Heuristic();
    const suspects = hObj.getSubjects();
    test.deepEqual(suspects, {});
    test.expect(1);
    test.done();
};