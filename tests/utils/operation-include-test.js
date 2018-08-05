import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect} from 'chai';

import _ from 'lodash';
//import Ember from 'ember';
//import { module, test } from 'qunit';

import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacObject from 'ember-kojac/utils/KojacObject';
import KojacCore from 'ember-kojac/utils/KojacCore';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
import OpResponse from 'ember-kojac/utils/OpResponse';
import DummyRemoteProvider from 'ember-kojac/utils/DummyRemoteProvider';
import KojacTypes from 'ember-kojac/utils/KojacTypes';


describe('Operation include spec',function() {

	var App = {};

	var OrderItem = KojacObject.extend({
		id: KojacTypes.Int,
		customer_id: KojacTypes.Int,
		product_id: KojacTypes.Int
	});

	var Product = KojacObject.extend({

	});

	App.cache = {};
	var factory = new KojacObjectFactory();
	factory.register([
		[/^order_item(__|$)/,OrderItem],
		[/^product(__|$)/,Product]
	]);
	App.kojac = new KojacCore({
		cache: App.cache,
		apiVersion: 3,
		remoteProvider: new DummyRemoteProvider(),
		objectFactory: factory
	});



	it("try reading order_item,product", async function() {
		var op;
		var req;
		App.kojac.remoteProvider.mockReadOperationHandler = function(aOp) {
			return new OpResponse({
				result_key: 'order_item__50',
				results: {
					order_item__50: {
						id: 50,
						accountRef: "000049X",
						productId: 3
					},
					product__3: {
						id: 3,
						name: "Bubble"
					}
				}
			});
		};

		req = App.kojac.read('order_item__50',{include: 'product'});
		expect(req.ops).to.not.be.undefined;
		expect(req.options).to.eql({});
		expect(req.ops.length).to.equal(1);

		op = req.ops[0];
		expect(op.options).to.eql({include: 'product', cacheResults: true, manufacture : true});
		expect(op.verb).to.equal('READ');
		expect(op.key).to.equal('order_item__50');
		expect(op.result_key).to.equal(op.key);

		var response = await req.request();

		op = response.ops[0];
		expect(op.result_key).to.equal(req.ops[0].key);
		expect(op.results).to.be.a('object');
		expect(op.results.order_item__50).to.not.be.undefined;
		expect(op.results.order_item__50.constructor).to.equal(OrderItem);
		expect(op.results.order_item__50.id).to.equal(50);
		expect(op.results.order_item__50.accountRef).to.equal("000049X");
		expect(op.results.order_item__50.productId).to.equal(3);

		expect(op.results.product__3).to.not.be.undefined;
		expect(op.results.product__3.constructor).to.equal(Product);
		expect(op.results.product__3.id).to.equal(3);
		expect(op.results.product__3.name).to.equal("Bubble");
	});
});

