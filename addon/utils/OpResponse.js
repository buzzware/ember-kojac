//import _ from 'lodash';

/**
 * Represents a single Kojac operation ie. READ, WRITE, UPDATE, DELETE or EXECUTE
 * @class Kojac.Operation
 * @extends Kojac.Object
 */

export default class {

	constructor(properties = {}) {
		Object.assign(this,{
			response: null,
			index: null,
			//verb: null,
			//key: null,
			//value: undefined,
			results: null,
			result_key: null,
			//result: undefined,
			error: null         // set with some truthy error if this operation fails gently
			//fromCache: null     // null means not performed, true means got from cache, false means got from server. !!! Should split this into performed and fromCache
		},properties);
	}

	result() {
	  return this.results && this.result_key && this.results[this.result_key];
  }

}
