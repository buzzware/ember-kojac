// import {afterEach, beforeEach, describe, it} from 'mocha';
// import {assert,expect,should} from 'chai'; should();
// import { settled } from '@ember/test-helpers';
//
// import { computed } from '@ember/object';
// import EmberObject from '@ember/object';
//
// import Kojac from 'ember-kojac/utils/Kojac';
// import KojacTypes from 'ember-kojac/utils/KojacTypes';
// import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
// import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';
// import KojacEmberCache from 'ember-kojac/utils/ember/KojacEmberCache';
// import { readOnly } from '@ember/object/computed';
//
// describe("Kojac Ember Cache", function() {
//
//
//   it("should lookupId single",async function(){
//
//     var AppCache = KojacEmberCache.extend({
//       uid: null,
//       currentPerson: KojacEmberCache.lookupId('Person','uid'),//   readOnly('Person__5')//
//     });
//     var appCache = AppCache.create();
//
//     expect(appCache.currentPerson).to.be.undefined;
//
//     appCache.set('Person__5',{name: 'John'});
//     appCache.set('Person__6',{name: 'Mark'});
//
//     expect(appCache.currentPerson).to.be.undefined;
//
//     appCache.set('uid','5');
//     appCache.currentPerson.should.equal(appCache.Person__5);
//     appCache.set('uid','6');
//     appCache.currentPerson.should.equal(appCache.Person__6);
//     appCache.set('uid','3');
//     expect(appCache.currentPerson).to.be.undefined;
//     //appCache.currentPerson.name.should.equal('John');
//   });
//
//   it("should lookupId array",async function(){
//
//     var AppCache = KojacEmberCache.extend({
//       uids: null,
//       people: KojacEmberCache.lookupId('Person','uids'),
//     });
//     var appCache = AppCache.create();
//
//     expect(appCache.people).to.be.undefined;
//
//     appCache.set('Person__5',{name: 'John'});
//     appCache.set('Person__6',{name: 'Mark'});
//     appCache.set('Person__7',{name: 'Carlos'});
//
//     expect(appCache.people).to.be.undefined;
//
//     appCache.set('uids',['5']);
//     appCache.people.should.eql([appCache.Person__5]);
//     appCache.set('uids',['5','6']);
//     appCache.people.should.eql([appCache.Person__5,appCache.Person__6]);
//     appCache.set('uid','3');
//     expect(appCache.currentPerson).to.be.undefined;
//   });
//
//
// 	// it("should update models existing in cache from jsono");
// 	//
// 	// it("should pass jsono objects for models not in the cache to factory");
// 	//
// 	// it("should replace non-objects in cache");
//
// });
