import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';
import KojacUtils from 'ember-kojac/utils/KojacUtils';

class KojacTypes {

	/*
	 * Function used to determine the data type class of the given value
	 * @param {*} aValue
	 * @return {Class} eg. see Kojac.FieldTypes
	 */
	static getPropertyValueType(aValue) {
		var t = bf.typeOf(aValue);
		var result;
		switch(t) {
			case 'number':   // determine number or int
				result = (Math.floor(aValue) === aValue) ? this.Int : Number;
				break;
			default:
			case 'undefined':
			case 'null':
				result = this.Null;
				break;
			case 'string':
				result = String;
				break;
			case 'boolean':
				result = Boolean;
				break;
			case 'array':
				result = Array;
				break;
			case 'object':
				result = Object;
				break;
			case 'date':
				result = Date;
				break;
			case 'function':
			case 'class':
			case 'instance':
			case 'error':
				result = null;
				break;
		}
		return result;
	}


	/*
	 * Function used to interpret aValue as the given aDestType which is one of the supported data type classes
	 * @param {*} aValue any value
	 * @param {Class} aDestType Class used to interpret aValue
	 * @return {*} aValue interpreted as destination type
	 */
	static interpretValueAsType(aValue, aDestType) {
		var sourceType = this.getPropertyValueType(aValue);
		if (aDestType===sourceType)
			return aValue;
		switch (aDestType) {
			case this.Null:
				return aValue;
				break;
			case String:

				switch(sourceType) {
					case this.Int:
					case Number:
					case Boolean:
						return aValue.toString();
						break;
					case Date:
						return this.toISOString(aValue);
					default:
					case this.Null:
						return null;
						break;
				}

				break;
			case Boolean:
				return bf.toBoolean(aValue,null);
				break;

			case Number:

				switch(sourceType) {
					case this.Null:
					default:
						return null;
						break;
					case Boolean:
						return aValue ? 1 : 0;
						break;
					case this.Int:
						return aValue;
						break;
					case String:
						if (aValue.trim()=='')
							return null;
						var n = Number(aValue);
						return isFinite(n) ? n : null;
						break;
				}
				break;

			case this.Int:

				switch(sourceType) {
					case this.Null:
					default:
						return null;
						break;
					case Boolean:
						return aValue ? 1 : 0;
						break;
					case Number:
						return isFinite(aValue) ? Math.round(aValue) : null;
						break;
					case String:
						if (aValue.trim()=='')
							return null;
						var num = Number(aValue);
						return isFinite(num) ? Math.round(num) : null;
						break;
				}

				break;
			case Date:
				switch(sourceType) {
					case String:
						return this.ISO(aValue);
						break;
					case Number:
						return new Date(aValue);
						break;
					case this.Null:
					default:
						return null;
						break;
				}
				break;
			case Object:
				return null;
				break;
			case Array:
				return null;
				break;
		}
		return null;
	}

	/*
	 * Function used to read values from a given source object into the given destination object, using the given aDefinition
	 * @param {Object} aDestination
	 * @param {Object} aSource
	 * @param {Object} aDefinition
	 * @return {Object} aDestination object
	 */
	static readTypedProperties(aDestination, aSource, aDefinition) {
		for (var p in aSource) {
			if (p in aDefinition) {
				var value = aSource[p];
				var destType = aDefinition[p];
				if (destType===undefined)
					throw Error('no definition for '+p);
				aDestination[p] = this.interpretValueAsType(value,destType);
			} else if (aDefinition.__options===undefined || aDefinition.__options.allowDynamic===undefined || aDefinition.__options.allowDynamic==true) {
				aDestination[p] = aSource[p];
			}
		}
		return aDestination;
	}
}

KojacTypes.Int = {name: 'Int', toString: function() {return 'Int';}};    // represents a virtual integer type
KojacTypes.Null = {name: 'Null', toString: function() {return 'Null';}}; // represents a virtual Null type
KojacTypes.FieldTypeStrings = ['Null','Int','Number','String','Boolean','Date','Array','Object'];  // String names for FieldTypes

KojacTypes.FieldTypes = [KojacTypes.Null,KojacTypes.Int,Number,String,Boolean,Date,Array,Object];  // all possible types for fields in Kojac.Model
KojacTypes.SimpleTypes = [KojacTypes.Null,KojacTypes.Int,Number,String,Boolean,Date];  // simple field types in Kojac.Model ie. Object and Array are considered complex

KojacTypes.timezoneString = function(aMinutes){
	var fmt = function(n) {
		var r = String(n);
		if (r.length==1)
			r = "0"+r;
		return r;
	};
	if (aMinutes==0)
		return 'Z';
	var s = aMinutes >= 0 ? '+' : '-';
	if (aMinutes<0)
		aMinutes = -aMinutes;
	var h = Math.floor(aMinutes / 60);
	var m = aMinutes % 60;
	return s+fmt(h)+':'+fmt(m);
};

KojacTypes.localTimezone = function(){ var d = new Date(); return -d.getTimezoneOffset(); }();
KojacTypes.localTimezoneString = KojacTypes.timezoneString(KojacTypes.localTimezone);

// from http://webreflection.blogspot.com.au/2009/07/ecmascript-iso-date-for-every-browser.html
// also see https://www.npmjs.com/package/date
// and https://github.com/abritinthebay/datejs

// String -> Date
KojacTypes.ISO = function(str) {
    var m = /^(\d{4})(-(\d{2})(-(\d{2})(T(\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|((\+|-)(\d{2}):(\d{2}))))?)?)?$/.exec(str);
    if(m === null)
        throw new Error("Invalid ISO String");
    var d = new Date;
    d.setUTCFullYear(+m[1]);
    d.setUTCMonth(m[3] ? (m[3] >> 0) - 1 : 0);
    d.setUTCDate(m[5] >> 0);
    d.setUTCHours(m[7] >> 0);
    d.setUTCMinutes(m[8] >> 0);
    d.setUTCSeconds(m[10] >> 0);
    d.setUTCMilliseconds(m[12] >> 0);

		// Adjust to UTC offset
    if (m[13] && m[13] !== "Z") {
      var hour = m[16] >> 0;
	    var minute = m[17] >> 0;
	    var aheadOfUtc = (m[15] === "+");

      hour = hour * 60 * 60 * 1000;
      minute = minute * 60 * 1000;

      if (aheadOfUtc) {
        hour = -hour;
        minute = -minute;
      }

      // easy dateline wrapping
      d = new Date(d.valueOf() + hour + minute);
    }
    return d;
};

// Date -> String in UTC
KojacTypes.toISOString = (function(){
        function t(i){return i<10?"0"+i:i}
        function h(i){return i.length<2?"00"+i:i.length<3?"0"+i:3<i.length?Math.round(i/Math.pow(10,i.length-3)):i}
        return function toISOString(aDate){
            return "".concat(
	            aDate.getUTCFullYear(), "-",
                t(aDate.getUTCMonth() + 1), "-",
                t(aDate.getUTCDate()), "T",
                t(aDate.getUTCHours()), ":",
                t(aDate.getUTCMinutes()), ":",
                t(aDate.getUTCSeconds()), ".",
                h("" + aDate.getUTCMilliseconds()), "Z"
            );
        };
    })();

export default KojacTypes;
