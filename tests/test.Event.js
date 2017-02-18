// nodeunit tests/test.Event.js
const Event = require('../src/class.Event');

// Samples ------------------------------------

const arr0 = ['a'];
const arr1 = ['aaa', 'bbb'];
const arr2 = ['a', 'bb', 'ccc'];
const arr3 = ['a%', ')=¤"/', '123', '  ', 12345];

// Tests --------------------------------------

exports.getPercentageOfShortWords = function (test) {
    test.equal(Event.getPercentageOfShortWords(arr0, 2), 100);
    test.equal(Event.getPercentageOfShortWords(arr1, 3), 0);
    test.equal(Event.getPercentageOfShortWords(arr2, 3), 67);
    test.equal(Event.getPercentageOfShortWords(arr3, 3), 40);
    test.expect(4);
    test.done();
};