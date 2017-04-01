// nodeunit tests/test.EventMessage.js
const EventMessage = require('../src/class.EventMessage');

// Tests --------------------------------------

exports.initialize = function (test) {
    const eventMessageObj = new EventMessage('test');
    const message = eventMessageObj.message;
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(message, 'test');
    test.equal(certainty, 0);
    test.equal(severity, 0);
    test.expect(3);
    test.done();
};

exports.spamMessage_repeatingWords = function (test) {
    const eventMessageObj = new EventMessage('test test test test test test');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 0);
    test.equal(severity, 0);
    test.expect(2);
    test.done();
};

exports.spamMessage_shortWords0 = function (test) {
    const eventMessageObj = new EventMessage('t h i s i s s p a m ee hh h');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 33);
    test.equal(severity, 3);
    test.expect(2);
    test.done();
};

exports.spamMessage_shortWords1_falseFlag = function (test) {
    const eventMessageObj = new EventMessage('oh my how odd is it spam rly im not spamming');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 33);
    test.equal(severity, 3);
    test.expect(2);
    test.done();
};

exports.spamMessage_longWords0 = function (test) {
    const eventMessageObj = new EventMessage('thesewordsareartificiallylongandimjustrepeatingthem ' +
        'thesewordsareartificiallylongandimjustrepeatingthem');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 33);
    test.equal(severity, 3);
    test.expect(2);
    test.done();
};

exports.spamMessage_longWords1_falseFlag = function (test) {
    const eventMessageObj = new EventMessage('The manifestation of the existential paradigm is ' +
        'infinitesimally larger than the exponentially evolved humanistic peon; indeed this precept ' +
        'is fundamentally beyond the cognisance of any finite mind.');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 33);
    test.equal(severity, 1);
    test.expect(2);
    test.done();
};

exports.spamMessage_repeatingChars0 = function (test) {
    const eventMessageObj = new EventMessage('aaaaaaaaaaaaaaaaaaaaaaaaaa!');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 67);
    test.equal(severity, 6);
    test.expect(2);
    test.done();
};

exports.spamMessage_repeatingChars1 = function (test) {
    const eventMessageObj = new EventMessage('aaaaaaaAAAaaAAa    aaaaaaaaaa!');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 67);
    test.equal(severity, 4);
    test.expect(2);
    test.done();
};

exports.spamMessage_repeatingStrings0 = function (test) {
    const eventMessageObj = new EventMessage('is is is is is no no no no no');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 100);
    test.equal(severity, 5);
    test.expect(2);
    test.done();
};

exports.spamMessage_repeatingStrings1 = function (test) {
    const eventMessageObj = new EventMessage('is is is is is is is is is is');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 100);
    test.equal(severity, 10);
    test.expect(2);
    test.done();
};

exports.spamMessage_repeatingStrings2 = function (test) {
    const eventMessageObj = new EventMessage('is as no us');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 0);
    test.equal(severity, 0);
    test.expect(2);
    test.done();
};

exports.spamMessage_repeatingStrings3 = function (test) {
    const eventMessageObj = new EventMessage('spam test spam test spam test spam test');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 0);
    test.equal(severity, 0);
    test.expect(2);
    test.done();
};

exports.spamMessage_repeatingStrings4 = function (test) {
    const eventMessageObj = new EventMessage('spam test divider spam test divider spam test divider spam test divider');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 0);
    test.equal(severity, 0);
    test.expect(2);
    test.done();
};

exports.spamMessage_repeatingStrings5 = function (test) {
    const eventMessageObj = new EventMessage('this is a fully valid test to trick the repeating strings ' +
        'function this is a fully valid test to trick the repeating strings function this is a fully valid test ' +
        'to trick the repeating strings function this is a fully valid test to trick the repeating strings ' +
        'function this is a fully valid test to trick the repeating strings function this is a fully valid ' +
        'test to trick the repeating strings function');
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    test.equal(certainty, 0);
    test.equal(severity, 0);
    test.expect(2);
    test.done();
};