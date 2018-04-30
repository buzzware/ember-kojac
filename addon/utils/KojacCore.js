import _ from 'lodash';

import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacRequest from 'ember-kojac/utils/KojacRequest';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacResponse from 'ember-kojac/utils/KojacResponse';
import DefaultFramework from 'ember-kojac/utils/DefaultFramework';
import * as StandardExceptions from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
let StandardException = StandardExceptions.StandardException;


/**
 * The Kojac core object
 * @class KojacCore
 * @extends Kojac.Object
 *
 * Normal API V2 Usage
 *
 * App = {};
 * App.cache = {};
 * App.kojac = new KojacCore({
 *  remoteProvider: ...,
 *  cache: App.cache
 * });
 *
 * App.kojac.read('products').done(...);
 * App.kojac.chain().create('products').execute('refresh').request(function(aKR){   // using optional done handler
 *   // handle done here
 * }).fail(function(aKR){
 *   // handle fail here
 * });
 *
 * Old API V1 usage
 *
 * App = {};
 * App.cache = {};
 * App.kojac = new KojacCore({
 *  remoteProvider: ...,
 *  cache: App.cache,
 *  apiVersion: 1
 * });
 *
 * App.kojac.readRequest('products').done(...);
 * App.kojac.create('products').execute('refresh').request().done(function(aKR){
 *   // handle done here
 * }).fail(function(aKR){
 *   // handle fail here
 * });
 *
 */

export default class {

	// see https://stackoverflow.com/questions/31342290/es6-classes-default-value
	constructor(options = {}) {
		Object.assign(this,{
			framework: null,
			remoteProvider: null,
			objectFactory: null,
			cache: null,
			//errorHandler: null,
			dependentKeys: {},
			apiVersion: 3      // set this to 1 for old read() and readRequest()
		},options);
		if (!this.framework)
			this.framework = new DefaultFramework();
	}

	newRequest(aOptions) {
		if (!aOptions)
			aOptions = {};
		aOptions = _.extend(aOptions, {kojac: this});
		if (!(this.chaining in aOptions)) {
			aOptions.chaining = this.apiVersion != 2
		}
		return new KojacRequest(aOptions);
	}


//			var v;
//			for (var i=0;i<aRequest.ops.length;i++) {
//				var op = aRequest.ops[i];
//				if (op.error)
//					break;
//				if (op.options.cacheResults===false)
//					continue;
//				for (p in op.results) {
//					if (p==op.result_key)
//						continue;
//					v = op.results[p];
//					if (v===undefined)
//						delete this.cache[p];
//					else
//						this.cache[p] = op.results[p];
//				}
//				v = op.results[op.result_key];
//				if (v===undefined) {
//					delete this.cache[op.result_key];
//				} else {
//					this.cache[op.result_key] = v;
//				}
//				console.log('end of loop');
//			}

	handleResults(aResponse) {
		var aRequest = aResponse.request;

		if (aResponse.ops && !aResponse.hasError()) {

			var updatedObjects = [];

			this.framework.beginPropertyChanges(this.cache);
			try {
				for (let i = 0; i < aResponse.ops.length; i++) {
					var response_op = aResponse.ops[i];
					var request_op = aRequest.ops[i];
					var results = response_op.results;

					for (var key in results) {
						var value = results[key];
						if ((request_op.options.atomise !== false) && bf.isObjectStrict(value)) {  // we are atomising and this is an object
							var existing = this.framework.cacheGet(this.cache, key);
							var doUpdate = false; // don't update until we have a model mutable switch
							//var doUpdate = bf.isObjectStrict(existing) && (op.options.cacheResults !== false);  // update if object is already in cache, and we are caching
							if (doUpdate) {
								this.framework.beginPropertyChanges(existing);
								updatedObjects.push(existing);
								if (existing.setProperties)
									existing.setProperties(value);
								else
									_.copyProperties(existing, value);
								value = existing;
							} else { // otherwise manufacture a new object from values
								if ((request_op.options.manufacture !== false) && (this.objectFactory)) {
									// if primary key & reassigned by result_key then manufacture with original key
									var mkey = key;   // use the key from results by default
									if (key === request_op.result_key) {  // this is the result key, so may have been renamed
										var has_dot = request_op.key.indexOf('.') >= 0; // prefer original key unless it contains a dot
										if (!has_dot)
											mkey = request_op.key;
									}
									value = this.objectFactory.manufacture(value, mkey);
									if (value) {
                    this.framework.set(value,'_cache',this.cache);
                  }
								}
							}
						}
						results[key] = value;
						if (request_op.options.cacheResults !== false)
							this.framework.cacheSet(this.cache, key, value);
					}
				}
			} finally {
				for (let i=0;i<updatedObjects.length;i++)
					this.framework.endPropertyChanges(updatedObjects[i]);
			}
			this.framework.endPropertyChanges(this.cache);
		}
	}

