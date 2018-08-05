import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect} from 'chai';

import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacCore from 'ember-kojac/utils/KojacCore';
import KojacObject from 'ember-kojac/utils/KojacObject';
import OpResponse from 'ember-kojac/utils/OpResponse';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
import KojacLocalStorageRemoteProvider from 'ember-kojac/utils/KojacLocalStorageRemoteProvider';
import KojacModel from 'ember-kojac/utils/KojacModel';

import simpleStorage from 'simple-storage';

describe("LocalStorageRemoteProvider", function() {

	var Waiter = KojacModel.extend({
		id: KojacTypes.Int,
		name: String,
		phone: String,
		gender: String,   // M or F
		option: String,
		queued: Number,
		smsSent: false,
		completed: false,
		created_at: String,
		sendingSms: false
	});

	beforeEach(function () {
	  var localStore = new KojacLocalStorageRemoteProvider();
	  localStore.clear();
    this.cache = {};
		var factory = new KojacObjectFactory();
		factory.register([
			[/^waiters(__|$)/,Waiter]
		]);
		this.kojac = new KojacCore({
			cache: this.cache,
			apiVersion: 3,
			remoteProvider: localStore,
			objectFactory: factory
		});
	});

	it("try create and then read item", async function() {
		var op;
		var req;
		var newKey;
		var createValues = {
			name: 'John',
			phone: '0412 123456'
		};

    var waiter = new Waiter(createValues);
    var response = await this.kojac.create({waiters: waiter}).request();
    req = response.request;

    expect(response.ops).to.not.be.undefined;
    expect(response.ops.length).to.equal(1);
    op = response.ops[0];
    newKey = op.result_key;
    expect(op.result_key).not.to.equal(req.ops[0].key);
    var parts = KojacUtils.keySplit(op.result_key);
    expect(parts[0]).to.equal('waiters');
    var id = bf.toInt(parts[1]);
    expect(-id).to.be.above(Math.pow(2,32));
    expect(-id).to.be.below(Math.pow(2,52));
    expect(op.results).not.to.eql({});
    expect(op.results[op.result_key] instanceof Waiter).to.be.true;

    response = await this.kojac.read(newKey).request();
    req = response.request;

    op = response.ops[0];
    expect(op.result_key).to.equal(newKey);
    expect(op.result().name).to.equal(createValues.name);
    expect(op.result().phone).to.equal(createValues.phone);
    expect(op.result() instanceof Waiter).to.be.true;
	});

	it("try create and then read collection", async function() {
		var op;
		var req;
		var newKey;
		var createValues = {
			name: 'John',
			phone: '0412 123456'
		};
    var response = await this.kojac.create({waiters: createValues}).request();
		req = response.request;

    response = await this.kojac.read('waiters').request();
    req = response.request;

    op = response.ops[0];
    expect(op.result_key).to.equal('waiters');
    expect(op.result() instanceof Array).to.be.true;
    expect(op.result().length).to.equal(1);
    expect(_.keys(op.results).length).to.equal(2);
    var id = op.result()[0];
    var key = KojacUtils.keyJoin('waiters',id);
    var waiter = op.results[key];
    expect(waiter).to.not.be.undefined;
    expect(waiter.id).to.equal(id);

    expect(waiter.name).to.equal(createValues.name);
    expect(waiter.phone).to.equal(createValues.phone);
    expect(waiter instanceof Waiter).to.be.true;
	});

	it("create, update then read item", async function() {
		var op;
		var req;
		var newKey;
		var createValues = {
			name: 'Sam',
			phone: '0333 777777'
		};
		var updateValues = {
			phone: '0444 444444'
		};
		var combinedValues = _.extend({},createValues,updateValues);
    var response = await this.kojac.create({waiters: createValues}).request();
    req = response.request;
    op = response.ops[0];
    newKey = op.result_key;
    response = await this.kojac.update([newKey,updateValues]).request();

    op = response.ops[0];
    expect(op.result_key).to.equal(newKey);
    expect(op.result().name).to.equal(combinedValues.name);
    expect(op.result().phone).to.equal(combinedValues.phone);
    expect(op.result() instanceof Waiter).to.be.true;
    response = await this.kojac.read(newKey).request();

    op = response.ops[0];
    expect(op.result_key).to.equal(newKey);
    expect(op.result().name).to.equal(combinedValues.name);
    expect(op.result().phone).to.equal(combinedValues.phone);
    expect(op.result() instanceof Waiter).to.be.true;
	});

	it("create and then destroy item", async function() {
		var op;
		var req;
		var newKey;
		var createValues = {
			name: 'John',
			phone: '0412 123456'
		};

    var response = await this.kojac.create({waiters: createValues}).request();
    req = response.request;

    newKey = response.ops[0].result_key;
    expect(this.kojac.cache[newKey]).to.not.be.undefined;
    response = await this.kojac.destroy(newKey).request();

    expect(this.kojac.cache[newKey]).to.be.undefined;
    response = await this.kojac.read(newKey).request();

    op = response.ops[0];
    expect(op.result_key).to.equal(newKey);
    expect(this.kojac.cache[newKey]).to.be.undefined;
	});

});



