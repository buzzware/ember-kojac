// import {afterEach, beforeEach, describe, it} from 'mocha';
// import {assert,expect} from 'chai';
//
// import Ember from 'ember';
//
// import Kojac from 'ember-kojac/utils/Kojac';
// import KojacTypes from 'ember-kojac/utils/KojacTypes';
// import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
// import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';
// import KojacEmberModel from 'ember-kojac/utils/ember/KojacEmberModel';
//
//
//
// describe("Kojac Override", function() {
//
//
// 	it("meta returns the same object each time, and subclasses return a different object", function() {
// 		var RndModel = Ember.Object.extend({});
// 		var SubModel1 = RndModel.extend({});
// 		var SubModel2 = RndModel.extend({});
//
// 		expect( Ember.meta(RndModel) ).to.be.truthy;
// 		expect( Ember.meta(RndModel)===Ember.meta(RndModel)).to.be.truthy;
// 		expect( Ember.meta(RndModel).descs ).to.be.truthy;
// 		expect( Ember.meta(RndModel).descs===Ember.meta(RndModel).descs ).to.be.truthy;
//
// 		expect( Ember.meta(SubModel1) ).to.be.truthy;
// 		expect( Ember.meta(SubModel1)!==Ember.meta(RndModel) ).to.be.truthy;
// 		expect( Object.getPrototypeOf(Ember.meta(SubModel1))===Object.getPrototypeOf(Ember.meta(RndModel)) ).to.be.truthy;
//
// 		//expect( Ember.meta(SubModel1).descs ).to.be.truthy;
// 		//expect( Ember.meta(SubModel1).descs!==Ember.meta(RndModel).descs ).to.be.truthy;
// 		//expect( Object.getPrototypeOf(Ember.meta(SubModel1).descs)===Object.getPrototypeOf(Ember.meta(RndModel).descs)).to.be.truthy;
//
// 		expect( Ember.meta(SubModel2) ).to.be.truthy;
// 		//expect( Ember.meta(SubModel2).descs ).to.be.truthy;
// 		expect( Ember.meta(SubModel1)!==Ember.meta(SubModel2) ).to.be.truthy;
// 		//expect( Ember.meta(SubModel1).descs!==Ember.meta(SubModel2).descs ).to.be.truthy;
// 	});
//
// 	it("instances have their own meta", function() {
// 		var RndModel = Ember.Object.extend({});
// 		var rndModel = RndModel.create();
// 		expect( Ember.meta(RndModel) ).to.be.truthy;
// 		expect( Ember.meta(rndModel) ).to.be.truthy;
// 		expect( Ember.meta(rndModel)!==Ember.meta(RndModel) ).to.be.truthy;
// 	});
//
// 	it("instance proto === class", function() {
// 		var RndModel = Ember.Object.extend({});
// 		var rndModel = RndModel.create({});
// 		expect(rndModel.constructor === RndModel).to.be.truthy;
// 		expect(Object.getPrototypeOf(RndModel) === Object.getPrototypeOf(Ember.Object)).to.be.truthy;
// 		expect(Object.getPrototypeOf(RndModel) !== Ember.Object).to.be.truthy;
// 	});
//
// 	it("override get and set", function() {
// 		//var RndModel = Ember.Object.extend({});
// 		var SubModel1 = KojacEmberModel.extend({
// 			name: KojacTypes.Int
// 		});
// 		//var SubModel2 = RndModel.extend({});
// 		var subModel1 = SubModel1.create({
// 			name: 'fred'
// 		});
// 		console.log(subModel1.get('name'));
// 		subModel1.set('name','john');
// 		console.log(subModel1.get('name'));
// 	});
// });