	//finaliseResponse(aResponse) {
	//	var aRequest = aResponse.request;
	//	// set convenience properties
	//	var results = {};
	//	var hasError = aResponse.hasError();
	//	if (hasError) {
	//
	//	} else {
	//
	//	}
	//
	//
	//	if (!hasError) for (var i=0;i<aRequest.ops.length;i++) {
	//		var op = aRequest.ops[i];
	//		//if (op.error) {
	//		//	if (!aRequest.error)
	//		//		aRequest.error = op.error;
	//		//	break;
	//		//}
	//		_.extend(results,aResponse.results[i]);
	//		//op.result = !op.error && op.results && (op.result_key || op.key) ? op.results[op.result_key || op.key] : null;
	//		//if (i===0) {
	//		//	aRequest.op = op;
	//		//}
	//    //if ((aResponse.performed(i)) && (op.fromCache===false) && (op.options.cacheResults!==false)) {
	//	   // var ex_key = (op.result_key || op.key);
	//	   // var dep_keys = [];
	//	   // for (var p in op.results) {
	//		 //   if (p===ex_key)
	//		 //     continue;
	//		 //   dep_keys.push(p);
	//	   // }
	//	   // if (!dep_keys.length) {
	//	   //   if (op.key in aRequest.kojac.dependentKeys)
	//	   //     delete aRequest.kojac.dependentKeys[op.key];
	//		 // } else {
	//    //    aRequest.kojac.dependentKeys[op.key] = dep_keys
	//	   // }
	//    //}
	//	}
	//	if (hasError) {
	//		aResponse.results = null;
	//		//bf.removeKey(aResponse,'results');
	//		//bf.removeKey(aRequest,'result');
	//	} else {
	//		aResponse.results[i] = results;
	//	}
	//}

	async performRequest(aRequest) {
		var response = new KojacResponse(aRequest);

		// perhaps should be in a KojacRequest.clean() method
		for (let i=0;i<aRequest.ops.length;i++) {
			var op = aRequest.ops[i];
			op.index = i;
		}

		//for (var i=0;i<aRequest.ops.length;i++) {
		//	var op = aRequest.ops[i];
		//	op.index = i;
		//	//var op_results = response.results[i] = {};
		//
		//	// don't cache for now
		//	//var k = (op.result_key && (op.result_key !== op.key)) ? op.result_key : op.key;
		//	//var cacheValue = aRequest.kojac.framework.cacheGet(this.cache,k);
		//	//if ((op.verb=='READ') && op.options.preferCache && (cacheValue!==undefined)) {   // resolve from cache
		//	//	op_results[k] = cacheValue;
		//	//	var dep_keys = aRequest.kojac.dependentKeys[op.key];
		//	//	if (dep_keys) {
		//	//		for (var ki=0;ki<dep_keys.length;ki++) {
		//	//			var dk = dep_keys[ki];
		//	//			// what if not in cache? perhaps dump siblings in dependentKeys and index key to cause full refresh? or refuse to remove from cache if in dependentKeys
		//	//			op_results[dk] = aRequest.kojac.framework.cacheGet(this.cache,dk);
		//	//		}
		//	//	}
		//	//	op.result_key = k;
		//	//	op.fromCache = true;
		//	//	op.performed = true;
		//	//}
		//}
		try {
			for (var i = 0; i < aRequest.ops.length; i++) {
				let request_op = aRequest.ops[i];
				if (response.performed(i))
					continue;
        let op_response = await this.remoteProvider.handleRequestOp(request_op);
        op_response.index = i;
        op_response.response = response;
				response.ops[i] = op_response;
			}
			await this.handleResults(response);
		}
		catch(e) {
			if (KojacUtils.instanceIs(e,StandardException))
				throw e;
			else {
				throw this.wrapInStandardException(e);
			}
		}
		//finally {
		//	this.finaliseResponse(response);
		//}
		return response;
	}

