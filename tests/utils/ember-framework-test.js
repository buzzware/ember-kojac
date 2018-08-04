import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect,should} from 'chai';
should();

import { computed } from '@ember/object';
import EmberObject from '@ember/object';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';


import ManagedModel, { field } from 'ember-kojac/utils/ember/ManagedModel';

var Person = ManagedModel.extend({
  first_name: field(String),
  last_name:  field(String),
  //age: field(KojacTypes.Int),

  full_name: computed('first_name','last_name',function(){ return `${this.first_name} ${this.last_name}`;})
});

describe("EmberFramework", function() {

  it("getPropertyNames", function () {
    var person = Person.create({first_name: 'John', last_name: 'Smith'});
    var properties = EmberFramework.instance().getPropertyNames(person);
    properties.should.have.members(['first_name','last_name','full_name']);
  });

  it("getModelPropertyNames", function () {
    var person = Person.create({first_name: 'John', last_name: 'Smith'});
    var properties = EmberFramework.instance().getModelPropertyNames(person);
    properties.should.have.members(['first_name','last_name']);
  });

});
