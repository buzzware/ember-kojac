// import { expect } from 'chai';
// import { describe, it } from 'mocha';
//
// import Ember from 'ember';
// import _ from 'lodash';
//
// import BufferedProxy from 'ember-buffered-proxy/proxy';
// //import { setupModelTest } from 'ember-mocha';
// import KojacUtils from 'ember-kojac/utils/KojacUtils';
// import KojacTypes from 'ember-kojac/utils/KojacTypes';
// import KojacEmberModel from 'ember-kojac/utils/ember/KojacEmberModel';
//
// var Thing = KojacEmberModel.extend({
//   id: KojacTypes.Int,
//   size: String,
//   colour: String,
//   legs: KojacTypes.Int
// });
//
// var BaseObject = Ember.Object.extend({
//
//   init() {
//   },
//
//   thing: null,
//   proxy: KojacEmberModel.editProxyFor('thing')
//
// });
//
// describe('edit proxy', function() {
//   it('swap thing with clone should clear changes', function() {
//     var base = BaseObject.create();
//
//     var initial = {
//       id: -KojacUtils.createId(),
//       size: 'small',
//       colour: 'red',
//       legs: 6
//     };
//     base.set('thing',new Thing(initial));
//
//     expect(base.get('proxy.legs')).to.equal(6);
//     expect(base.get('proxy.size')).to.equal('small');
//
//     var changes = {
//       legs: 4,
//       size: 'large'
//     };
//     base.get('proxy').setProperties(changes);
//     expect(base.get('proxy.legs')).to.equal(changes.legs);
//     expect(base.get('proxy.size')).to.equal(changes.size);
//     //expect(base.get('proxy').getProperties()).to.eql(changes);  // getProperties() doesn't work on proxy
//     expect(base.get('proxy.buffer')).to.eql(changes);
//
//     // swap with clone with changes made
//     let afterChanges = base.get('proxy.buffer');
//     let thing = base.get('thing');
//     let nm = thing.copy();
//     nm.setProperties(afterChanges);
//
//     base.set('thing',nm);
//
//     expect(base.get('proxy.buffer')).to.eql({});  // thing has same values as proxy.buffer had before, so should be clear
//   });
//
//   it('swap thing with different property should trigger observers, update proxy properties and remove edited property from changes',function() {
//
//     var base = BaseObject.create();
//
//     var initial = {
//       id: -KojacUtils.createId(),
//       size: 'small',
//       colour: 'red',
//       legs: 6
//     };
//     base.set('thing',new Thing(initial));
//
//     expect(base.get('proxy.legs')).to.equal(6);
//     expect(base.get('proxy.size')).to.equal('small');
//
//     var backEndChanges = {
//       legs: 2,
//       size: 'tiny'
//     };
//
//     var frontEndChanges = {
//       size: 'large',
//       colour: 'green'
//     };
//     let proxy = base.get('proxy');
//
//     proxy.setProperties(frontEndChanges);
//     expect(base.get('proxy.size')).to.equal(frontEndChanges.size);
//     expect(base.get('proxy.colour')).to.equal(frontEndChanges.colour);
//     expect(base.get('proxy.buffer')).to.eql(frontEndChanges);
//
//     // change thing to modified clone from the backend
//     let modelBefore = base.get('thing');
//     let modelAfter = modelBefore.copy();
//     modelAfter.setProperties(backEndChanges);
//
//     // set thing from backend and restore changes that don't conflict with the backend
//     base.set('thing',modelAfter);
//
//     let afterChanges = base.get('proxy.buffer');
//     expect(base.get('proxy.buffer.colour')).to.equal(frontEndChanges.colour);
//     expect(base.get('proxy.buffer.size')).to.be.undefined;  // size should be removed from changes because backend change overrode it
//     expect(base.get('proxy.size')).to.equal(backEndChanges.size);
//     expect(base.get('thing.size')).to.equal(backEndChanges.size);
//
//     expect(base.get('proxy.colour')).to.equal(frontEndChanges.colour);     // proxy colour comes from changes
//     expect(base.get('thing.colour')).to.equal(initial.colour);       // thing colour comes from thing
//
//     expect(base.get('proxy.legs')).to.equal(backEndChanges.legs);
//     expect(base.get('thing.legs')).to.equal(backEndChanges.legs);
//   });
// });
