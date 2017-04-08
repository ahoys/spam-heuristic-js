// nodeunit tests/index.js
const Suspect = require('../components/inc.class.Suspect');

// Tests --------------------------------------

exports.initialize = function (test) {
  const suspectObj = new Suspect(0);
  test.equal(typeof suspectObj, 'object');
  test.equal(suspectObj.id, 0);
  test.equal(suspectObj.violations, 0);
  test.deepEqual(suspectObj.getSuspectAnalysis(), {
    certainty: 0,
    severity: 0
  });
  test.expect(4);
  test.done();
};