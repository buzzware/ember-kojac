//import _ from 'lodash';
//import jQuery from 'jquery';
//import KojacUtils from 'ember-kojac/utils/KojacUtils';
//import * as StandardExceptions from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
//
///**
// * A default RemoteProvider implementation. Your own implementation, or a subclass of this may be used instead.
// * @class Kojac.RemoteProvider
// * @extends Kojac.Object
// */
//export default class {
//
//	constructor(options = {}) {
//		Object.assign(this,{
//			useMockFileValues: false,
//			mockFilePath: null,
//			mockReadOperationHandler: null,
//			serverPath: null,
//			timeout: 10000,
//			mockWriteOperationHandler: null
//		},options);
//	}
//
//	operationsToJson(aOps) {
//		var result = [];
//		for (var i=0;i<aOps.length;i++) {
//			var op = aOps[i];
//			var jsonOp = {
//				verb: op.verb,
//				key: op.key
//			};
//			if ((op.verb==='CREATE') || (op.verb==='UPDATE') || (op.verb==='EXECUTE')) {
//				jsonOp.value = KojacUtils.toJsono(op.value,op.options);
//			}
//			var options = (op.options && _.omit(op.options,['cacheResults','preferCache']));
//			if (options && !_.isEmpty(options))
//				jsonOp.options = options;   // omit local keys
//			jsonOp.params = op.params;
//			result.push(jsonOp);
//		}
//		return result
//	}
//
//	handleRequest(aResponse) {
//		var aRequest = aResponse.request;
//		var result;
//		var op;
//		var me = this;
//		for (var i=0;i<aRequest.ops.length;i++) {
//			op = aRequest.ops[i];
//			if (aResponse.performed(i))
//				continue;
//			if (op.verb==='READ' || op.verb==='EXECUTE') {
//				if (this.mockReadOperationHandler) {
//					result = this.mockReadOperationHandler(op,aResponse);
//					//op.performed = true;
//					//if (op.fromCache===null)
//					//	op.fromCache = false;
//					return result;
//				}
//			} else {
//				if (this.mockWriteOperationHandler) {
//					result = this.mockWriteOperationHandler(op,aResponse);
//					//op.performed = true;
//					//if (op.fromCache===null)
//					//	op.fromCache = false;
//					return result;
//				}
//			}
//		}
//		var server_ops = new Array(aRequest.ops.length);
//		for(let i=0;i<aRequest.ops.length;i++) {
//			server_ops[i] = aResponse.performed(i) ? null : aRequest.ops[i];
//		}
//		if (!_.some(server_ops,o => !!o))
//			return;
//		if (this.useMockFileValues) {
//			var getMockFile = function(aResponse,aIndex) {
//				let aRequest = aResponse.request;
//				let request_op = aRequest.ops[aIndex];
//				var fp = me.mockFilePath+request_op.key+'.json';
//				var data = null;
//				return jQuery.ajax({url: fp, dataType: 'json', cache: false, data: data, timeout: me.timeout, context: request_op}).done(
//					function( aData ) {
//						let request_op = this;
//						let op_results = {};
//						let result_key = null;
//						let error = null;
//						for (var p in aData) {
//							switch(p) {
//								case 'results':
//									for (let k in aData.results) {
//										if ((k===request_op.key) && (request_op.result_key!=request_op.key))
//											op_results[request_op.result_key] = aData.results[k];
//										else
//											op_results[k] = aData.results[k];
//									}
//									break;
//								case 'result_key':
//									result_key = aData[p];
//									break;
//								case 'error':
//									error = aData[p];
//									break;
//							}
//						}
//						if (error)
//							aResponse.receiveResult(aIndex,null,null,error);
//						else
//							aResponse.receiveResult(aIndex,op_results,result_key);
//						//this.fromCache = false;
//						//this.performed = true;
//					}
//				).fail(
//					function(jqXHR, textStatus) {
//						aResponse.receiveResult(aIndex,null,null,new Error(textStatus));
//					}
//				);
//			};
//			var reqs = [];
//			for (var j=0;j<server_ops.length;j++) {
//				if (!server_ops[j])
//					continue;
//				reqs.push(getMockFile(aResponse,j));
//			}
//			return jQuery.when.apply(jQuery,reqs);
//		} else {
//			var opsJson = this.operationsToJson(_.compact(server_ops));
//			var dataToSend = {
//				kojac: {
//					version: 'KOJAC-1.0',
//					ops: opsJson
//				}
//			};
//
//			var handleAjaxResponse = function(aResponse,aResult,aStatus,aXhr) {
//				var status_code = (aXhr && aXhr.status);
//				if (status_code==200 || status_code==201) {
//
//					if (aResult instanceof Error || aResult.error) { // new code returns errors without ops
//						let resultError = null;
//						if (aResult.error) {
//							resultError = aResult.error;
//						} else {
//							resultError = me.interpretXhrError(aXhr);
//							if (aStatus == "parsererror") {
//								resultError.http_code = 500;
//								resultError.kind = "parserError";
//								resultError.message = "A data error occurred (parserError)";
//								resultError.debug_message = aResult.message;
//							}
//						}
//						resultError.headers = aXhr.getAllResponseHeaders();
//						resultError.response = aXhr.responseText;
//
//						//for (var i=0;i<server_ops.length;i++) {
//						//	var opRequest = server_ops[i]; //aRequest.ops[request_op_index[i]];
//						//	opRequest.fromCache = false;
//						//	//opRequest.performed = true;
//						//}
//						aResponse.receiveResult(0,null,null,resultError);
//					} else {    // ops may have errors
//						// poke results into request ops using request_op_index
//						aResponse.xhr = aXhr;
//						for (var io=0;io<aResult.ops.length;io++) {
//							var resultOp = aResult.ops[io];
//							if (!resultOp) {
//								aResponse.receiveResult(resultOp.index,null,null,new StandardException('missing operation in results'));
//								break;
//							} else if (resultOp.error) {
//								let e = StandardExceptions.classForStatusCode(resultError.http_code,resultError.message,null,resultOp.error);
//								aResponse.receiveResult(resultOp.index,null,null,e);
//								break;
//							} else {
//								aResponse.receiveResult(resultOp.index,resultOp.results,resultOp.result_key);
//							}
//						}
//					}
//				} else {
//					// handle http error
//					resultError = me.interpretXhrError(aXhr);
//					if (aStatus == "parsererror") {
//						resultError.http_code = 500;
//						resultError.kind = "parserError";
//						resultError.message = "A data error occurred (parserError)";
//						resultError.debug_message = aResult.message;
//					}
//					resultError.headers = aXhr.getAllResponseHeaders();
//					resultError.response = aXhr.responseText;
//					var e = StandardExceptions.classForStatusCode(resultError.http_code,resultError.message,null,resultError);
//					aResponse.receiveResult(0,null,null,e);
//				}
//			};
//
//			// !!! might need to include X-CSRF-Token see http://stackoverflow.com/questions/8511695/rails-render-json-session-lost?rq=1
//			var ajaxpars = {
//				type: 'POST',
//				data: JSON.stringify(dataToSend),
//				contentType: "application/json; charset=utf-8",
//				dataType: "json",
//				//context: aResponse
//				timeout: 60000,
//				cache: false
//			};
//			return me.doAjaxRequest(this.serverPath,ajaxpars).then(
//				(args) => handleAjaxResponse(aResponse,...args)
//			).catch(
//				(args) => handleAjaxResponse(aResponse,...args)
//			);
//		}
//	}
//
//	// 				return jQuery.ajax({url: fp, dataType: 'json', cache: false, data: data, timeout: me.timeout, context: request_op}).done(
//
//
//
//	async doAjaxRequest(aPath,aPars) {
//		var result = new Promise();
//		jQuery.ajax(aPath,aPars).done(function(aResult,aStatus,aXhr){
//			result.resolve([aResult,aStatus,aXhr]);
//		}).fail(function(aXhr,aStatus,aError){
//			result.reject([aError,aStatus,aXhr]);
//		});
//		return result;
//	}
//
//	interpretXhrError(aXhr) {
//		var http_code = null;
//		var kind = null;
//		var message = null;
//		var debug_message = null;
//		var response = null;
//		var headers = null;
//		http_code = (aXhr && aXhr.status);
//		if (http_code) {
//			kind = (aXhr.statusText && aXhr.statusText.replace(' ',''));
//			message = debug_message = aXhr.statusText;
//		} else {
//			http_code = null;
//			kind = "NetworkError";
//			message = "Failed to connect. Please check network or try again";
//			debug_message = "Network connection failed";
//		}
//		return {
//			format: 'KojacError',
//			http_code: http_code,   // a valid HTTP status code, or null
//			kind: kind,             // CamelCase text name of error, for conditional code handling
//			message: message,       // an explanation for normal humans
//			debug_message: debug_message, // an explanation for developers
//			xhr: aXhr,  // the original XHR object from jQuery
//		}
//	}
//}
