// nodeunit tests/index.js
const Heuristic = require('../index');
const Immutable = require('immutable');
const defaultEmphasis = require('../configs/defaultEmphasis.json');

// Tests --------------------------------------

exports.initialize = function (test) {
    const heuristicObj = new Heuristic();
    test.equal(typeof heuristicObj, 'object');
    test.equal(heuristicObj.emphasis, defaultEmphasis);
    test.deepEqual(heuristicObj.suspects, Immutable.Map({}));
    test.deepEqual(heuristicObj.groups, Immutable.Map({}));
    test.deepEqual(heuristicObj.getAnalysis(), {
        certainty: 0,
        severity: 0
    });
    test.expect(5);
    test.done();
};

exports.getMapId = function (test) {
    const expected = [0, 1, 2, 0, 1];
    let id = -1;
    for (let i = 0; i < 5; ++i) {
        id = Heuristic.getMapId(id, 2);
        test.equal(id, expected[i]);
    }
    test.expect(5);
    test.done();
};