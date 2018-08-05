import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect} from 'chai';

import Ember from 'ember';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacCore from 'ember-kojac/utils/KojacCore';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
import OpResponse from 'ember-kojac/utils/OpResponse';
import DummyRemoteProvider from 'ember-kojac/utils/DummyRemoteProvider';

import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';
import KojacEmberModel from 'ember-kojac/utils/ember/KojacEmberModel';

import StandardException from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
import * as SE from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
import {NotFound} from 'ember-kojac/utils/standard_exceptions/Http';

describe("Error Handling (requires web server)", function() {

	/*

	The API should work like this :

	try {
		var response = await kojac.read('products').request();
	}
	catch(e) {  // an exception only fires for unexpected problems ie not for 422's
		// e is a kind of StandardException
		// e.data is an object with error information
	}

	try {
		var result = await kojac.read('products').result();
		// do the next operation
	}
	catch(e) {  // an exception only fires for unexpected problems ie not for 422's
		// e is a kind of StandardException
		// e.data is an object with error information
	}

	*/


	it("handles not found", async function() {
		var App = {};
		App.cache = {};
		App.kojac = new KojacCore({
			cache: App.cache,
			apiVersion: 3,
			remoteProvider: new DummyRemoteProvider({
        mockFilePath: '/assets/mockjson/',
				timeout: 2000
			})
		});

		var response;
		try {
			response = await App.kojac.read(['clown']).request();
		}
		catch(e) {
			response = e;
		}
		expect(response instanceof NotFound).to.be.true;
		var ajaxError = response.data;
		expect(ajaxError).to.be.defined;
		expect(ajaxError.http_code).to.equal(404);
		expect(response.status).to.equal(404);
		expect(ajaxError.kind).to.equal('NotFound');
		expect(ajaxError.message).to.be.ok;
		expect(ajaxError.debug_message).to.be.ok;
		expect(ajaxError.xhr).to.be.ok;
		expect(ajaxError.headers).to.be.ok;
		expect(ajaxError.response).to.be.ok;
	});

	it("Handles application Error", async function(){
		var App = {};
		App.cache = {};
		App.kojac = new KojacCore({
			cache: App.cache,
			apiVersion: 3,
			remoteProvider: new DummyRemoteProvider({
				timeout: 2000
			})
		});
		App.kojac.remoteProvider.mockWriteOperationHandler = function(aOp) {
			return new OpResponse({
				error: {
					format: 'AppError',
					kind: 'ValidationError',
					errors: [{
						field: 'name',
						message: 'must be given'
					}]
				}
			});
		};
		var response = await App.kojac.execute(['calc']).request();
		var op = response.ops && response.ops[0];
		expect(op.error).to.be.defined;
		expect(op.results).to.be.null;
		expect(op.error).to.eql(
			{
				format: 'AppError',
				kind: 'ValidationError',
				errors: [{
					field: 'name',
					message: 'must be given'
				}]
			}
		);
	});
});
