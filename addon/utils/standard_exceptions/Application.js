import StandardException from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
import * as StandardExceptions from 'ember-kojac/utils/standard_exceptions/StandardExceptions';
import {UnprocessableEntity} from 'ember-kojac/utils/standard_exceptions/Http';

export class Failed extends UnprocessableEntity {

	constructor(aMessage=null,status=null,inner=null) {
		super(aMessage || Failed.MESSAGE,status || Failed.STATUS,inner);
	}
}
Failed.MESSAGE = 'The requested operation was not successful.';
StandardExceptions.register(Failed);


export class ValidationFailed extends Failed {

	constructor(aMessage=null,status=null,inner=null) {
		super(aMessage || ValidationFailed.MESSAGE,status || ValidationFailed.STATUS,inner);
		this.errors = [];
	}
}
ValidationFailed.MESSAGE = 'The requested operation was not successful due to validation errors.';
StandardExceptions.register(ValidationFailed);
