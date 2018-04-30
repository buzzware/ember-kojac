// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
// https://www.npmjs.com/package/custom-error-generator
// https://www.npmjs.com/package/brinkbit-custom-errors
// https://www.npmjs.com/package/error
// https://www.loggly.com/blog/node-js-error-handling/
// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
// https://github.com/WebReflection/classtrophobic/
// https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel
// http://borgs.cybrilla.com/tils/custom-exceptions-es6/
// https://www.npmjs.com/package/babel-plugin-transform-es2015-classes






// BEGIN from https://github.com/brillout/extendable-error-class/blob/master/dist/index.es5.js

//"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
    function ExtendableBuiltin() {
        var instance = Reflect.construct(cls, Array.from(arguments));   // needs in .eslintrc globals:{ "Reflect": false }
        Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
        return instance;
    }

    ExtendableBuiltin.prototype = Object.create(cls.prototype, {
        constructor: {
            value: cls,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(ExtendableBuiltin, cls);
    } else {
        ExtendableBuiltin.__proto__ = cls;
    }

    return ExtendableBuiltin;
}

//export function ExtendableError(_extendableBuiltin2) {
var ExtendableError = function (_extendableBuiltin2) {
    _inherits(ExtendableError, _extendableBuiltin2);

    function ExtendableError(message) {
        _classCallCheck(this, ExtendableError);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExtendableError).call(this, message));

        _this.name = _this.constructor.name;
        _this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(_this, _this.constructor);
        } else {
            _this.stack = new Error(message).stack;
        }
        return _this;
    }

    return ExtendableError;
}(_extendableBuiltin(Error));

//module.exports = ExtendableError;

// END from https://github.com/brillout/extendable-error-class/blob/master/dist/index.es5.js







// BEGIN https://raw.githubusercontent.com/fresheneesz/proto/master/proto.js
//"use strict";
/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

//var noop = function() {}
//
//var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
//function proto() {
//	var ProtoObjectFactory;
//	var prototypeBuilder;
//	var parent;
//	var args = arguments; // minifiable variables
//
//    if(args.length == 1) {
//      parent = {init: noop}
//	    prototypeBuilder = args[0];
//    } else { // length == 2
//	    parent = args[0];
//	    prototypeBuilder = args[1]
//    }
//
//    // special handling for Error objects
//    var namePointer = {}    // name used only for Error Objects
//    if([Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].indexOf(parent) !== -1) {
//        parent = normalizeErrorObject(parent, namePointer)
//    }
//
//    // set up the parent into the prototype chain if a parent is passed
//    var parentIsFunction = typeof(parent) === "function"
//    if(parentIsFunction) {
//        prototypeBuilder[prototypeName] = parent[prototypeName]
//    } else {
//        prototypeBuilder[prototypeName] = parent
//    }
//
//    // the prototype that will be used to make instances
//    var prototype = new prototypeBuilder(parent)
//    namePointer.name = prototype.name
//
//    // if there's no init, assume its inheriting a non-proto class, so default to applying the superclass's constructor.
//    if(!prototype[init] && parentIsFunction) {
//        prototype[init] = function() {
//            parent.apply(this, arguments)
//        }
//    }
//
//    // constructor for empty object which will be populated via the constructor
//    var F = function() {}
//        F[prototypeName] = prototype    // set the prototype for created instances
//
//    var constructorName = prototype.name?prototype.name:''
//    if(prototype[init] === undefined || prototype[init] === noop) {
//        ProtoObjectFactory = new Function('F',
//            "return function " + constructorName + "(){" +
//                "return new F()" +
//            "}"
//        )(F)
//    } else {
//        // dynamically creating this function cause there's no other way to dynamically name a function
//	    ProtoObjectFactory = new Function('F', 'i', 'u', 'n', // shitty variables cause minifiers aren't gonna minify my function string here
//		    "return function " + constructorName + "(){ " +
//		    "var x=new F(),r=i.apply(x,arguments)\n" +    // populate object via the constructor
//		    "if(r===n)\n" +
//		    "return x\n" +
//		    "else if(r===u)\n" +
//		    "return n\n" +
//		    "else\n" +
//		    "return r\n" +
//		    "}"
//	    )(F, prototype[init], proto[protoUndefined]); // note that n is undefined
//    }
//
//	prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype
//
//    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
//    for(let n in prototype) {
//        addProperty(ProtoObjectFactory, prototype, n)
//    }
//
//    // add properties from parent that don't exist in the static class object yet
//    for(let n in parent) {
//        if(ownProperty.call(parent, n) && ProtoObjectFactory[n] === undefined) {
//            addProperty(ProtoObjectFactory, parent, n)
//        }
//    }
//
//    ProtoObjectFactory.parent = parent;            // special parent property only available on the returned proto class
//    ProtoObjectFactory[prototypeName] = prototype  // set the prototype on the object factory
//
//    return ProtoObjectFactory;
//}
//
//proto[protoUndefined] = {} // a special marker for when you want to return undefined from a constructor
//
////module.exports = proto
//
//function normalizeErrorObject(ErrorObject, namePointer) {
//    function NormalizedError() {
//        var tmp = new ErrorObject(arguments[0])
//        tmp.name = namePointer.name
//
//        this.message = tmp.message
//        if(Object.defineProperty) {
//            /*this.stack = */Object.defineProperty(this, 'stack', { // getter for more optimizy goodness
//                get: function() {
//                    return tmp.stack
//                },
//                configurable: true // so you can change it if you want
//            })
//        } else {
//            this.stack = tmp.stack
//        }
//
//        return this
//    }
//
//    var IntermediateInheritor = function() {}
//        IntermediateInheritor.prototype = ErrorObject.prototype
//    NormalizedError.prototype = new IntermediateInheritor()
//
//    return NormalizedError
//}
//
//function addProperty(factoryObject, prototype, property) {
//    try {
//        var info = Object.getOwnPropertyDescriptor(prototype, property)
//        if(info.get !== undefined || info.get !== undefined && Object.defineProperty !== undefined) {
//            Object.defineProperty(factoryObject, property, info)
//        } else {
//            factoryObject[property] = prototype[property]
//        }
//    } catch(e) {
//        // do nothing, if a property (like `name`) can't be set, just ignore it
//    }
//}
// END https://raw.githubusercontent.com/fresheneesz/proto/master/proto.js

