const heuristic = require('../index');

/**
 * Should return probability and severity of spam from a string.
 * @param test
 */
exports.getSpamProbability_String = function(test) {
    const value = heuristic.getSpamProbability('msg');
    test.equal(value.probability, 0);
    test.equal(value.severity, 0);
    test.expect(2);
    test.done();
};

/**
 * Should return probability and severity of spam from an array.
 * @param test
 */
exports.getSpamProbability_Array = function(test) {
    const valueArr = heuristic.getSpamProbability(['msg']);
    test.equal(valueArr.probability, 0);
    test.equal(valueArr.severity, 0);
    const valueArr2 = heuristic.getSpamProbability(['msg', 'msg']);
    test.equal(valueArr2.probability, 0);
    test.equal(valueArr2.severity, 0);
    test.expect(4);
    test.done();
};