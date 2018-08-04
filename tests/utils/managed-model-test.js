import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect,should} from 'chai';
should();

import Ember from 'ember';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';

import ManagedModel from 'ember-kojac/utils/ember/ManagedModel';
import { field } from 'ember-kojac/utils/ember/ManagedModel';

var Person = ManagedModel.extend({

  first_name: field(String),
  last_name:  field(String),
  //age: field(KojacTypes.Int),

  full_name: computed('first_name','last_name',function(){ return `${this.first_name} ${this.last_name}`;})

});

// var Person = EmberObject.extend({
//   //first_name: null,
//   //last_name: null
//   full_name: computed('first_name','last_name',function(){ return `${this.first_name} ${this.last_name}`;})
// });

describe("Managed Model", function() {

  it("works",function(){

    var person = Person.create({
      first_name: 'Simon',
      last_name: 'Smith',
      age: 49.234253245
    });

    person.first_name.should.equal('Simon');
    person.last_name.should.equal('Smith');
    person.full_name.should.equal('Simon Smith');
    person.set('first_name','Fred');
    person.first_name.should.equal('Fred');
    person.full_name.should.equal('Fred Smith');

    var secret = person.__writeLock();

    person.full_name.should.equal('Fred Smith');

    expect(function(){
      person.first_name = 'Jeff';
    }).to.throw(Error);

    expect(function(){
      person.setProperties({first_name: 'Jeff'});
    }).to.throw(Error);

    person.__withUnlocked(secret,function(){
      person.set('first_name','John');
      person.setProperties({'last_name': 'Jones'});
    });

    person.full_name.should.equal('John Jones');

    expect(function(){person.set('first_name','Mark');}).to.throw(Error);

    expect(person.__writeLock()).to.be.null;

    person.__writeLocked().should.be.true;
  });

});