export class StandardException extends ExtendableError {

	constructor(message=null,status=null,inner=null,data=null) {
		super(message || StandardException.MESSAGE);
		this.name = this.constructor.name;
		this.human_name = this.name.split(/(?=[A-Z])/).join(' ');

		this.status = status || StandardException.STATUS;
		this.inner = inner;
		this.data = data;
	}
}
StandardException.MESSAGE = 'An error occurred that could not be identified';
StandardException.STATUS = 500;
//For IE too
//StandardException.prototype = Error.prototype;

//var StandardException = proto(Error, function(superclass) {
//    this.name = 'StandardException';
//
//    this.init = function(message, status, inner) {
//      superclass.call(this, message || StandardException.MESSAGE);
//      this.status = status || StandardException.STATUS;
//      this.inner = inner || null;
//    }
//});
//StandardException.MESSAGE = 'An error occurred that could not be identified';
//StandardException.STATUS = 500;

//export function declareException(aName,aSubclass,aMessage,aStatus) {
//	var result = proto(aSubclass, function(superclass) {
//	    this.name = aName;
//
//	    this.init = function(message, status, inner) {
//	      superclass.call(this, message || aMessage);
//		    if (message || aMessage)
//		      this.message = message || aMessage;
//	      this.status = status || aStatus;
//	      this.inner = inner || null;
//	    }
//	});
//	result.MESSAGE = aMessage;
//	result.STATUS = aStatus;
//	return result;
//}
//
//var StandardException = declareException('StandardException',Error,'An error occurred that could not be identified',500);

let allExceptions = [];
let exceptionsForCodes = {};

export function register(aExceptionClass,aForCode=false) {
	if (allExceptions.indexOf(aExceptionClass)>=0)
		return;
	allExceptions.push(aExceptionClass);
	if (aForCode)
		exceptionsForCodes[aExceptionClass.STATUS] = aExceptionClass;
}

export function classForStatusCode(aStatusCode) {
	var result = exceptionsForCodes[aStatusCode];
	if (!result)
		result = StandardException;
	return result;
}

register(StandardException);

export default StandardException;
