import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect} from 'chai';
import { computed } from '@ember/object';

import Ember from 'ember';
import _ from 'lodash';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';
//import KojacEmberModel from 'ember-kojac/utils/ember/KojacEmberModel';
import ManagedModel, { field } from 'ember-kojac/utils/ember/ManagedModel';

describe("ManagedModel toJsono", function() {

	var productProperties = {
		name: field(String),
		purchases: field(KojacTypes.Int),
		weight: field(Number),
		isMember: field(Boolean),
		embedded: field()
	};
	var Product = ManagedModel.extend(productProperties);

	var Summer = ManagedModel.extend({
		a: field(KojacTypes.Int),
		b: field(KojacTypes.Int),
		sum: computed('a','b',function() {
			return this.get('a') + this.get('b');
		})
	});

	var productValues1 = {
		name: 'John',
		purchases: 56,
		weight: 12.3,
		isMember: true,
		embedded: null
	};

	var values2 = {
		colour: 'crimson',
		content: 23,
		explosive: true,
		embedded: null
	};

	var simpleArray = [3,4,5,true,false,"efg",3.4,null];

	it("simple values", function() {
		for (var v in simpleArray) {
			expect(KojacUtils.toJsono(v)).to.equal(v);
		}
	});

	it("array of simple values", function() {
		var jsono = KojacUtils.toJsono(simpleArray);
		expect(jsono).to.eql(simpleArray);
	});

	it("simple object", function() {
		var jsono = KojacUtils.toJsono(productValues1);
		expect(jsono).to.eql(productValues1);
	});

	it("simple object with embedded model", function() {
		var input = _.clone(values2);
		input.embedded = Product.create(productValues1);

		var actual = KojacUtils.toJsono(input);

		var expected = _.clone(values2);
		expected.embedded = productValues1;

		expect(actual).to.eql(expected);
	});

	it("simple model with embedded object", function() {
		var input = Product.create(productValues1);
		input.set('embedded',values2);

		var actual = KojacUtils.toJsono(input);

		var expected = _.clone(productValues1);
		expected.embedded = values2;

		expect(actual).to.eql(expected);
	});

	it("simple model", function() {
		var product1 = Product.create(productValues1);
		var jsono = KojacUtils.toJsono(product1);
		expect(jsono).to.eql(productValues1)
	});

	it("model with include", function(){
		var input = Summer.create({a: 17,b:28});
		var actual = KojacUtils.toJsono(input,{include: ['sum']});
		expect(actual).to.eql({a: 17,b:28,sum:45});
	});

	it("date toJsono", function() {
		var actual = KojacUtils.toJsono(new Date(2011,0,1));
		expect(actual).to.eql("2010-12-31T16:00:00.000Z");
	});

	it("date serialization", function() {
		var Product = ManagedModel.extend({
			dob: field(Date)
		});
		var product = Product.create({dob: new Date(2011,0,1)});
		var jsono = KojacUtils.toJsono(product);
		expect(jsono).to.eql({
			dob: "2010-12-31T16:00:00.000Z"
		})
	});

});
