// nodeunit tests/test.EventMessage.js
const EventMessage = require('../src/class.EventMessage');
const strings = require('./strings.json');

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

exports.strings__mixed_test_array_0 = (test) => {
  strings["mixed_test_array_0"].forEach((row, i) => {
    const row_str = row[0];
    const row_certaintyGoal = row[1];
    const row_severityGoal = row[2];
    const row_isValidMessage = row[3];
    const eventMessageObj = new EventMessage(row_str);
    const certainty = eventMessageObj.certainty >= row_certaintyGoal;
    const severity = eventMessageObj.severity >= row_severityGoal;
    test.equal(certainty, row_isValidMessage, `CERTAINTY >> row index: ${i}, result: ${eventMessageObj.certainty}, limit: ${row_certaintyGoal}, str: ${row_str.substr(0, 10)}`);
    test.equal(severity, true, `SEVERITY >> row index: ${i}, result: ${eventMessageObj.severity}, limit: ${row_severityGoal}, str: ${row_str.substr(0, 10)}`);
  });
  test.done();
}