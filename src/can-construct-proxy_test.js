/* global Car */
// require('can/construct/construct');
require('./can-construct-proxy');
require('can/control/control');
require('steal-qunit');

QUnit.module('can/construct/proxy');

QUnit.test('static proxy if control is loaded first', function(assert) {
	var curVal = 0;
	assert.expect(2);
	can.Control('Car', {
		show: function (value) {
			assert.equal(curVal, value);
		}
	}, {});
	var cb = Car.proxy('show');
	curVal = 1;
	cb(1);
	curVal = 2;
	var cb2 = Car.proxy('show', 2);
	cb2();
});
QUnit.test('proxy', function(assert) {
	var curVal = 0;
	assert.expect(2);
	can.Construct('Car', {
		show: function (value) {
			assert.equal(curVal, value);
		}
	}, {});
	var cb = Car.proxy('show');
	curVal = 1;
	cb(1);
	curVal = 2;
	var cb2 = Car.proxy('show', 2);
	cb2();
});

// this won't work in dist mode (this functionality is removed)
if (typeof steal !== 'undefined') {
	QUnit.test('proxy error', 1, function(assert) {
		can.Construct('Car', {});
		try {
			Car.proxy('huh');
			assert.ok(false, 'I should have errored');
		} catch (e) {
			assert.ok(true, 'Error was thrown');
		}
	});
}
