import Ember from 'ember';
import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';

let kec = Ember.Object.extend({

  ensureDependencyObserver(key) {
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
    keys = _.filter(keys,function (k) {
      var m = me[k] && me[k].meta && me[k].meta();
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
    Ember.defineProperty(this,key,undefined,value);
    this.ensureDependencyObserver(key);
    this.dependencyObserver(value,key);
    return true;
  }
});

kec.collectResource = function(aResource,aFilter=null) {
  return Ember.computed(function(){
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
