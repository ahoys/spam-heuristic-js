const Group = require('../src/class.Group');
const Immutable = require('immutable');

// Variables ----------------------------------

const gId0 = 'g123';
const sId0 = 's123';
const sId1 = 321;
const messages_ok = [
    "Whatsup?",
    "That's cool.",
    "what else?",
    "neat.",
    "Gonna play something?",
    "k",
    "I'm gonna eat first, brb...",
    "Back. Lets go."
];
const messages_fail = [
    "spam spam spam spam spam spam spam spam spam",
    "I'M THAT VERY LOUD GUY WHO WRITES EVERYTHING WITH CAPS LOCK ON. YOU KNOW?",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!",
    "aaaaaAAAAAAAAAAAAaaaAAAaaAAAAAAAAAAAAAaaAAAAaaaaaaaaaaaaaaaaaAAAaaaaaa!",
    " ",
    "repeat",
    "repeat",
    "repeat",
    "repeat",
    "I'm trying to fool the system",
    "Talking normally",
    "Then some advertising: http://strangesite.ru/ BUY NOW!",
    "Then I just act like everything were ok."
];

// Tests --------------------------------------

exports.setRecord = function (test) {
    const groupObj = new Group(gId0);

    let actual = groupObj.id;
    test.equal(actual, gId0, '0');

    groupObj.setRecord(sId0, {type: 'eventMessage', value: messages_ok[0]});

    // Records testing.
    actual = groupObj.records;
    test.deepEqual(actual.get(0).sId, sId0, '1');

    // Suspects testing.
    actual = groupObj.suspects;
    test.equal(actual.get(sId0).id, sId0, '2');

    groupObj.setRecord(sId0, {type: 'eventMessage', value: messages_ok[1]});
    groupObj.setRecord(sId1, {type: 'eventMessage', value: messages_ok[2]});

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

    messages_ok.forEach((message) => {
        groupObj.setRecord(sId0, {type: 'eventMessage', value: message});
    });

    messages_fail.forEach((message) => {
        groupObj.setRecord(sId1, {type: 'eventMessage', value: message});
    });

    let actual = groupObj.getSuspectAnalysis(sId0);
    test.deepEqual(actual, {}, '0');

    actual = groupObj.getSuspectAnalysis(sId1);
    test.deepEqual(actual, {}, '1');

    test.expect(2);
    test.done();
};