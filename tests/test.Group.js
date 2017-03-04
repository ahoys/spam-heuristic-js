const Group = require('../src/class.Group');
const Immutable = require('immutable');

// Variables ----------------------------------

const gId0 = 'g123';
const sId0 = 's123';
const sId1 = 321;
const eventMessage0 = {type: 'eventMessage', value: 'msg 123 ! " / 3'};
const eventMessage1 = {type: 'eventMessage', value: 'repeat repeat repeat repeat repeat repeat repeat repeat'};

// Tests --------------------------------------

exports.setRecord = function (test) {
    const groupObj = new Group(gId0);

    let actual = groupObj.id;
    test.equal(actual, gId0, '0');

    groupObj.setRecord(sId0, eventMessage0);

    // Records testing.
    actual = groupObj.records;
    test.deepEqual(actual.get(0).sId, sId0, '1');

    // Suspects testing.
    actual = groupObj.suspects;
    test.equal(actual.get(sId0).id, sId0, '2');

    groupObj.setRecord(sId0, eventMessage1);
    groupObj.setRecord(sId1, eventMessage0);

    actual = groupObj.records;
    test.equal(actual.size, 3, '3');
    test.equal(actual.get(2).sId, sId1, '4');

    actual = groupObj.suspects;
    test.equal(actual.size, 2, '5');
    test.equal(actual.get(sId1).id, sId1, '6');

    test.expect(7);
    test.done();
};

exports.getSuspectAnalysis = function (test) {
    const groupObj = new Group(gId0);

    groupObj.setRecord(sId0, eventMessage0);
    groupObj.setRecord(sId0, eventMessage1);

    let actual = groupObj.getSuspectAnalysis(sId0);
    test.deepEqual(actual, {}, '0');

    test.expect(1);
    test.done();
};