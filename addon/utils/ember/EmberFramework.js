import Ember from 'ember';
import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

var ef = class {

	constructor() {
		this.defaultClass = Ember.Object;
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
    if (object instanceof Ember.ObjectProxy) {
      result = this.getProxiedProperties(object);
    } else if (object instanceof Ember.Object) {
      result = this.getEmberObjectProperties(object);
    } else {
      result = this.getPojoProperties(object);
    }
    result = _.filter(result, function(r) { return r && r[0]!='_' && r!='constructor'; });
    return result;
  }

	set(aObject,aProperty,aValue) {
		return Ember.set(aObject,aProperty,aValue);
	}

	setProperties(aObject,aPropertyValues) {
		Ember.setProperties(aObject,aPropertyValues);
	}

	get(aObject,aProperty) {
		return Ember.get(aObject,aProperty);
	}

	cacheGet(aCache,aProperty) {
		return Ember.get(aCache,aProperty);
	}

	cacheSet(aCache,aProperty,aValue) {
		aCache.beginPropertyChanges();
		Ember.set(aCache,aProperty,aValue);
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

	getPropertyNames(aObject) {
		var keys = ef.getPropertyNames(aObject);
		var result = [];
		for (let k of keys) {
			var v = aObject[k];
			if (!this.isDescriptor(v))
				continue;
			result.push(k);
		}
		return result;
	}

	getProperties(aObject) {
    var keys = ef.getPropertyNames(aObject);
		var result = {};
		for (let k of keys) {
			var v = aObject[k];
			if (this.isDescriptor(v))
				result[k] = aObject.get(k);
		}
		return result;
	}

	getModelPropertyNames(aObject) {
    var keys = ef.getPropertyNames(aObject);
		var result = [];
		var m;
		for (let k of keys) {
			var v = aObject[k];
			if (!this.isDescriptor(v))
				continue;
			if (!(m = v.meta()))
				continue;
			if (!m.kemp)
				continue;
			result.push(k);
		}
		return result;
	}

	getModelProperties(aObject) {
    var keys = ef.getPropertyNames(aObject);
		var result = {};
		var m;
		for (let k of keys) {
			var v = aObject[k];
			if (!this.isDescriptor(v))
				continue;
			if (!(m = v.meta()))
				continue;
			if (!m.kemp)
				continue;
			result[k] = aObject.get(k);
		}
		return result;
	}

};

export default ef;
