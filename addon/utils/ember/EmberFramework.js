import Ember from 'ember';
import EmberObject from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
import { set,get,setProperties } from '@ember/object';
//import * as eo from '@ember/object';

import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';
import ManagedModel, { field } from 'ember-kojac/utils/ember/ManagedModel';

var ef = class {

	constructor() {
		this.defaultClass = EmberObject;
	}

	static instance() {
		if (this._instance==null)
			this._instance = new this();
		return this._instance;
	}


	// from https://stackoverflow.com/questions/9211844/reflection-on-emberjs-objects-how-to-find-a-list-of-property-keys-without-knowi
  static getPojoProperties(pojo) {
    return Object.keys(pojo);
  }

  static getProxiedProperties(proxyObject) {
    // Three levels, first the content, then the prototype, then the properties of the instance itself
    var contentProperties = this.getPojoProperties(proxyObject.get('content')),
      prototypeProperties = Object.keys(proxyObject.constructor.prototype),
      objectProperties = this.getPojoProperties(proxyObject);
    return _.concat(contentProperties, prototypeProperties, objectProperties);
  }

  static getEmberObjectProperties(emberObject) {
    var prototypeProperties = Object.keys(emberObject.constructor.prototype),
      objectProperties = this.getPojoProperties(emberObject);
    return _.concat(prototypeProperties, objectProperties);
  }

  // static getEmberDataProperties = function (emberDataObject) {
  //   var attributes = Ember.get(emberDataObject.constructor, 'attributes'),
  //     keys = Ember.get(attributes, 'keys.list');
  //   return Ember.getPropertyNames(emberDataObject, keys);
  // },
  static getPropertyNames(object) {
	  let result;
    /*if (object instanceof DS.Model) {
      return getEmberDataProperties(object);
    } else*/
    if (object instanceof ObjectProxy) {
      result = this.getProxiedProperties(object);
    } else if (object instanceof EmberObject) {
      result = this.getEmberObjectProperties(object);
    } else {
      result = this.getPojoProperties(object);
    }
    result = _.filter(result, function(r) { return r && r[0]!='_' && r!='constructor'; });
    return result;
  }

	set(aObject,aProperty,aValue) {
		return set(aObject,aProperty,aValue);
	}

	setProperties(aObject,aPropertyValues) {
		setProperties(aObject,aPropertyValues);
	}

  internalModifyModel(aObject, aPropertyValues) {
	  if (aObject instanceof ManagedModel) {
	    // !!! this is exactly how ManagedModel should NOT be used, but is done here to get things done right now
      if (aObject.__writeLocked())
        aObject.__withUnlocked(aObject.__writeSecret,()=>aObject.setProperties(aPropertyValues));
      else
        aObject.setProperties(aPropertyValues);
    } else if (aObject.setProperties)
      aObject.setProperties(aPropertyValues);
    else
      bf.copyProperties(aObject, aPropertyValues);
  }

	get(aObject,aProperty) {
		return get(aObject,aProperty);
	}

	cacheGet(aCache,aProperty) {
		return get(aCache,aProperty);
	}

	cacheSet(aCache,aProperty,aValue) {
		aCache.beginPropertyChanges();
		set(aCache,aProperty,aValue);
		aCache.endPropertyChanges();
		return aValue;
	}

	beginPropertyChanges(aObject) {
		if (aObject.beginPropertyChanges)
			aObject.beginPropertyChanges();
	}

	endPropertyChanges(aObject) {
		if (aObject.endPropertyChanges)
			aObject.endPropertyChanges();
	}

	freeze(aObject) {
		Object.freeze(aObject);
		return aObject;
	}

	clone(aObject) {
		return aObject.copy();
	}

	createInstance(aClass,aProperties) {
		aProperties = aProperties || {};
		return aClass.create(aProperties);
	}

	isDescriptor(aSomething) {
		return bf.isObjectStrict(aSomething) && aSomething.isDescriptor;
	}

	_descriptorFor(aObject,aKey,aMeta=null) {
    var m = aMeta || Ember.meta(aObject);
    let descriptors = (m && m._parent && m._parent._descriptors) || null;
    if (!descriptors)
      return null;
    if (descriptors instanceof Map) { // newer ember
      return descriptors.get(aKey) || null;
    } else {
      return descriptors[aKey] || null;
    }
  }

  _metaFor(aObject,aKey,aMeta=null) {
    var d = this._descriptorFor(aObject, aKey, aMeta);
    return (d && d._meta) || null;
  }

  isProperty(aObject,aKey) {
	  return !!this._descriptorFor(aObject,aKey);
  }

  // names of all public properties of an object
	getPropertyNames(aObject) {
		var keys = ef.getPropertyNames(aObject);
    return keys;
	}

  // names and values of all public properties of an object
	getProperties(aObject) {
    var keys = ef.getPropertyNames(aObject);
		var result = {};
		for (let k of keys) {
		  result[k] = aObject.get(k);
		}
		return result;
	}

	// names of defined fields of models
	getModelPropertyNames(aObject) {
    var keys = ef.getPropertyNames(aObject);
		var result = [];
		var m;
    if (!(m = Ember.meta(aObject)))
      return result;
		for (let k of keys) {
		  var pm = this._metaFor(aObject,k,m);
		  if (!pm || !pm.managedModel)
        continue;
			result.push(k);
		}
		return result;
	}

  // names and values of defined fields of models
	getModelProperties(aObject) {
    var keys = ef.getPropertyNames(aObject);
		var result = {};
		var m;
    if (!(m = Ember.meta(aObject)))
      return result;
		for (let k of keys) {
      var pm = this._metaFor(aObject,k,m);
      if (!pm || !pm.managedModel)
        continue;
			result[k] = aObject.get(k);
		}
		return result;
	}

};

export default ef;
