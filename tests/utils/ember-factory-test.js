import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect} from 'chai';
import EmberObject from '@ember/object';

import Ember from 'ember';
//import { module, test } from 'qunit';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';

//module('Unit | Utility | Kojac');

describe("Ember Factory", function() {

	 var OrderItem = EmberObject.extend({});
//		id: KojacTypes.Int,
//		customer_id: KojacTypes.Int,
//		product_id: KojacTypes.Int
//	});

	var Product = EmberObject.extend({
	});

	it("create Ember.Object from plain object", function() {
		var factory = new KojacObjectFactory();
		factory.framework = EmberFramework.instance();
		factory.register([
			[/^order_item(__|$)/,OrderItem],
			[/^product(__|$)/,Product]
		]);
		var source = {
			id: 51,
			name: 'Fred',
			width: 100,
			enabled: true,
			details: {
				message: 'some message'
			},
			nothing: null
		};

		var emberObject = factory.manufacture(source,'order_item__51');
		assert.ok(emberObject);
		assert.strictEqual(emberObject.constructor,OrderItem);
		assert.equal(emberObject.id,source.id);
		assert.equal(emberObject.name,source.name);
		assert.equal(emberObject.enabled,source.enabled);
		assert.equal(emberObject.details,source.details);
		assert.equal(emberObject.nothing,source.nothing);
		assert.equal(emberObject.get('id'),source.id);
		assert.equal(emberObject.get('name'),source.name);
		assert.equal(emberObject.get('enabled'),source.enabled);
		assert.equal(emberObject.get('details'),source.details);
		assert.equal(emberObject.get('nothing'),source.nothing);
	});

	it("create Ember.Objects from plain objects", function() {
		var factory = new KojacObjectFactory();
		factory.framework = EmberFramework.instance();
		factory.register([
			[/^order_item(__|$)/,OrderItem],
			[/^product(__|$)/,Product]
		]);
		var source = [
			{
				id: 51,
				name: 'Fred',
				width: 100,
				enabled: true,
				details: {
					message: 'some message'
				},
				nothing: null
			},
			{
				id: 52,
				name: 'John',
				width: 102,
				enabled: false,
				details: {
					message: 'another message'
				},
				nothing: null
			}
		];

		var emberObjects = factory.manufacture(source,'order_item');
		var emberObject = emberObjects[0];
		assert.ok(emberObject);
		assert.equal(emberObject.constructor,OrderItem);
		assert.equal(emberObject.id,source[0].id);
		assert.equal(emberObject.name,source[0].name);
		assert.equal(emberObject.enabled,source[0].enabled);
		assert.equal(emberObject.details,source[0].details);
		assert.equal(emberObject.nothing,source[0].nothing);
		emberObject = emberObjects[1];
		assert.ok(emberObject);
		assert.equal(emberObject.constructor,OrderItem);
		assert.equal(emberObject.id,source[1].id);
		assert.equal(emberObject.name,source[1].name);
		assert.equal(emberObject.enabled,source[1].enabled);
		assert.equal(emberObject.details,source[1].details);
		assert.equal(emberObject.nothing,source[1].nothing);
	});
	//
	//// TYPE     declare null    declare default   null value
	//// string:  String          'hello'           null
	//// KojacTypes.Int:     KojacTypes.Int             1                 null or NaN ?
	//// float:   Number          0.9               null or NaN ?
	//// boolean: Boolean         true              null
	//// object:  Object          {blah: 67}        null
	////
	//// Perhaps return null in all cases
	var exampleDefA = {
		astring: String,
		anumber: Number,
		aboolean: Boolean,
		aint: KojacTypes.Int,
		aobject: Object,
		__allowDynamic: false
	};

	var exampleSourceA = {
		astring: 'hello',
		anumber: 1,
		aboolean: true,
		aint: 3,
		aobject: {name: 'Fred'}
	};

	it("Try defining properties with classes and then readTypedProperties without conversion required", function() {
		assert.ok(exampleDefA.astring===String);
		assert.ok(exampleDefA.anumber===Number);
		assert.ok(exampleDefA.aboolean===Boolean);
		assert.ok(exampleDefA.aint===KojacTypes.Int);
		assert.ok(exampleDefA.aobject===Object);

		assert.ok(exampleDefA.aobject!==KojacTypes.Int);
		assert.ok(exampleDefA.aobject!==String);
		assert.ok(exampleDefA.aobject!==Number);

		assert.ok(exampleDefA.aint!==String);
		assert.ok(exampleDefA.aint!==Object);

		var obj = {};
		obj = KojacTypes.readTypedProperties(obj,exampleSourceA,exampleDefA);
		//expect(obj).to.eql(exampleSourceA);
		assert.deepEqual(obj,exampleSourceA);
	});

	var exampleSourceB = {
		astring: 111,
		anumber: "123",
		aboolean: 1,
		aint: 5.6,
		aobject: [2,3,4]
	};

	it("Try readTypedProperties needing conversion", function() {
		var obj = KojacTypes.readTypedProperties({},exampleSourceB,exampleDefA);
		assert.deepEqual(obj,{
			astring: "111",
			anumber: 123.0,
			aboolean: true,
			aint: 6,
			aobject: null
		});
	});

});

