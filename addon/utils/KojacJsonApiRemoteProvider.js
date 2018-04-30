//
//
//handleRequest(aResponse) {
//	var aRequest = aResponse.request;
//	var result;
//	var request_op;
//	var me = this;
//	for (var i = 0; i < aRequest.ops.length; i++) {
//		request_op = aRequest.ops[i];
//		if (aResponse.performed(i))
//			continue;
//		let response = null;
//		if (request_op.verb === 'READ' || request_op.verb === 'EXECUTE') {
//			if (this.mockReadOperationHandler) {
//				response = this.mockReadOperationHandler(request_op, aResponse);
//			} else {
//				var getMockFile = function(aResponse,aIndex) {
//					let promise = new Promise();
//					let request_op = aResponse.request.ops[aIndex];
//					var fp = me.mockFilePath+request_op.key+'.json';
//					//var data = null;
//
//					axios.get(fp, {
//					    //params: { },
//						//headers: {'X-Requested-With': 'XMLHttpRequest'},
//						//data: data,
//						timeout: me.timeout
//					}).then(function (response) {
//						//let request_op = this;
//						let result_op = new OpResponse();
//						let op_results = {};
//						let result_key = null;
//						let error = null;
//						let data = response.data;
//						for (var p in data) {
//							switch(p) {
//								case 'results':
//									for (let k in data.results) {
//										if ((k===request_op.key) && (request_op.result_key!=request_op.key))
//											op_results[request_op.result_key] = data.results[k];
//										else
//											op_results[k] = data.results[k];
//									}
//									break;
//								case 'result_key':
//									result_key = data[p];
//									break;
//								case 'error':
//									error = data[p];
//									break;
//							}
//						}
//						if (error)
//							promise.reject(error);
//						else {
//							result_op.result_key = result_key;
//							result_op.results = op_results;
//							promise.resolve(result_op);
//						}
//					}).catch(function (error) {
//						var e = new StandardException();
//						e.data = error;
//						promise.reject(e);
//					});
//					return promise;
//				};
//				var reqs = [];
//				for (var j=0;j<server_ops.length;j++) {
//					if (!server_ops[j])
//						continue;
//					reqs.push(getMockFile(aResponse,j));
//				}
//				return Promise.all(reqs);
//			}
//		} else {
//			if (this.mockWriteOperationHandler) {
//				response = this.mockWriteOperationHandler(request_op, aResponse);
//			}
//		}
//		if (response) {
//			aResponse.receiveResult(request_op.index, response.results, response.result_key, response.error || null);
//		}
//	}
//}
