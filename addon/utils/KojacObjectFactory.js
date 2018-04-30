import _ from 'lodash';
import KojacUtils from 'ember-kojac/utils/KojacUtils';

/**
 * A default ObjectFactory implementation. Your own implementation, or a subclass of this may be used instead.
 * @class Kojac.ObjectFactory
 * @extends Kojac.Object
 */
export default class {

	constructor() {
		this.namespace = null;
		this.matchers = null;
		this.framework = null;
		this.defaultClass = Object;
	}

	register(aPairs) {
		if (!aPairs)
			return;
		if (this.matchers===null)
			this.matchers = [];
		for (var i = 0; i < aPairs.length; i++)
			this.matchers.push(aPairs[i]);
	}

	classFromKey(aKey) {
		var pair;
		var re;
		var newClass;
		if (this.matchers) for (var i = 0; i < this.matchers.length; i++) {
			pair = this.matchers[i];
			re = pair[0];
			if (!re.test(aKey))
				continue;
			newClass = pair[1];
			break;
		}
		if (!newClass) {
			var ns = this.namespace;
			var r = KojacUtils.keyResource(aKey);
			if (r && (r[0]==r[0].toUpperCase()) && _.isFunction(ns[r]))
				newClass = ns[r];
		}
		if (!newClass)
			newClass = this.defaultClass;
		return newClass;
	}

	createInstance(aClass,aProperties) {
		if (this.framework) {
			return this.framework.createInstance(aClass,aProperties);
		} else {
			aProperties = aProperties || {};
			return new aClass(aProperties);
		}
	}

	manufacture(aObject,aKey) {
		var newClass = this.classFromKey(aKey);
		var result = [];
		if (_.isArray(aObject)) {
			for (var i=0; i<aObject.length; i++) {
				var newv = this.createInstance(newClass,aObject[i]);
				result.push(newv);
			}
		} else {
			result = this.createInstance(newClass,aObject);
		}
		return result;
	}
}
