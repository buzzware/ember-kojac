import Ember from 'ember';
import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

export default class {

	constructor() {
		this.defaultClass = Object;
	}

	static instance() {
		if (this._instance==null)
			this._instance = new this();
		return this._instance;
	}

	set(aObject, aProperty, aValue) {
		aObject[aProperty] = aValue;
		return aValue;
	}

	setProperties(aObject, aPropertyValues) {
		Object.assign(aObject,aPropertyValues);
		return aObject;
	}

	get(aObject, aProperty) {
		return aObject[aProperty];
	}

	cacheGet(aCache,aProperty) {
		return aCache[aProperty];
	}

	cacheSet(aCache,aProperty,aValue) {
		if (aValue===undefined) {
			delete aCache[aProperty];
			return aValue;
		} else {
			return (aCache[aProperty] = aValue);
		}
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

	createInstance(aClass, aProperties) {
		aProperties = aProperties || {};
		var result = new aClass();
		Object.assign(result,aProperties);
		return result;
	}

	getPropertyNames(aObject) {
		return Object.keys(aObject);
	}

	getProperties(aObject) {
		return _.clone(aObject);
	}

	getModelPropertyNames(aObject) {
		return this.getPropertyNames(aObject);
	}

	getModelProperties(aObject) {
		return this.getProperties(aObject);
	}

}

