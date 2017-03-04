// nodeunit tests/index.js
const Ensemble = require('../index');

// Tests --------------------------------------

exports.static_isValidType_singleLevelArrays = function (test) {
    let actual = Ensemble.isValidType(['test', '', 2], ['string', 'number']);
    test.equal(actual, true, '0');

    actual = Ensemble.isValidType([1], ['number']);
    test.equal(actual, true, '1');

    actual = Ensemble.isValidType([1], ['number']);
    test.equal(actual, true, '2');

    actual = Ensemble.isValidType([], []);
    test.equal(actual, true, '4');

    actual = Ensemble.isValidType(['test', '1'], ['number']);
    test.equal(actual, false, '5');

    actual = Ensemble.isValidType(['test', '1'], []);
    test.equal(actual, false, '6');

    test.expect(6);
    test.done();
};

exports.static_isValidType_multiLevelArrays = function (test) {
    let actual = Ensemble.isValidType(['test', '', 2], [['string'], ['number', 'string'], ['number']]);
    test.equal(actual, true, '1');

    actual = Ensemble.isValidType(['', {}], [['string'], ['object']]);
    test.equal(actual, true, '2');

    actual = Ensemble.isValidType(['test', 2], [['string'], ['string']]);
    test.equal(actual, false, '3');

    actual = Ensemble.isValidType(['test', 2], [['string', 'number']]);
    test.equal(actual, false, '4');

    test.expect(4);
    test.done();
};

exports.static_getMapId_ok = function (test) {
    const expected = [0, 1, 2, 0, 1];
    let id = -1;
    for (let i = 0; i < 5; ++i) {
        id = Ensemble.getMapId(id, 2);
        test.equal(id, expected[i]);
    }
    test.expect(5);
    test.done();
};