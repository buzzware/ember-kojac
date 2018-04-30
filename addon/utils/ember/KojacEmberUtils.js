import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

export default class {

  static getNumerated(aObject,aPrefix,aCount,aFirst=0) {
    if (!aObject)
      return null;
    let props = bf.numerate(aPrefix,aCount,aFirst);
    let result = _.map(props,p=>aObject.get(p));
    return result;
  }

}
