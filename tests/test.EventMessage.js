// nodeunit tests/test.EventMessage.js
const EventMessage = require('../src/class.EventMessage');

// Samples ------------------------------------

const arr0 = ['a'];
const arr1 = ['aaa', 'bbb'];
const arr2 = ['a', 'bb', 'ccc'];
const arr3 = ['a%', ')=¤"/', '123', '  ', 12345];

// Tests --------------------------------------

exports.initialize = function (test) {
    const eventMessageObj = new EventMessage('test');
    const message = eventMessageObj.message;
    const certainty = eventMessageObj.certainty;
    const severity = eventMessageObj.severity;
    console.log(message, certainty, severity);
    test.equal(message, 'test');
    test.equal(certainty, 0);
    test.equal(severity, 0);
    test.expect(3);
    test.done();
};§