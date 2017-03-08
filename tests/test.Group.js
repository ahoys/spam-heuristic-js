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

    strings.messages_ok_0.forEach((message, i) => {
        const eventObj = new EventMessage(message);
        eventObj.created = Number(1088915220322 + i * 3000);
        groupObj.setRecord('user_id0', eventObj);
    });

    strings.messages_ok_1.forEach((message, i) => {
        const eventObj = new EventMessage(message);
        eventObj.created = Number(1188915220322 + i * 3000);
        groupObj.setRecord('user_id1', eventObj);
    });

    strings.messages_fail_0.forEach((message, i) => {
        const eventObj = new EventMessage(message);
        eventObj.created = Number(1288915220322 + i * 3000);
        groupObj.setRecord('user_id2', eventObj);
    });

    let actual = groupObj.getSuspectAnalysis('user_id0');
    test.deepEqual(actual, {}, 'getSuspectAnalysis 0');

    actual = groupObj.getSuspectAnalysis('user_id1');
    test.deepEqual(actual, {}, 'getSuspectAnalysis 1');

    actual = groupObj.getSuspectAnalysis('user_id2');
    test.deepEqual(actual, {}, 'getSuspectAnalysis 2');

    test.expect(3);
    test.done();
};