import _ from 'lodash';
import jQuery from 'jquery';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import OpResponse from 'ember-kojac/utils/OpResponse';
import * as StandardExceptions from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
let StandardException = StandardExceptions.StandardException;

/**
 * A dummy RemoteProvider implementation for testing. Your own implementation, or a subclass of this may be used instead.
 * @class DummyRemoteProvider
 * @extends Kojac.Object
 */
export default class {

	// probably wrap exception from aAjaxError in StandardException and throw
	handleAjaxError(aAjaxError) {
		var e = new StandardException(aAjaxError.message);
		e.inner = aAjaxError;
		//e.status = ?
		throw e;
	}

	// either return a value for data (if harmless) or fire a StandardException (serious)
	handleDataError(aDataError) {
		return aDataError;
		//throw new StandardException('data error',400,null,aDataError);
	}

	async doAjaxRequest(aPath,aPars) {  // can await
		var [result,status,xhr] = await this.nonRejectingAjaxRequest(aPath, aPars);
		var status_code = (xhr && xhr.status);
		if (status_code==200 || status_code==201) {
			if (result instanceof Error)
				throw new StandardException(result.message,400,result);
			return result;
		} else {
			// handle http error
			var resultError = this.interpretXhrError(xhr);
			if (status == "parsererror") {
				resultError.http_code = 500;
				resultError.kind = "parserError";
				resultError.message = "A data error occurred (parserError)";
				resultError.debug_message = (result && result.message);
			}
			resultError.headers = xhr.getAllResponseHeaders();
			resultError.response = xhr.responseText;
			var c = StandardExceptions.classForStatusCode(resultError.http_code);
			var e = new c();
			e.message = resultError.message;
			e.data = resultError;
			throw e;
		}
	}

	nonRejectingAjaxRequest(aPath,aPars) {  // can await
		return new Promise(function(resolve, reject) {
			jQuery.ajax(aPath,aPars).done(function(aResult,aStatus,aXhr){
				resolve([aResult,aStatus,aXhr]);
			}).fail(function(aXhr,aStatus,aError){
				resolve([aError,aStatus,aXhr]);       // never reject
			});
		});
	}

	interpretXhrError(aXhr) {
		var http_code = null;
		var kind = null;
		var message = null;
		var debug_message = null;
		var response = null;
		var headers = null;
		http_code = (aXhr && aXhr.status);
		if (http_code) {
			kind = (aXhr.statusText && aXhr.statusText.replace(' ',''));
			message = debug_message = aXhr.statusText;
		} else {
			http_code = null;
			kind = "NetworkError";
			message = "Failed to connect. Please check network or try again";
			debug_message = "Network connection failed";
		}
		return {
			format: 'KojacError',
			http_code: http_code,   // a valid HTTP status code, or null
			kind: kind,             // CamelCase text name of error, for conditional code handling
			message: message,       // an explanation for normal humans
			debug_message: debug_message, // an explanation for developers
			xhr: aXhr  // the original XHR object from jQuery
		}
	}
}
