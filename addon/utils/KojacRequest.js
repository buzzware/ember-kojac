import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacOperation from 'ember-kojac/utils/KojacOperation';

/**
 * Represents a single Kojac request, analogous to a HTTP request. It may contain 1 or more operations
 * @class KojacRequest
 */
export default class {

	constructor(options = {}) {
		Object.assign(this,{
			kojac: null,
			chaining: true,
			options: {},
			ops: [],
			//op: null,
			//result: undefined,
			//results: null,
			//error: null        // set with some truthy value if this whole request or any operation fails (will contain first error if multiple)
		},options);
	}


	newOperation() {
		var obj = new KojacOperation({request: this});
		if (this.ops.length===0)
			this.op = obj;
		this.ops.push(obj);
		return obj;
	}

	//handleError(aResponse,aError) {
		// on aResponse set errors = [] and set right position to error exception
		// reject response
		// from HandlerStack :
		//this.context.error = aError;
		//this.deferred.reject(this.context);
	//}

	// {key: value} or [{key1: value},{key2: value}] or {key1: value, key2: value}
	// Can give existing keys with id, and will create a clone in database with a new id
	create(aKeyValues,aOptions) {

		var result_key = (aOptions && bf.removeKey(aOptions,'result_key'));
		var params = (aOptions && bf.removeKey(aOptions,'params'));  // extract specific params
		var options = _.extend({cacheResults: true, manufacture: true},aOptions || {});

		var kvArray = KojacUtils.toKeyValueArray(aKeyValues);
		for (var i=0;i<kvArray.length-1;i+=2) {
			var k = kvArray[i];
			var v = kvArray[i+1];
			var op = this.newOperation();
			op.verb = 'CREATE';
			op.options = _.clone(options);
			op.params = (params && _.clone(params));
			var parts = KojacUtils.keySplit(k);
			if (parts.length >= 3)
				op.key = k;
			else
				op.key = KojacUtils.keyResource(k);
			if ((i===0) && result_key)
				op.result_key = result_key;
			op.value = KojacUtils.toJsono(v,op.options);
		}
		if (this.chaining)
			return this;
		else
			return this.request();
	}

	// !!! if aKeys is String, split on ',' into an array
	// known options will be moved from aOptions to op.options; remaining keys will be put into params
	read(aKeys,aOptions) {
		var keys = KojacUtils.interpretKeys(aKeys);
		var result_key = (aOptions && bf.removeKey(aOptions,'result_key'));  // extract result_key
		var params = (aOptions && bf.removeKey(aOptions,'params'));  // extract specific params
		var options = _.extend({cacheResults: true, manufacture: true},aOptions || {});
		var i = 0;
		for (let k of keys) {
			var op = this.newOperation();
			op.options = _.clone(options);
			op.params = (params && _.clone(params));
			op.verb = 'READ';
			op.key = k;
			if (i===0)
				op.result_key = result_key || k;
			else
				op.result_key = k;
			i += 1;
		}
		if (this.chaining)
			return this;
		else
			return this.request();
	}

	cacheRead(aKeys,aOptions) {
		aOptions = _.extend({},aOptions,{preferCache: true});
		return this.read(aKeys,aOptions);
	}

	update(aKeyValues,aOptions) {
		var result_key = (aOptions && bf.removeKey(aOptions,'result_key'));
		var options = _.extend({cacheResults: true, manufacture: true},aOptions || {});
		var params = (aOptions && bf.removeKey(aOptions,'params'));  // extract specific params
		var first=true;
		var kvArray = KojacUtils.toKeyValueArray(aKeyValues);
		for (var i=0;i<kvArray.length-1;i+=2) {
			var k = kvArray[i];
			var v = kvArray[i+1];
			var op = this.newOperation();
			op.verb = 'UPDATE';
			op.options = _.clone(options);
			op.params = (params && _.clone(params));
			op.key = k;
			if (first) {
				op.result_key = result_key || k;
				first = false;
			} else
				op.result_key = k;
			op.value = KojacUtils.toJsono(v,op.options);
		}
		if (this.chaining)
			return this;
		else
			return this.request();
	}

	destroy(aKeys,aOptions) {
		var keys = KojacUtils.interpretKeys(aKeys);
		var result_key = (aOptions && bf.removeKey(aOptions,'result_key'));
		var options = _.extend({cacheResults: true},aOptions || {});
		var params = (aOptions && bf.removeKey(aOptions,'params'));  // extract specific params
		var i = 0;
		for (let k of keys) {
			var op = this.newOperation();
			op.options = _.clone(options);
			op.params = (params && _.clone(params));
			op.verb = 'DESTROY';
			op.key = k;
			if (i===0)
				op.result_key = result_key || k;
			else
				op.result_key = k;
			i += 1;
		}
		if (this.chaining)
			return this;
		else
			return this.request();
	}

	execute(aKey,aValue,aOptions) {
		var op = this.newOperation();
		op.verb = 'EXECUTE';

		var params = (aOptions && bf.removeKey(aOptions,'params'));  // extract specific params
		op.result_key = (aOptions && bf.removeKey(aOptions,'result_key')) || aKey;
		op.options = _.extend({cacheResults: false, manufacture: false},aOptions || {});
		op.params = (params && _.clone(params));
		op.key = aKey;
		op.value = KojacUtils.toJsono(aValue,op.options);
		if (this.chaining)
			return this;
		else
			return this.request();
	}

	// returns KojacResponse
	async request() {
		return this.kojac.performRequest(this);
	}

	// returns result of the first operation. For collections, this would be an array of ids or keys
	async result() {
		let response = await this.kojac.performRequest(this);
		return response.result();
	}

	// returns result of the first operation, collected from the cache if it is an array of ids or keys
	async collect() {
    let response = await this.kojac.performRequest(this);
		let result = response.result();
		if (!_.isArray(result) || result.length===0)
			return result;
		var resource = response.request.ops[0].key;
		return this.kojac.collectIds(resource,result);
	}

	// returns the merged results of all operations. For collections, this would be an array of ids or keys
	async results() {
		let response = await this.kojac.performRequest(this);
		return response.error ? null : response.results;
	}

}
