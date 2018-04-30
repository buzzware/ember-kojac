import StandardException from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
import * as StandardExceptions from 'ember-kojac/utils/standard_exceptions/StandardExceptions';

export class BadRequest extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || BadRequest.MESSAGE,status || BadRequest.STATUS,inner);
	}
}
BadRequest.MESSAGE = 'The request was not processed due to a syntax error.';
BadRequest.STATUS = 400;
StandardExceptions.register(BadRequest,true);

export class Unauthorized extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || Unauthorized.MESSAGE,status || Unauthorized.STATUS,inner);
	}
}
Unauthorized.MESSAGE = 'The request was not processed because it lacked acceptable authentication credentials.';
Unauthorized.STATUS = 401;
StandardExceptions.register(Unauthorized,true);

//#PaymentRequired	402

export class Forbidden extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || Forbidden.MESSAGE,status || Forbidden.STATUS,inner);
	}
}
Forbidden.MESSAGE = 'The server understood the request but refuses to authorize it.';
Forbidden.STATUS = 403;
StandardExceptions.register(Forbidden,true);

export class NotFound extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || NotFound.MESSAGE,status || NotFound.STATUS,inner);
	}
}
NotFound.MESSAGE = 'The server did not find the requested resource.';
NotFound.STATUS = 404;
StandardExceptions.register(NotFound,true);

//# MethodNotAllowed	405
//# NotAcceptable	406
//# ProxyAuthenticationRequired	407
//# RequestTimeout	408
//# Conflict	409
//# Gone	410
//# LengthRequired	411
//# PreconditionFailed	412
//# RequestEntityTooLarge	413
//# RequestURITooLong	414
//# UnsupportedMediaType	415
//# RequestedRangeNotSatisfiable	416
//# ExpectationFailed	417

export class UnprocessableEntity extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || UnprocessableEntity.MESSAGE,status || UnprocessableEntity.STATUS,inner);
	}
}
UnprocessableEntity.MESSAGE = 'The server understands the request but was unable to process it.';
UnprocessableEntity.STATUS = 422;
StandardExceptions.register(UnprocessableEntity,true);

//# Locked	423
//# FailedDependency	424
//# UpgradeRequired	426

export class InternalServerError extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || InternalServerError.MESSAGE,status || InternalServerError.STATUS,inner);
	}
}
InternalServerError.MESSAGE = 'The server encountered an unexpected condition that prevented it from fulfilling the request.';
InternalServerError.STATUS = 500;
StandardExceptions.register(InternalServerError,true);

export class NotImplemented extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || NotImplemented.MESSAGE,status || NotImplemented.STATUS,inner);
	}
}
NotImplemented.MESSAGE = 'The server has not yet implemented that function.';
NotImplemented.STATUS = 501;
StandardExceptions.register(NotImplemented,true);

export class BadGateway extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || BadGateway.MESSAGE,status || BadGateway.STATUS,inner);
	}
}
BadGateway.MESSAGE = 'There was a problem reaching the server.';
BadGateway.STATUS = 502;
StandardExceptions.register(BadGateway,true);

export class ServiceUnavailable extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || ServiceUnavailable.MESSAGE,status || ServiceUnavailable.STATUS,inner);
	}
}
ServiceUnavailable.MESSAGE = 'The server is not currently available.';
ServiceUnavailable.STATUS = 503;
StandardExceptions.register(ServiceUnavailable,true);

export class GatewayTimeout extends StandardException {
	constructor(message=null,status=null,inner=null) {
		super(message || GatewayTimeout.MESSAGE,status || GatewayTimeout.STATUS,inner);
	}
}
GatewayTimeout.MESSAGE = 'The gateway did not respond in time. Try again later.';
GatewayTimeout.STATUS = 504;
StandardExceptions.register(GatewayTimeout,true);

//# HTTPVersionNotSupported	505
//# InsufficientStorage	507
//# NotExtended	510
//
