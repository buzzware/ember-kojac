import _ from 'lodash';
import KojacUtils from 'ember-kojac/utils/KojacUtils';
import OpResponse from 'ember-kojac/utils/OpResponse';
import KojacStoreBase from 'ember-kojac/utils/KojacStoreBase';
import bf from 'ember-kojac/utils/BuzzFunctions';

import simpleStorage from 'simple-storage';

export default class extends KojacStoreBase {

  constructor(options = {}) {
    super();
    Object.assign(this,{
      // properties with default values here
    },options);
  }

  // return op_response
  async handleRequestOp(aRequestOp) {
    if (aRequestOp.verb=='CREATE') {
      return await this.createOp(aRequestOp);
    } else if (aRequestOp.verb=='READ') {
      return await this.readOp(aRequestOp);
    } else if (aRequestOp.verb=='UPDATE') {
      return await this.updateOp(aRequestOp);
    } else if (aRequestOp.verb=='DESTROY') {
      return await this.destroyOp(aRequestOp);
    } else {
      throw "verb not implemented";
    }
  }

  async destroyOp(aRequestOp) {
    var v,op,id,key,value,parts,results,result_key;
    simpleStorage.deleteKey(aRequestOp.key);
    result_key = (aRequestOp.result_key || aRequestOp.key);
    results = {};
    results[result_key] = undefined;
    return new OpResponse({
      result_key: result_key,
      results: results
    });
  }

  async updateOp(aRequestOp) {
    var v,op,id,key,value,parts,results,result_key;
    value = simpleStorage.get(aRequestOp.key, Boolean);
    if (value === Boolean)
      value = undefined;
    result_key = (aRequestOp.result_key || aRequestOp.key);
    if (bf.isObjectStrict(value))
      _.extend(value, aRequestOp.value);
    else
      value = aRequestOp.value;
    simpleStorage.set(aRequestOp.key, value);
    results = {};
    results[result_key] = value;
    return new OpResponse({
      result_key: result_key,
      results: results
    });
  }

  async readOp(aRequestOp) {
    var v,op,id,key,value,parts,results,result_key;
    result_key = (aRequestOp.result_key || aRequestOp.key);
    results = {};
    parts = KojacUtils.keySplit(aRequestOp.key);
    if (parts[1]) { // item
      value = simpleStorage.get(aRequestOp.key, Boolean);
      if (value === Boolean)
        value = undefined;
      results[result_key] = value;
    } else {  // collection
      var keys = simpleStorage.index();
      var ids = [];
      _.each(keys, function (k) {
        parts = KojacUtils.keySplit(k);
        id = parts[1];
        if (parts[0] != aRequestOp.key || !id)
          return;
        ids.push(id);
        v = simpleStorage.get(k, Boolean);
        if (value === Boolean)
          value = undefined;
        results[k] = v;
      });
      results[result_key] = ids;
    }
    return new OpResponse({
      result_key: result_key,
      results: results
    });
  }

  async createOp(aRequestOp) {
    var value = _.clone(aRequestOp.value, true, true);
    var id = value['id'] || -KojacUtils.createId();
    value.id = id;
    var resource = aRequestOp.key;
    var key = KojacUtils.keyJoin(resource, id);

    simpleStorage.set(key, value);

    var result_key = (aRequestOp.result_key || key);
    var results = {};
    results[result_key] = value;
    return new OpResponse({
      result_key: result_key,
      results: results
    });
  }

  clear() {
    simpleStorage.flush();
  }

}
