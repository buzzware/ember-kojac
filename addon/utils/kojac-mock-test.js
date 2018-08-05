import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect} from 'chai';

import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacCore from 'ember-kojac/utils/KojacCore';
import KojacObject from 'ember-kojac/utils/KojacObject';
import OpResponse from 'ember-kojac/utils/OpResponse';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
import DummyRemoteProvider from 'ember-kojac/utils/DummyRemoteProvider';
import KojacModel from 'ember-kojac/utils/KojacModel';

describe("Kojac Mock", function() {

	var App = {};

	var OrderItem = KojacModel.extend({
		id: KojacTypes.Int,
		customer_id: KojacTypes.Int,
		product_id: KojacTypes.Int
	});

	var Product = KojacModel.extend({

	});

	beforeEach(function () {
		App.cache = {};
		var factory = new KojacObjectFactory();
		factory.register([
			[/^order_item(__|$)/,OrderItem],
			[/^product(__|$)/,Product]
		]);
		App.kojac = new KojacCore({
			cache: App.cache,
			apiVersion: 3,
			remoteProvider: new DummyRemoteProvider({mockFilePath: '/assets/mockjson/'}),
			objectFactory: factory
		});
	});

	it("try reading order_item,product", async function() {
		var op;

		var req =	App.kojac.read(['order_item','product','order_item__50']);
		expect(req.ops).to.be.defined;
		expect(req.options).to.be.defined;
		expect(req.ops.length).to.equal(3);
		op = req.ops[0];
		expect(op.verb).to.equal('READ');
		expect(op.key).to.equal('order_item');
		expect(op.result_key).to.equal(op.key);
		expect(op.results).to.not.be.defined;

		op = req.ops[1];
		expect(op.verb).to.equal('READ');
		expect(op.key).to.equal('product');
		expect(op.result_key).to.equal(op.key);
		expect(op.results).to.not.be.defined;
		op = req.ops[2];
		expect(op.verb).to.equal('READ');
		expect(op.key).to.equal('order_item__50');
		expect(op.result_key).to.equal(op.key);
		expect(op.results).to.not.be.defined;

		var response = await req.request();
		expect(response.ops).to.be.defined;
		var i = 0;
		op = response.ops[i];
		expect(op.result_key).to.equal('order_item');
		expect(op.results).to.be.a('object');
		expect(op.results.order_item).to.eql([49,50,51]);
		expect(op.results.order_item__49.constructor).to.equal(OrderItem);
		expect(op.results.order_item__49.id).to.equal(49);
		expect(op.results.order_item__49.accountRef).to.equal("000049X");
		expect(op.results.order_item__49.productId).to.equal(3);

		op = response.ops[++i];
		expect(op.result_key).to.equal('product');
		expect(op.results).to.be.a('object');
		expect(op.results.product).to.eql([3,4,5]);
		expect(op.results.product__3.constructor).to.equal(Product);
		expect(op.results.product__3.name).to.equal("Product 3");
		expect(op.results.product__3.provider).to.equal("AJAX Pty Ltd");

		op = response.ops[++i];
		expect(op.result_key).to.equal('order_item__50');
		expect(op.results).to.be.a('object');
		expect(op.results.order_item__50.constructor).to.equal(OrderItem);
		expect(op.results.order_item__50.accountRef).to.equal("000050X");
		expect(op.results.order_item__50.memberTypeId).to.equal("CDB");
		expect(op.results.order_item__50.drawings).to.equal(1234.50);

		expect(App.cache.order_item__49).to.be.defined;
		expect(App.cache.order_item__49).to.equal(response.ops[0].results.order_item__49);
		expect(App.cache.product__3).to.be.defined;
		expect(App.cache.product__3).to.equal(response.ops[1].results.product__3);
	});

	it("try creating", async function() {
		var op;
		var req;
		App.kojac.remoteProvider.mockWriteOperationHandler = function(aOp) {
			return new OpResponse({
				result_key: 'order_item__54',
				results: {
					order_item__54: op.value
				}
			});
		};

		req = App.kojac.create({order_item:{name: 'Fred'}});

		expect(req.ops).to.be.defined;
		expect(req.options).to.be.defined;
		expect(req.ops.length).to.equal(1);
		op = req.ops[0];
		expect(op.verb).to.equal('CREATE');
		expect(op.key).to.equal('order_item');
		expect(op.value).to.eql({name: 'Fred'});
		expect(op.results).to.be.undefined;

		var response = await req.request();
		expect(response.ops).to.be.defined;
		var i = 0;
		op = response.ops[i];
		expect(op.result_key).to.equal('order_item__54');
		expect(op.results).to.be.a('object');
		expect(op.results.order_item).to.be.undefined;
		expect(op.results.order_item__54.constructor).to.equal(OrderItem);
		expect(op.results.order_item__54.name).to.equal("Fred");

		expect(App.cache.order_item__54).to.be.defined;
		expect(App.cache.order_item__54).to.equal(op.results.order_item__54);
	});

	it("try updating", async function() {
		var op;
		var req;

		App.kojac.remoteProvider.mockWriteOperationHandler = function(aOp,aResponse) {
			return new OpResponse({
				result_key: op.key,
				results: {
					order_item__54: op.value
				}
			});
		};

		req = App.kojac.update({order_item__54: {name: 'John'}});
		expect(req.ops).to.be.defined;
		expect(req.options).to.be.defined;
		expect(req.ops.length).to.equal(1);
		op = req.ops[0];
		expect(op.verb).to.equal('UPDATE');
		expect(op.key).to.equal('order_item__54');
		expect(op.value).to.eql({name: 'John'});
		expect(op.result_key).to.equal(op.key);
		expect(op.results).to.be.undefined;

		var response = await req.request();

		expect(response.ops).to.be.defined;
		var i = 0;
		op = response.ops[i];
		expect(op.result_key).to.equal(req.ops[i].key);
		expect(op.results).to.be.a('object');
		expect(op.results.order_item).to.be.undefined;
		expect(op.results.order_item__54.constructor).to.equal(OrderItem);
		expect(op.results.order_item__54.name).to.eql("John");

		expect(App.cache.order_item__54).to.be.defined;
		expect(App.cache.order_item__54).to.equal(op.results.order_item__54);
	});

	it("try destroying", async function() {
		var op;
		var req;

		App.cache.order_item__54 = new OrderItem();

		App.kojac.remoteProvider.mockWriteOperationHandler = function(aOp,aResponse) {
			return new OpResponse({
				result_key: op.key,
				results: {
					order_item__54: undefined
				}
			});
		};

		req = App.kojac.destroy(['order_item__54']);
		expect(req.ops).to.be.defined;
		expect(req.options).to.be.defined;
		expect(req.ops.length).to.equal(1);
		var i = 0;
		op = req.ops[i];
		expect(op.verb).to.equal('DESTROY');
		expect(op.key).to.equal('order_item__54');
		expect(op.value).to.be.undefined;
		expect(op.result_key).to.equal(op.key);
		expect(op.results).to.be.undefined;

		var response = await req.request();

		expect(response.ops).to.be.defined;
		op = response.ops[i];
		expect(op.result_key).to.equal(req.ops[i].key);
		expect(op.results).to.be.a('object');
		expect(op.results.order_item__54).to.be.undefined;
		expect(App.cache.order_item__54).to.be.undefined;
		expect(Object.keys(App.cache)).to.eql([]);
	});

	it("try executing, should not be cached", async function() {
		var op;
		var req;

		App.kojac.remoteProvider.mockWriteOperationHandler = function(aOp,aResponse) {
			return new OpResponse({
				result_key: op.key,
				results: {
					results: [1,2,3]
				}
			});
		};

		req = App.kojac.execute('results',{a: 1,b:2});
		expect(req.ops).to.be.defined;
		expect(req.options).to.be.defined;
		expect(req.ops.length).to.equal(1);
		var i = 0;
		op = req.ops[i];
		expect(op.verb).to.equal('EXECUTE');
		expect(op.key).to.equal('results');
		expect(op.value).to.eql({a: 1,b:2});
		expect(op.result_key).to.equal(op.key);
		expect(op.results).to.undefined;

		var response = await req.request();

		expect(response.ops).to.be.defined;
		op = response.ops[i];
		expect(op.result_key).to.equal(req.ops[i].key);
		expect(op.results).to.be.a('object');
		expect(op.results.results).to.eql([1,2,3]);
		expect(App.cache.results).to.be.undefined;
	});
});

