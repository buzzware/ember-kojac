import _ from 'lodash';
import jQuery from 'jquery';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacStoreBase from 'ember-kojac/utils/KojacStoreBase';
import OpResponse from 'ember-kojac/utils/OpResponse';
import * as StandardExceptions from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
let StandardException = StandardExceptions.StandardException;

/**
 * A dummy RemoteProvider implementation for testing. Your own implementation, or a subclass of this may be used instead.
 * @class DummyRemoteProvider
 * @extends Kojac.Object
 */
export default class extends KojacStoreBase {

	constructor(options = {}) {
		super();
		Object.assign(this,{
			//useMockFileValues: false,
			mockFilePath: 'assets/mockjson/',
			mockReadOperationHandler: null,
			//serverPath: null,
			//timeout: 10000,
			mockWriteOperationHandler: null
		},options);
	}

	// return op_response
	async handleRequestOp(request_op) {
		//var aRequest = aResponse.request;
		//var result;
		//var request_op;
		var me = this;
		let op_response = null;
		if (request_op.verb === 'READ') {
			if (this.mockReadOperationHandler) {
				op_response = this.mockReadOperationHandler(request_op);
			} else {
				var fp = me.mockFilePath+request_op.key+'.json';
				var ajaxpars = {
					type: 'GET',
					//data: JSON.stringify(dataToSend),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					//context: aResponse
					timeout: me.timeout,
					cache: false
				};
				var result;
				//try {
					result = await me.doAjaxRequest(fp, ajaxpars);  // will only throw StandardExceptions
				//}
				//catch(ajaxError) {
				//	op_response = this.handleAjaxError(ajaxError);
				//}
				if (result) {
					let data = result;
					op_response = new OpResponse();
					for (var p in data) {
						switch(p) {
							case 'results':
								if (!op_response.results)
									op_response.results = {};
								for (let k in data.results) {
									if ((k===request_op.key) && (request_op.result_key!=request_op.key))
										op_response.results[request_op.result_key] = data.results[k];
									else
										op_response.results[k] = data.results[k];
								}
								break;
							case 'result_key':
								op_response.result_key = data[p];
								break;
							case 'error':
								op_response.error = this.handleDataError(data[p]);
								break;
						}
					}
				}
			}
		} else {
			if (this.mockWriteOperationHandler) {
				op_response = this.mockWriteOperationHandler(request_op);
			}
		}
		return op_response;
	}
}
