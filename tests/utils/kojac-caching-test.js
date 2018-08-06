import bf from 'ember-kojac/utils/BuzzFunctions';

//describe("Kojac Caching", function() {
//
//	beforeEach(function () {
//		this.cache = new Kojac.Cache();
//		this.kojac = new Kojac.Core({
//			cache: this.cache,
//			remoteProvider: new Kojac.RemoteProvider({useMockFileValues: true,mockFilePath: 'mockjson/'}),
//			apiVersion: 1
//		});
//	});
//
//	it("should return extra keys from a cacheRead that were returned from the server",function(){
//		var products_records = {  // this is the normal data to return when requesting 'products'
//			products: [1,2,3],
//			products__1: {
//				id: 1,
//				name: "Product One"
//			},
//			products__2: {
//				id: 2,
//				name: "Product Two"
//			},
//			products__3: {
//				id: 3,
//				name: "Product Three"
//			}
//		};
//		var products_server_response = _.clone(products_records);   // the contents of this var will be returned by the mock server
//		this.kojac.remoteProvider.mockReadOperationHandler = function(aOp) {  // this function acts as the server
//			switch (aOp.key) {
//				case 'products':
//					aOp.result_key = 'products';
//					aOp.results = _.extend(aOp.results,products_server_response);
//				break;
//			}
//		};
//		var readReq = this.kojac.readRequest('products');
//		waitsFor(function() { return readReq.isResolved(); }, "request done", 3000);
//		runs(function() {
//			expect(readReq.results).to.equal(products_records);      // should equal normal response
//			expect(this.kojac.cache.products).to.equal(products_records.products)
//			products_server_response = {};                          // kill server response - non-cache reads should return empty now
//			readReq = this.kojac.readRequest('products',{cacheResults: false}); // read from server to check this, and don't store result in cache
//		});
//		waitsFor(function() { return readReq.isResolved(); }, "request done", 3000);
//		runs(function() {
//			expect(readReq.results).to.equal({});                    // indeed, server now returns empty, but lets try cache
//			readReq = this.kojac.cacheReadRequest('products');      // read from cache
//			console.log('after cacheReadRequest');
//		});
//		waitsFor(function() { return readReq.isResolved(); }, "request done", 3000);
//		runs(function() {
//			expect(readReq.results).to.equal(products_records);      // should return original records - must be coming from cache not server
//		});
//	});
//
//	it("should return extra keys from a cacheRead that were returned from the server, using result_key",function(){
//		var products_records = {  // this is the normal data to return when requesting 'products'
//			products: [1,2,3],
//			products__1: {
//				id: 1,
//				name: "Product One"
//			},
//			products__2: {
//				id: 2,
//				name: "Product Two"
//			},
//			products__3: {
//				id: 3,
//				name: "Product Three"
//			}
//		};
//		var products_server_response = _.clone(products_records);   // the contents of this var will be returned by the mock server
//		this.kojac.remoteProvider.mockReadOperationHandler = function(aOp) {  // this function acts as the server
//			switch (aOp.key) {
//				case 'products':
//					if (aOp.result_key!==aOp.key)
//						products_server_response[aOp.result_key] = bf.removeKey(products_server_response,aOp.key);
//					aOp.results = _.extend(aOp.results,products_server_response);
//				break;
//			}
//		};
//		expect(_.keys(this.kojac.cache)).to.equal([]);
//		var readReq = this.kojac.readRequest('products',{result_key: 'products_latest'});
//		waitsFor(function() { return readReq.isResolved(); }, "request done", 3000);
//		runs(function() {
//			var expected = _.clone(products_records);
//			expected.products_latest = bf.removeKey(expected,'products');
//			expect(readReq.results).to.equal(expected);      // should equal normal response
//			expect(_.keys(this.kojac.cache).sort()).to.equal(['products__1','products__2','products__3','products_latest']);
//			products_server_response = {};                          // kill server response - non-cache reads should return empty now
//			readReq = this.kojac.readRequest('products',{cacheResults: false, result_key: 'products_latest'}); // read from server to check this, and don't store result in cache
//		});
//		waitsFor(function() { return readReq.isResolved(); }, "request done", 3000);
//		runs(function() {
//			expect(readReq.results).to.equal({});                    // indeed, server now returns empty, but lets try cache
//			readReq = this.kojac.cacheReadRequest('products',{result_key: 'products_latest'});      // read from cache
//		});
//		waitsFor(function() { return readReq.isResolved(); }, "request done", 3000);
//		runs(function() {
//			var expected = _.clone(products_records);
//			expected.products_latest = bf.removeKey(expected,'products');
//			expect(readReq.results).to.equal(expected);      // should return original records - must be coming from cache not server
//		});
//	});
//
//});
//
