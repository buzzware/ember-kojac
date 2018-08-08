import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect,should} from 'chai'; should();

import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import EmberObject from '@ember/object';

import SimpleCache from 'ember-computed-state-tree/utils/SimpleCache';

describe("SimpleCache", function() {

  it("should lookupId single",async function(){

    var AppCache = SimpleCache.extend({
      uid: null,
      currentPerson: SimpleCache.lookupId('Person','uid'),//   readOnly('Person__5')//
    });
    var appCache = AppCache.create();

    expect(appCache.currentPerson).to.be.undefined;

    appCache.set('Person__5',{name: 'John'});
    appCache.set('Person__6',{name: 'Mark'});

    expect(appCache.currentPerson).to.be.undefined;

    appCache.set('uid','5');
    appCache.currentPerson.should.equal(appCache.Person__5);
    appCache.set('uid','6');
    appCache.currentPerson.should.equal(appCache.Person__6);
    appCache.set('uid','3');
    expect(appCache.currentPerson).to.be.undefined;
    //appCache.currentPerson.name.should.equal('John');
  });

  it("should lookupId array",async function(){

    var AppCache = SimpleCache.extend({
      uids: null,
      people: SimpleCache.lookupId('Person','uids'),
    });
    var appCache = AppCache.create();

    expect(appCache.people).to.be.undefined;

    appCache.set('Person__5',{name: 'John'});
    appCache.set('Person__6',{name: 'Mark'});
    appCache.set('Person__7',{name: 'Carlos'});

    expect(appCache.people).to.be.undefined;

    appCache.set('uids',['5']);
    appCache.people.should.eql([appCache.Person__5]);
    appCache.set('uids',['5','6']);
    appCache.people.should.eql([appCache.Person__5,appCache.Person__6]);
    appCache.set('uid','3');
    expect(appCache.currentPerson).to.be.undefined;
  });

});
