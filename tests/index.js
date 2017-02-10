// nodeunit tests/index.js
const Heuristic = require('../index');
const Immutable = require('immutable');

// Shortcuts ----------------------------------

const newGroup = function (id) {
    const heuristicObj = new Heuristic();
    return heuristicObj.setGroup(id !== undefined ? id : '0');
};

const newSuspect = function (id) {
    const heuristicObj = new Heuristic();
    const groupObj = heuristicObj.setGroup('0');
    return groupObj.setSuspect(id !== undefined ? id : '0');
};

// Tests --------------------------------------

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

exports.getGroup = function (test) {
    const heuristicObj = new Heuristic();
    heuristicObj.setGroup('0');
    const actual = heuristicObj.getGroup('0');
    const expected = {
        suspectsMap: Immutable.Map({})
    };
    test.deepEqual(actual, expected);
    test.expect(1);
    test.done();
};

exports.setSuspect = function (test) {
    const actual = newGroup('1').setSuspect('1');
    const expected = {
        eventMap: Immutable.OrderedMap({}),
        eventHistoryMap: Immutable.OrderedMap({})
    };
    test.deepEqual(actual, expected);
    test.expect(1);
    test.done();
};

exports.getSuspect = function (test) {
    const group = newGroup('0');
    group.setSuspect('1');
    const actual = group.getSuspect('1');
    const expected = {
        eventMap: Immutable.OrderedMap({}),
        eventHistoryMap: Immutable.OrderedMap({})
    };
    test.deepEqual(actual, expected);
    test.expect(1);
    test.done();
};