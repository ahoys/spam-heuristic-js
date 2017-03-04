const Group = require('../src/class.Group');
const Immutable = require('immutable');

// Variables ----------------------------------

const gId0 = 'g123';
const sId0 = 's123';
const eventMessage0 = {type: 'eventMessage', value: 'msg 123 ! " / 3'};

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

    test.expect(3);
    test.done();
};

// exports.getSuspectAnalysis = function (test) {
//
// };