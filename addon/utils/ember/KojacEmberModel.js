import Ember from 'ember';
import EmberObject from '@ember/object';
import { defineProperty } from '@ember/object';
import { computed } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
import { set,get,setProperties } from '@ember/object';
import { cacheFor } from '@ember/object/internals';

import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';
import Kojac from 'ember-kojac/utils/Kojac';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';
import KojacEmberUtils from 'ember-kojac/utils/ember/KojacEmberUtils';
import createClassComputed from 'ember-macro-helpers/create-class-computed';
//import { computed } from '@ember/object/computed';
import BufferedProxy from 'ember-buffered-proxy/proxy';


var descFor = function(aObject,aKey) {
	var value = aObject[aKey];
	var desc = (value !== null && typeof value === 'object' && value.isDescriptor) ? value : undefined;
	if (desc)
		return desc;
	// the old way
	var m = Ember.meta(aObject,false);
	return m && m.descs[aKey];
};

var kem = EmberObject.extend(Ember.Copyable,{

  _cache: null,   // the cache this model is in, for binding relationships

//	set: function(k,v) {
//		var def = this.constructor.getDefinitions();
//		var t = (def && def[k]);
//		if (t)
//			v = Kojac.interpretValueAsType(v,t);
//		return this._super(k,v);
//	},
//
//	setProperties: function(values) {
//		values = Kojac.readTypedProperties({},values,this.constructor.getDefinitions());
//		return this._super(values);
//	},

	// copy the property from source to dest
	// this could be a static fn
	toJsonoCopyFn: function(aDest,aSource,aProperty,aOptions) {
		aDest[aProperty] = KojacUtils.toJsono(get(aSource,aProperty),aOptions);
	},

	// return array of names, or an object and all keys will be used
	// this could be a static fn
	toPropListFn: function(aSource,aOptions) {
		var p;
		if ((p = aSource) && aSource.constructor && aSource.constructor.proto && aSource.constructor.proto()) {
			return EmberFramework.instance().getModelPropertyNames(aSource);
		} else {
			return aSource;
		}
	},

	toJsono: function(aOptions) {
		return KojacUtils.toJsono(this,aOptions,this.toPropListFn,this.toJsonoCopyFn)
	},

	getProperties() {
    return this.toJsono();
  },

  copy(deep) {
    var props = this.getProperties();
    return this.constructor.create(props);
  }

});


// in create, set cache with defaults merged with given values
// getter - use cacheFor
// setter - set cache with converted value
// in extend, generate with Ember.computed().cacheable(true)

kem.reopenClass({

	extend: function() {
		var defs = arguments[0];
		var extender = {};

		var _type;
		var _value;
		if (defs) {
			var destType;
			var defaultValue;
			for (var p in defs) {
				var pValue = defs[p];
				destType = null;
				defaultValue = null;

				if (KojacTypes.FieldTypes.indexOf(pValue)>=0) { // pValue is field type
					destType = pValue;
					defaultValue = null;
				} else {
					var ft=KojacTypes.getPropertyValueType(pValue);
					if (ft && (KojacTypes.SimpleTypes.indexOf(ft)>=0)) {  // pValue is simple field value
						destType = ft;
						defaultValue = pValue;
					}
				}

				if (destType) {

					extender[p] = computed({
				    get(aKey) {
					    var d = descFor(this,aKey);
							var v;
					    v = cacheFor(this,aKey);
							if (typeof v != 'undefined') {
								return v;
					    } else {
						    return d && d._meta && d._meta.value;
					    }
					    return v;
				    },
				    set(aKey, aValue) {
					    var d = descFor(this,aKey);
							var v;
					    var t = d && d._meta && d._meta.type;
							if (t)
								v = KojacTypes.interpretValueAsType(aValue,t);
							else
								v = aValue;
							return v;
				    }
				  }).meta({
            kemp: true,     // Kojac Ember Model Property
            type: destType,
            value: defaultValue
          });


					//extender[p] = Ember.computed(function(aKey,aValue){
					//	// MyClass.metaForProperty('person');
					//	//var m = Ember.meta(this,false);
					//	//var d = m && m.descs[aKey];
					//	var d = descFor(this,aKey);
					//
					//
					//	var v;
					//
					//	if (arguments.length==2) { // set
					//		var t = d && d._meta && d._meta.type;
					//		if (t)
					//			v = KojacTypes.interpretValueAsType(aValue,t);
					//		else
					//			v = aValue;
					//		//cache[aKey] = v;
					//	} else {  // get
					//		v = Ember.cacheFor(this,aKey);
					//		if (typeof v != 'undefined') {
					//			return v;
					//    } else {
					//	    return d && d._meta && d._meta.value;
					//    }
					//	}
					//	return v;
					//}).meta({
					//	kemp: true,     // Kojac Ember Model Property
					//	type: destType,
					//	value: defaultValue
					//})


				} else {
					extender[p] = pValue;
				}
			}
		}
		var result = this._super(extender);
		return result;
	}

});


