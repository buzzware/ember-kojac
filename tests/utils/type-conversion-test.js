import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert} from 'chai';

import _ from 'lodash';

import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacUtils from 'ember-kojac/utils/KojacUtils';

describe('Type Conversion',function(){
	it('local Date to ISO UTC String',function() {
		//var obj = Ember.Object.create({foo: "bar"});
		//assert.strictEqual(obj.get('foo'),'bar','can get');
		var values = {
			y: 2011,
			mo: 0,
			d: 1,
			h: 0,
			mi: 21,
			s: 36
		};
		var date = new Date(values['y'], values['mo'], values['d'], values['h'], values['mi'], values['s']);
		var actual = KojacTypes.interpretValueAsType(date, String);
		assert.strictEqual(actual, bf.format("{y}-{mo}-{d}T{h}:{mi}:{s}.000Z", {y: 2010, mo: 12, d: 31, h: 16, mi: 21, s: 36}));
	});

	it('Type Conversion ISO UTC String to local Date',function() {
		var actual = KojacTypes.interpretValueAsType("2010-12-31T16:21:36Z",Date);
		var expected = new Date(Date.UTC(2010,11,31,16,21,36));
		assert.deepEqual(expected,actual);
	});

	it('Type Conversion ISO local String to local Date',function() {
		var actual = KojacTypes.interpretValueAsType("2011-01-01T00:21:36"+KojacTypes.localTimezoneString,Date);
		console.log();
		console.log(actual);
		var expected = KojacUtils.localDate(2011,0,1,0,21,36);
		console.log(expected);
		assert.equal(expected.valueOf(),actual.valueOf());
	});
});