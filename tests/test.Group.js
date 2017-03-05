const Group = require('../src/class.Group');
const EventMessage = require('../src/class.EventMessage');
const strings = require('./strings.json');

// Tests --------------------------------------

exports.setRecord = function (test) {
    const groupObj = new Group(strings.group_ids[0]);

    let actual = groupObj.id;
    test.equal(actual, strings.group_ids[0], '0');

    groupObj.setRecord(strings.user_ids[0], {type: 'eventMessage', value: strings.messages_ok_0[0]});

    // Records testing.
    actual = groupObj.records;
    test.deepEqual(actual.get(0).sId, strings.user_ids[0], '1');

    // Suspects testing.
    actual = groupObj.suspects;
    test.equal(actual.get(strings.user_ids[0]).id, strings.user_ids[0], '2');

    groupObj.setRecord(strings.user_ids[0], {type: 'eventMessage', value: strings.messages_ok_0[1]});
    groupObj.setRecord(strings.user_ids[1], {type: 'eventMessage', value: strings.messages_ok_0[2]});

    actual = groupObj.records;
    test.equal(actual.size, 3, '3');
    test.equal(actual.get(2).sId, strings.user_ids[1], '4');

    actual = groupObj.suspects;
    test.equal(actual.size, 2, '5');
    test.equal(actual.get(strings.user_ids[1]).id, strings.user_ids[1], '6');

    test.expect(7);
    test.done();
};

exports.getSuspectAnalysis = function (test) {
    const groupObj = new Group(strings.group_ids[0]);

    strings.messages_ok_0.forEach((message) => {
        groupObj.setRecord(strings.user_ids[0], new EventMessage(message));
    });

    strings.messages_fail_0.forEach((message) => {
        groupObj.setRecord(strings.user_ids[1], new EventMessage(message));
    });

    let actual = groupObj.getSuspectAnalysis(strings.user_ids[0]);
    test.deepEqual(actual, {}, '0');

    actual = groupObj.getSuspectAnalysis(strings.user_ids[1]);
    test.deepEqual(actual, {}, '1');

    test.expect(2);
    test.done();
};