kem.belongsTo = function(aIdProperty,aResource) {
  return computed(aIdProperty, function(){
    var id = get(this,aIdProperty);
    if (!id)
      return null;
    var cache = get(this,'_cache');
    var key = KojacUtils.keyJoin(aResource,id);
    if (!key || !cache)
      return null;
    return get(cache,key);
  }).property('_cache',aIdProperty);
};

kem.numeratedCollection = function(aPrefix,aMaxCount,aCountProperty=null) {
  aCountProperty = aCountProperty || aPrefix+'Count';
  let props = _.concat(aCountProperty, bf.numerate(aPrefix, aMaxCount));
  return computed(...props, function () {
    let count = this.get(aCountProperty);
    if (!count)
      return [];
    return KojacEmberUtils.getNumerated(this, aPrefix, count);
  })
};

kem.editProxyFor = function(aSource) {
  return computed(aSource,{
    get(p) {
      let lastProxy = this.get('_last_'+p);
      let modelBefore = lastProxy && lastProxy.get('content');
      let modelAfter = this.get(aSource);

      let edits = lastProxy && modelBefore && modelAfter && _.omitBy(lastProxy.buffer,(v,k) => modelAfter.get(k)!==modelBefore.get(k));
      let newProxy = BufferedProxy.create({
        content: modelAfter
      });
      if (edits)
        newProxy.setProperties(edits);

      this.set('_last_'+p,newProxy);
      return newProxy;
    }
  }).readOnly()
};


// use https://www.npmjs.com/package/ember-macro-helpers
// like : https://github.com/kellyselden/ember-awesome-macros/blob/master/addon/get-by.js
/*
import createClassComputed from 'ember-macro-helpers/create-class-computed';
import { readOnly } from '@ember/object/computed';

export default createClassComputed(
  [false, true],
  (obj, key) => readOnly(`${obj}.${key}`)
);
 */

// editProxyForJoin('cache','RubricScore__','currentPersonId'),

kem.editProxyForJoin = function(aRoot,aPrefix,aIdPath,aProxyClass=null) {    // eg. currentScore: KojacEmberModel.editProxyForJoin('cache.RubricScore__','currentPersonId'),
  aProxyClass = aProxyClass || BufferedProxy;
  return createClassComputed(
    [true, true],
    function(aRootObject,aId) {
      var keyPath = aId ? `${aRoot}.${aPrefix}${aId}` : aRoot;
      return computed(keyPath, aIdPath, (aObject, aKey) => {

        if (!aId)
          return null;
        // let v = aObject.get(`${aPrefix}${aValue}`);
        // return v;

        let obj = this.context;
        let lastProxy = this.get('_last');
        if (lastProxy && lastProxy.get('id')!=aId)
          lastProxy = null;
        let modelBefore = lastProxy && lastProxy.get('content');
        let modelAfter = obj.get(keyPath); //`${aPrefix}${aKey}`);

        let edits = lastProxy && modelBefore && modelAfter && _.omitBy(lastProxy.buffer,(v,k) => modelAfter.get(k)!==modelBefore.get(k));
        let newProxy = aProxyClass.create({
          content: modelAfter
        });
        if (edits)
          newProxy.setProperties(edits);

        this.set('_last',newProxy);
        return newProxy;

      });
    }
  )(aRoot,aIdPath);
};

// kem.lookup = function(aRootPath,aKey) {
//   return createClassComputed(
//     [true, true],
//     (aRootPath, aKey, ...args) => {
//       return readOnly(`${aRootPath}.${aKey}`);
//     }
//   );
// };

// createClassComputed(
//   // the first param is the observer list
//   // it refers to incoming keys
//   // the bool is whether a value change should recreate the macro
//   [
//     // the array key
//     false,
//
//     // the array property is dynamic, and is responsible for the macro being rewritten
//     true,
//
//     // any static properties after the last dynamic property are optional
//     // you could leave this off if you want
//     false
//   ],
//   // the second param is the callback function where you create your computed property
//   // it is passed in the values of the properties you marked true above
//   (array, key, value) => {
//     // when `key` changes, we need to watch a new property on the array
//     // since our computed property is now invalid, we need to create a new one
//     return computed(`${array}.@each.${key}`, value, (array, value) => {
//       return array.filterBy(key, value);
//     });
//   }
// );


// kem.editProxyForJoin = function(aPrefix,aIdPath) {
//   // observe aIdPath
//   // do something like editProxyFor(key)
//
//   return Ember.computed(aIdPath,{
//     get(p) {
//       let lastProxy = this.get('_last_'+p);
//       let modelBefore = lastProxy && lastProxy.get('content');
//       let modelAfter = this.get(aSource);
//       let edits = lastProxy && modelBefore && modelAfter && _.omitBy(lastProxy.buffer,(v,k) => modelAfter.get(k)!==modelBefore.get(k));
//       let newProxy = BufferedProxy.create({
//         content: modelAfter
//       });
//       if (edits)
//         newProxy.setProperties(edits);
//       this.set('_last_'+p,newProxy);
//       return newProxy;
//     }
//   }).readOnly()
//
// }



export default kem;
