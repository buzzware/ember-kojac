import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

export default class {

	/**
	 * Converts one or more keys, given in multiple possible ways, to a standard array of strings
	 * @param aKeys one or more keys eg. as array of strings, or single comma-separated list in a single string
	 * @return {Array} array of single-key strings
	 */
	static interpretKeys(aKeys) {
		if (_.isArray(aKeys))
			return aKeys;
		if (_.isString(aKeys))
			return aKeys.split(',');
		return [];
	}

	/**
	 * Convert object or array to [key1, value, key2, value]
	 * @param aKeyValues array or object of keys with values
	 * @return {Array} [key1, value, key2, value]
	 */
	static toKeyValueArray(aKeyValues) {
		if (_.isArray(aKeyValues)) {
			var first = aKeyValues[0];
			if (_.isArray(first))         // this style : [[key,value],[key,value]]
				return _.map(aKeyValues,function(o){ return _.flatten(o,true) });
			else if (_.isObject(first)) {   // this style : [{key: value},{key: value}]
				var result = [];
				for (var i=0; i<aKeyValues.length; i++)
					result.push(_.toPairs(aKeyValues[i]));
				return _.flatten(result);
			} else
				return aKeyValues;          // assume already [key1, value, key2, value]
		} else if (_.isObject(aKeyValues)) {
			return _.flatten(_.toPairs(aKeyValues),true); // this style : {key1: value, key2: value}
		} else
			return null;    // unrecognised input
	}

	// pass a copy aPropListFn aCopyFn when you have a complex object eg. ember class. It will not be passed on to recursive calls
	static toJsono(aValue,aOptions,aPropListFn,aCopyFn) {
		if (bf.isObjectStrict(aValue)) {
			if (!aPropListFn && !aCopyFn && ("toJsono" in aValue))
				aValue = aValue.toJsono(aOptions || {});
			else {
				var aDest = {};
				aOptions = _.clone(aOptions);
				var aProperties = aPropListFn ? aPropListFn(aValue) : aValue;    // may return an array of properties, or an object to use the keys from
				var aInclude = (aOptions && bf.removeKey(aOptions,'include')); // must be an array
				if (_.isString(aInclude))
					aInclude = aInclude.split(',');
				if (aInclude && aInclude.length) {
					if (_.isArray(aProperties))          //ensure aProperties is an array to add includes
						aProperties = _.clone(aProperties);
					else
						aProperties = _.keys(aProperties);
					for (var i=0;i<aInclude.length;i++)
						aProperties.push(aInclude[i]);
				}
				var aExclude = (aOptions &&  bf.removeKey(aOptions,'exclude'));  // must be an array
				if (_.isString(aExclude))
					aExclude = aExclude.split(',');
				var p;
				var v;
				if (_.isArray(aProperties)) {
					for (var j=0;j<aProperties.length;j++) {
						p = aProperties[j];
						if (aExclude && (aExclude.indexOf(p)>=0))
							continue;
						if (aCopyFn)
							aCopyFn(aDest,aValue,p,aOptions);
						else {
							aDest[p] = this.toJsono(aValue[p],aOptions);
						}
					}
				} else {  // properties is an object to use keys from
					for (p in aProperties) {
						if (aExclude && (aExclude.indexOf(p)>=0))
							continue;
						if (aCopyFn)
							aCopyFn(aDest,aValue,p,aOptions);
						else {
							aDest[p] = this.toJsono(aValue[p],aOptions);
						}
					}
				}
				aValue = aDest;
			}
		} else if (_.isArray(aValue)) {
			var result = [];
			for (var vi=0; vi<aValue.length; vi++)
				result.push(this.toJsono(aValue[vi],aOptions));
			aValue = result;
		} else if (_.isDate(aValue)) {
			aValue = aValue.toISOString();
		}
		return aValue;
	}

	// returns an id above the normal 32 bit range of rails but within the range of Javascript
	static createId() {
		return bf.randomIntRange(4294967296,4503599627370496); // 2**32 to 2**52 see http://stackoverflow.com/questions/9389315/cross-browser-javascript-number-precision
	}

	static timestamp() {
		return new Date().getTime();
	}

	static localDate(...args) {
		var d = Date.UTC(...args);
		d += 60000 * (new Date()).getTimezoneOffset();
		d = new Date(d);
		return d;
	}

	static resolvedPromise() {
		//var d = jQuery.Deferred();
		//return d.resolve.apply(d,arguments);
	}

	/*
	 * Global static function that combines a given array of values (any number of arguments) into a cache key string, joined by double-underscores
	 * @return {String} cache key
	 */
	static keyJoin() {
		var result = null;
		for (var i=0;i<arguments.length;i++) {
			var v = arguments[i];
			if (!v)
				return null;
			if (!result)
				result = v.toString();
			else
				result += '__' + v.toString();
		}
		return result;
	}

	static keySplit(aKey) {
		var r,ia,id,a;
		var parts = aKey.split('__');
		if (parts.length>=1)      // resource
			r = parts[0];
		else
			return [];
		var result = [r];
		if (parts.length<2)
			return result;
		ia = parts[1];
		parts = ia.split('.');
		if (parts.length>=1) {    // id
			id = parts[0];
			var id_as_i = Number(id); // !!! watch for Number('') => 0
			if (_.isFinite(id_as_i))
				id = id_as_i;
			result.push(id);
		}
		if (parts.length>=2) {    // association
			result.push(parts[1]);
		}
		return result;
	}

	static keyResource(aKey) {
		var parts = aKey.split('__');
		return parts[0];
	}

	static keyId(aKey) {
		var parts = aKey.split('__');
		return parts[1];
	}

	static isAClass(aInstanceOrClass) {
		return typeof (aInstanceOrClass.__proto__) === 'function';
	}

	static classIs(aClass,aSuperClass) {
		let curr = aClass;
		while (curr) {
			if (curr === aSuperClass)
				return true;
			curr = curr.__proto__;
		}
		return false;
	}

	static instanceIs(aInstance,aSuperClass) {
		var cls = (aInstance && aInstance.constructor);
		return cls && this.classIs(cls,aSuperClass);
	}

}
