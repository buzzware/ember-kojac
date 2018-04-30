Terms

* references to StandardException include any subclasses of StandardException
* classes are ProperCase'd
* instances are head-down camelCased

Description

* resources, like models are always singular and ProperCased eg. Post not posts
* references are always "<Resource>__<id>"
* the id may be a string
* the kojac verbs are :
	* CREATE, READ, UPDATE, DESTROY - normal CRUD
	* EXECUTE - for Remote Procedure Calls
	* ADD, REMOVE, REPLACE - for updating relationships without creating or destroying the records themselves
* collections are stored in the cache as an array of keys eg. "Post": ["Post__1","Post__2"]
* model attributes are snake_cased
* other model methods and properties are head-down camelCased 

Operations

* Operations may be processed in parallel (the default) or serial (if specified)
* KojacRequest.request() is an async function that either returns a KojacResponse when all operations have been completed, or throws a StandardException

Errors

* a kojacRequest.request() may throw a StandardException :
	* if there is a network or protocol error before any operations are processed
	* if an operation has an error that is deemed serious enough. The KojacResponse will be lost and latter or incomplete operations cancelled

* errors thrown by the underlying request process are handled by wrapping them in a StandardException (or subclass) using the inner property and either : 
	* storing them in the response.errors array
	* rejecting the KojacRequest with the StandardException


	