	wrapInStandardException(aException) {
		return new StandardException(aException.message,400,aException);
	}

	// BEGIN User Functions

	// These functions enable the user to build and trigger requests to the server/remote provider

	chain() {
		return this.newRequest({chaining: true});
	}

	create(aKeyValues,aOptions) {
		var req = this.newRequest();
		return req.create(aKeyValues,aOptions);
	}

	read(aKeys,aOptions) {
		var req = this.newRequest();
		return req.read(aKeys,aOptions);
	}

	cacheRead(aKeys,aOptions) {
		aOptions = _.extend({},aOptions,{preferCache: true});
		return this.read(aKeys,aOptions);
	}

	update(aKeyValues,aOptions) {
		var req = this.newRequest();
		return req.update(aKeyValues,aOptions);
	}

	destroy(aKeys,aOptions) {
		var req = this.newRequest();
		return req.destroy(aKeys,aOptions);
	}

	execute(aKey,aValue,aOptions) {
		var req = this.newRequest();
		return req.execute(aKey,aValue,aOptions);
	}

	collectIds(aPrefix,aIds,aFilterFn) {
		if (!aIds)
			return [];
		var result = [];
		var item;
		for (var i=0;i<aIds.length;i++) {
			//item = aCache.get(aPrefix+'__'+aIds[i]);
			item = this.framework.cacheGet(this.cache,aPrefix+'__'+aIds[i]);
			if (!aFilterFn || aFilterFn(item))
				result.push(item);
		}
		return result;
	}

	// END Convenience Functions

	//createRequest(aKeyValues,aOptions) {
	//	//if (this.apiVersion > 1)
	//	//	throw "*Request methods are deprecated, and only supported when apiVersion is 1";
	//	return this.create(aKeyValues,aOptions).request();
	//}
	//
	//readRequest(aKeys,aOptions) {
	//	//if (this.apiVersion > 1)
	//	//	throw "*Request methods are deprecated, and only supported when apiVersion is 1";
	//	return this.read(aKeys,aOptions).request();
	//}
	//
	//cacheReadRequest(aKeys,aOptions) {
	//	//if (this.apiVersion > 1)
	//	//	throw "*Request methods are deprecated, and only supported when apiVersion is 1";
	//	aOptions = _.extend({},aOptions,{preferCache: true});
	//	return this.read(aKeys,aOptions).request();
	//}
	//
	//updateRequest(aKeyValues,aOptions) {
	//	//if (this.apiVersion > 1)
	//	//	throw "*Request methods are deprecated, and only supported when apiVersion is 1";
	//	return this.update(aKeyValues,aOptions).request();
	//}
	//
	//destroyRequest(aKeys,aOptions) {
	//	//if (this.apiVersion > 1)
	//	//	throw "*Request methods are deprecated, and only supported when apiVersion is 1";
	//	return this.destroy(aKeys,aOptions).request();
	//}
	//
	//executeRequest(aKey,aValue,aOptions) {
	//	//if (this.apiVersion > 1)
	//	//	throw "*Request methods are deprecated, and only supported when apiVersion is 1";
	//	return this.execute(aKey,aValue,aOptions).request();
	//}
}
