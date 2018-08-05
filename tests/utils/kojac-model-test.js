import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect} from 'chai';

import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacObject from 'ember-kojac/utils/KojacObject';
import KojacModel from 'ember-kojac/utils/KojacModel';

describe("Kojac Model", function() {

	var TestModel = KojacModel.extend({
		name: String,
		count: 8
	});

	var TestModel2 = TestModel.extend({
		name: Boolean,
		color: 'red'
	});

	var TestModel3 = TestModel.extend({
		count: 0,
		inc: function() {
			this.count += 1;
		}
	});

	it("create model class and object", function() {
		expect(TestModel.__attributes).to.eql({name: String, count: KojacTypes.Int});
		expect(TestModel._superClass).to.equal(KojacModel);
		var testModel = new TestModel();
		expect(testModel instanceof TestModel).to.be.true;
		expect(testModel instanceof KojacObject).to.be.true;
		expect(testModel.name).to.be.null;
		expect(testModel.count).to.equal(8);
		expect(testModel.toJSON).to.be.defined;
	});

	it("extend with override and additional attribute", function() {
		expect(TestModel2.__attributes).to.eql({name: Boolean, count: KojacTypes.Int, color: String});
		expect(TestModel2._superClass).to.equal(TestModel);
		var testModel2 = new TestModel2();
		expect(testModel2 instanceof TestModel2).to.be.true;
		expect(testModel2 instanceof KojacObject).to.be.true;
		expect(testModel2.name).to.be.null;
		expect(testModel2.count).to.equal(8);
	});

	var CurSuper = KojacModel.extend({
		id: KojacTypes.Int,
		accountRef: String,
		productId: KojacTypes.Int,
		drawings: Number,
		holdings: Array,
		comments: Object,
		content: KojacTypes.Null
	});

	it("write, read and check with correct types", function() {
		var values = {
			id: 123,
			accountRef: 'XYZ',
			productId: 456,
			drawings: 3567.88,
			holdings: [{name: 'this'},{name: 'that'}],
			comments: {name: 'something else'},
			content: 123
		};
		var curSuper = new CurSuper(values);
		expect(curSuper.attr()).to.eql(values);
	});

	it("write incorrect types, then read and check with attr and serialize", function() {
		var incorrectValues = {
			id: 123.345,
			accountRef: 345345346,
			productId: '456',
			drawings: '3567.88',
			holdings: "something",
			comments: 'something else',
			content: 'XYZ'
		};
		var correctValues = {
			id: 123,
			accountRef: '345345346',
			productId: 456,
			drawings: 3567.88,
			holdings: null,
			comments: null,
			content: 'XYZ'
		};
		var curSuper = new CurSuper(incorrectValues);
		expect(curSuper.attr()).to.eql(correctValues);
	});


	it("test if Model methods are bound", function() {
		var testModel3 = new TestModel3();
		expect(testModel3.count).to.eql(0);
		testModel3.inc();
		expect(testModel3.count).to.eql(1);
	});

	it("defaults test", function() {
		var Zelda = KojacModel.extend({
			sword: 'Wooden Sword',
			shield: false,
			hearts: 3,
			rupees: 0
		});
		var link = new Zelda({
			rupees: 255
		});
		expect(link.attr('sword')).to.eql('Wooden Sword');
		expect(link.attr('rupees')).to.eql(255);
	});

	it("KojacModel defaults and methods work", function() {
		var MyTestModel = KojacModel.extend({
			count: 5,
			inc: function() {
				this.count += 1;
			}
		});
		console.log('before new MyTestModel');
		var testModel = new MyTestModel({});
		console.log('after new MyTestModel');
		expect(testModel.attr('count')).to.equal(5);
		testModel.inc();
		expect(testModel.count).to.equal(6);
	});

});

