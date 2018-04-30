import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacOperation from 'ember-kojac/utils/KojacOperation';

/**
 * Represents the response for a KojacRequest
 * @class KojacResponse
 */
export default class {

	constructor(aRequest) {
		this.request = aRequest;
		this.ops = new Array(aRequest.ops.length);
		this.results = null;
		//this.errors = null;
		//this.results = new Array(aRequest.ops.length);      // probably cleared when complete, not for public use
		//this.result_keys = new Array(aRequest.ops.length);
		//this.all_keys = new Array(aRequest.ops.length);
	}

	// has this operation been performed?
	performed(aOpIndex) {
		return (this.ops[aOpIndex]!==undefined);
	}

	hasError() {
		return this.ops && _.some(this.ops,function(op) {return op && op.error;});
	}

	receiveResult(aOpIndex,aResults,aResultKey,aError) {
		var request_op = this.request.ops[aOpIndex];
		if (!aResults && !aError)
			aError = "no result";
		if (aError) {
			if (!this.errors)
				this.errors = new Array(this.request.ops.length);
			this.errors[aOpIndex] = aError;
			bf.removeKey(this,'results');
		} else {
			var response_key = aResultKey || request_op.result_key || request_op.key;
			var final_result_key = request_op.result_key || response_key; // result_key should not be specified unless trying to override
			var results = bf.isObjectStrict(aResults) ? aResults : bf.createObject(response_key,aResults); // fix up server mistake
			var result;
			if (request_op.verb==='DESTROY')
				result = undefined;
			else
				result = results[response_key];

			results = _.omit(results,response_key); // results now excludes primary result
			if (!this.results[aOpIndex])
				this.results[aOpIndex] = {};
			_.extend(this.results[aOpIndex],results);   // store other results
			this.result_keys[aOpIndex] = final_result_key;
			this.results[aOpIndex][final_result_key] = result;  // store primary result
		}
	}

	allResults() {
		if (this.hasError())
			return null;
		var results = {};
		if (this.ops) for (let op of this.ops) {
			if (!op || !op.results)
				continue;
			_.extend(results,op.results);
		}
		return results;
	}

	result() {
    if (!this.ops || this.ops.length==0 || this.ops[0].error)
      throw new Error('An error occurred');
    var op = this.ops[0];
    return op.results[op.result_key];
  }

	//	var hasError = aResponse.hasError();
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
	//		bf.removeKey(aResponse,'results');
	//		//bf.removeKey(aRequest,'result');
	//	} else {
	//		aResponse.results[i] = results;
	//	}
	//
	//
	//
	//
	//}

}
