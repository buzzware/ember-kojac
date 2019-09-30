// import Kojac from 'ember-kojac/utils/Kojac';
// import KojacTypes from 'ember-kojac/utils/KojacTypes';
// import KojacObject from 'ember-kojac/utils/KojacObject';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';

import EmberObject from '@ember/object';
import { computed, get, set } from '@ember/object';
import { cacheFor } from '@ember/object/internals';

var ManagedModel = EmberObject.extend({

  init() {
    this._super(...arguments);
    this.__writeSecret = null;
    this.__writeLockedFlag = false;
  },

  // convenience function eg. var thing = Thing.create({size: large}).locked();
  lock() {
    this.__writeLock();
    return this;
  },

  __writeLock() {
    if (!this.__writeSecret) {
      this.__writeSecret = Math.random()*Math.pow(2,50)+1000000;
      this.__writeLockedFlag = true;
      return this.__writeSecret;
    } else {
      this.__writeLockedFlag = true;
      return null;
    }
  },

  __writeLocked() {
    return this.__writeLockedFlag;
  },

  __writeUnlock(aSecret) {
    if (aSecret !== this.__writeSecret)
      throw new Error("Secret did not match");
    this.__writeLockedFlag = false;
  },

  __withUnlocked(aSecret,aFunction) {
    this.__writeUnlock(aSecret);
    try {
      aFunction();
    } finally {
      this.__writeLock();
    }
  },


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

});

var field = function(aType) {
  var prop = computed({
    get: function (aKey) {
      var result = cacheFor(this,aKey);
      if (result===undefined)
        result = null;
      return result;
    },
    set: function (aKey,aValue) {
      if (!this.__writeLocked)
        throw new Error(`__writeLocked is missing. Make sure this classing using field() inherits from ManagedModel`);
      if (this.__writeLocked())
        throw new Error(`This ManagedModel is locked and ${aKey} cannot be changed to ${aValue}`);
      return aValue;
    },
  });
  prop = prop.meta({
    managedModel: true,
    type: aType
  });
  return prop;
};
export { field };
export default ManagedModel;

