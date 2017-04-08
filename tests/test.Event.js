// nodeunit tests/test.Event.js
const strings = require('./strings.json');
const Event = require('../src/class.Event');

// Samples ------------------------------------

const arr0 = ['a'];
const arr1 = ['aaa', 'bbb'];
const arr2 = ['a', 'bb', 'ccc'];
const arr3 = ['a%', ')=¤"/', '123', '  ', 12345];

// Tests --------------------------------------

exports.getPercentageOfShortWords = function (test) {
  test.equal(Event.getPercentageOfShortWords(arr0, 2), 100, '0');
  test.equal(Event.getPercentageOfShortWords(arr1, 3), 0, '1');
  test.equal(Event.getPercentageOfShortWords(arr2, 3), 67, '2');
  test.equal(Event.getPercentageOfShortWords(arr3, 3), 40, '3');
  test.expect(4);
  test.done();
};

exports.getPercentageOfRepetitiveStrings = function (test) {
  test.equal(Event.getPercentageOfRepetitiveStrings(strings.words_repeat_100_0), 100, '0');
  test.equal(Event.getPercentageOfRepetitiveStrings(strings.words_repeat_100_1), 100, '1');
  test.equal(Event.getPercentageOfRepetitiveStrings(strings.words_repeat_50), 50, '2');
  test.equal(Event.getPercentageOfRepetitiveStrings(strings.words_repeat_0), 0, '3');
  test.expect(4);
  test.done();
};