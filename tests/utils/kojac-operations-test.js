import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect,chai} from 'chai';

import Ember from 'ember';
import EmberObject from '@ember/object';

// import chaiSubset from 'npm:chai-subset';
// chai.use(chaiSubset);

import Kojac from 'ember-kojac/utils/Kojac';
import KojacCore from 'ember-kojac/utils/KojacCore';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
//import KojacRemoteProvider from 'ember-kojac/utils/KojacRemoteProvider';
import DummyRemoteProvider from 'ember-kojac/utils/DummyRemoteProvider';
import OpResponse from 'ember-kojac/utils/OpResponse';

import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';
//import KojacEmberModel from 'ember-kojac/utils/ember/KojacEmberModel';
import ManagedModel, { field } from 'ember-kojac/utils/ember/ManagedModel';

describe("Kojac Operations", function() {

	beforeEach(function () {
		this.cache = EmberObject.create();
		var factory = new KojacObjectFactory();
		factory.framework = EmberFramework.instance();
		factory.defaultClass = ManagedModel.extend({
      id: field(Number),
      description: field(String),
      qty: field(Number)
    });
		this.kojac = new KojacCore({
			framework: EmberFramework.instance(),
			cache: this.cache,
			apiVersion: 3,
			remoteProvider: new DummyRemoteProvider(),
			objectFactory: factory
		});
		this.kojac.remoteProvider.mockReadOperationHandler = function(aRequestOp) {
		  return new OpResponse({
        result_value: {
          id: 50,
          description: 'pencils',
          qty: 2
        }
			});
		};
	});

	it("try reading order_item__50", async function() {
		var op;
		var response = await this.kojac.read('order_item__50').request();
		var req = response.request;
		expect(req.ops).to.be.ok;
		expect(req.options).to.be.ok;
		expect(req.ops.length).to.equal(1);

		op = req.ops[0];
		expect(op.verb).to.equal('READ');
		expect(op.key).to.equal('order_item__50');
		//expect(op.result_key).to.equal(op.key);
		//expect(op.results).to.be.a('object');
		//expect(Object.keys(op.results)).to.eql(['order_item__50']);

    expect(response.ops[0].results.order_item__50 instanceof this.kojac.objectFactory.defaultClass);
    let props = EmberFramework.instance().getModelProperties(response.ops[0].results.order_item__50);
    expect(props).to.eql({
			id: 50,
			description: 'pencils',
			qty: 2
		});
	});
});



