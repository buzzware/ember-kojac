import Ember from 'ember';
import EmberObject from '@ember/object';
import { defineProperty } from '@ember/object';
import { computed } from '@ember/object';

import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';

//import changeEvent from './change_event'; // or use '<key>:change'

let kec = EmberObject.extend({

  // observersFor(obj, path) {
  //   return listenersFor(obj, changeEvent(path));
  // },

//   /**
//   @private
//   @method listenersFor
//   @static
//   @for @ember/object/events
//   @param obj
//   @param {String} eventName
// */
// export function listenersFor(obj, eventName) {
//   let ret = [];
//   let meta = peekMeta(obj);
//   let actions = meta !== undefined ? meta.matchingListeners(eventName) : undefined;
//    if (actions === undefined) { return ret; }
//    for (let i = 0; i < actions.length; i += 3) {
//     let target = actions[i];
//     let method = actions[i + 1];
//     ret.push([target, method]);
//   }
//    return ret;
// }

  listenersFor(eventName) {
    let ret = [];
    let meta = Ember.meta(this);
    let actions = meta !== undefined ? meta.matchingListeners(eventName) : undefined;
    if (actions === undefined) { return ret; }
    for (let i = 0; i < actions.length; i += 3) {
      let target = actions[i];
      let method = actions[i + 1];
      ret.push([target, method]);
    }
    return ret;
  },

  observersForKey(key) {
    return this.listenersFor(key+':change');
  },

  ensureDependencyObserver(key) {
    console.log('ensureDependencyObserver disabled');
    // need to update this, probably using Ember.meta(this)._listeners or Ember.meta(this)._parent._listeners
    // see https://github.com/emberjs/ember.js/blob/6fc89cdf13124d88b8ae6adf99bb02a8c0cdf508/packages/ember-metal/lib/events.ts
    if (_.first(this.observersForKey(key),o=> o.method=='dependencyObserver'))
      return;
    this.addObserver(key,this,'dependencyObserver');
  },

  // clearUndefinedDependencies() {
  //   var observers = matchingListeners('change');
  //   foreach (var o of observers) {
  //     if (method=='dependencyObserver' && this.get(o.key)==undefined)
  //       this.removeObserver(o.key,this,'dependencyObserver');
  //   }
  // },

  dependencyObserver(obj,key) { // fired when any observed key changes
    var res = KojacUtils.keyResource(key);
    var keys = EmberFramework.instance().getPropertyNames(this);
    var me = this;
    var ometa = Ember.meta(this);
    keys = _.filter(keys,function (k) {
      //var m = me[k] && me[k].meta && me[k].meta();
      var m = EmberFramework.instance()._metaFor(me,k,ometa);
      var nc = m && m.notifyChanges;
      if (!nc)
        return false;
      if  (!nc.resource || res!=nc.resource)
        return false;
      return !nc.filter || !!nc.filter(this.get(k));
    });
    for (var k of keys)
      this.notifyPropertyChange(k);
  },

  setUnknownProperty(key, value) {
    defineProperty(this,key,undefined,value);
    this.ensureDependencyObserver(key);
    this.dependencyObserver(value,key);
    return true;
  }
});

kec.collectResource = function(aResource,aFilter=null) {
  return computed(function(){
    let keys = Object.keys(this); //EmberFramework.instance().getPropertyNames(this);
    keys = _.filter(keys, (k) => bf.beginsWith(k, aResource + '__'));
    keys = keys.sort();
    var result = [];
    for (var k of keys) {
      this.ensureDependencyObserver(k);
      result.push(this.get(k));
    }
    return result;
  }).meta({notifyChanges: {resource: aResource,filter: aFilter}});
};

export default kec;
