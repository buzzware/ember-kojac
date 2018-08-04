// import {afterEach, beforeEach, describe, it} from 'mocha';
// import {assert,expect} from 'chai';
//
// import Ember from 'ember';
// import { computed } from '@ember/object';
// import EmberObject from '@ember/object';
//
// import Kojac from 'ember-kojac/utils/Kojac';
// import KojacTypes from 'ember-kojac/utils/KojacTypes';
// import KojacObjectFactory from 'ember-kojac/utils/KojacObjectFactory';
// import EmberFramework from 'ember-kojac/utils/ember/EmberFramework';
// import KojacEmberModel from 'ember-kojac/utils/ember/KojacEmberModel';
//
// describe("Kojac Ember Model", function() {
//
// 	var product1Values = {
// 		name: String,
// 		purchases: KojacTypes.Int,
// 		weight: Number,
// 		isMember: Boolean,
// 		start: Date
// 	};
// 	var Product1 = KojacEmberModel.extend(product1Values);
//
// 	// can only include static values here ie not a Date or other object
// 	var product2Values = {
// 		name: 'John',
// 		purchases: 56,
// 		weight: 12.3,
// 		isMember: true
// 	};
// 	var Product2 = KojacEmberModel.extend(product2Values);
//
// 	var wrongProductValues = {
// 		name: 123,
// 		purchases: 2.34,
// 		weight: [],
// 		isMember: 1,
// 		start: "2010-06-01T23:59:56+08:00"
// 	};
//
// 	it("extend and check null values", function() {
// 		var product = Product1.create();
// 		expect(product.get('name')).to.be.null;
// 		expect(product.get('purchases')).to.be.null;
// 		expect(product.get('weight')).to.be.null;
// 		expect(product.get('isMember')).to.be.null;
// 		expect(product.get('start')).to.be.null;
// 		//expect(Product1.getDefinitions()).to.equal(product1Values);
// 	});
//
// 	it("extend and check non-null values", function() {
// 		var product = Product2.create();
// 		expect(product.get('name')).to.equal(product2Values.name);
// 		expect(product.get('purchases')).to.equal(product2Values.purchases);
// 		expect(product.get('weight')).to.equal(product2Values.weight);
// 		expect(product.get('isMember')).to.equal(product2Values.isMember);
// 		expect(product.get('name')).to.equal(product2Values.name);
// 		expect(product.get('purchases')).to.equal(product2Values.purchases);
// 		expect(product.get('weight')).to.equal(product2Values.weight);
// 		expect(product.get('isMember')).to.equal(product2Values.isMember);
// //		expect(Product2.getDefinitions()).to.equal({
// //			name: String,
// //			purchases: KojacTypes.Int,
// //			weight: Number,
// //			isMember: Boolean
// //		});
// 	});
//
// 	it("Ember.Object extend and create", function() {
// 		var product3def = {
// 			name: 'Fred',
// 			shape: 'circle'
// 		};
// 		var Product3 = KojacEmberModel.extend(product3def);
// 		var product3 = Product3.create();
// 		expect(product3.get('name')).to.equal('Fred');
// 		expect(product3.get('shape')).to.equal('circle');
//
// 		product3 = Product3.create();
// 		expect(product3.get('name')).to.equal(product3def.name);
// 		product3 = Product3.create({});
// 		expect(product3.get('name')).to.equal(product3def.name);
// 		product3 = Product3.create({name: 'John', colour: 'red'});
// 		expect(product3.get('name')).to.equal('John');
// 		expect(product3.get('shape')).to.equal('circle');
// 		expect(product3.get('colour')).to.equal('red');
// 	});
//
// 	it("check create values", function() {
// 		var product = Product1.create(product2Values);
// 		expect(product.get('name')).to.equal(product2Values.name);
// 		expect(product.get('purchases')).to.equal(product2Values.purchases);
// 		expect(product.get('weight')).to.equal(product2Values.weight);
// 		expect(product.get('isMember')).to.equal(product2Values.isMember);
// 	});
//
// 	it("check create values requiring conversion", function() {
// 		//moment().zone(8);
// 		var product = Product1.create(wrongProductValues);
// 		expect(product.get('name')).to.equal('123');
// 		expect(product.get('purchases')).to.equal(2);
// 		expect(product.get('weight')).to.equal(null);
// 		expect(product.get('isMember')).to.equal(true);
// 		expect(product.get('start')).to.eql(new Date(Date.UTC(2010,5,1,15,59,56)));
// 	});
//
// 	it("check set values requiring conversion", function() {
// 		//moment().zone(8);
// 		var product = Product1.create();
// 		for (var p in wrongProductValues)
// 			product.set(p,wrongProductValues[p]);
// 		//person.setProperties(wrongProductValues);
// 		expect(product.get('name')).to.equal('123');
// 		expect(product.get('purchases')).to.equal(2);
// 		expect(product.get('weight')).to.equal(null);
// 		expect(product.get('isMember')).to.equal(true);
//     expect(product.get('start')).to.eql(new Date(Date.UTC(2010,5,1,15,59,56)));
// 	});
//
// 	it("check setProperties values requiring conversion", function() {
// 		//moment().zone(8);
// 		var product = Product1.create();
// 		product.setProperties(wrongProductValues);
// 		expect(product.get('name')).to.equal('123');
// 		expect(product.get('purchases')).to.equal(2);
// 		expect(product.get('weight')).to.equal(null);
// 		expect(product.get('isMember')).to.equal(true);
//     expect(product.get('start')).to.eql(new Date(Date.UTC(2010,5,1,15,59,56)));
// 	});
//
// 	it("check init", function() {
// 		var initValues = {
// 			name: 'Jeffery',
// 			purchases: 5,
// 			weight: 2.4,
// 			isMember: true
// 		};
// 		var productValuesWithInit = {
// 			name: 'XXX',
// 			purchases: 3,
// 			weight: 1.2,
// 			isMember: false,
// 			init: function() {
// 				this._super();
// 				for (var p in initValues) {
// 					if (p=='weight')
// 						continue;
// 					this.set(p,initValues[p]);
// 				}
// 			}
// 		};
// 		var Product3 = KojacEmberModel.extend(productValuesWithInit);
// 		var product = Product3.create();
// 		expect(product.get('name')).to.equal(initValues.name);
// 		expect(product.get('purchases')).to.equal(initValues.purchases);
// 		expect(product.get('isMember')).to.equal(initValues.isMember);
// 		expect(product.get('weight')).to.equal(productValuesWithInit.weight);
// 	});
//
// 	it("check computed property", function() {
// 		var initValues = {
// 			first_name: 'Jeffery',
// 			last_name: 'Watt',
// 			full_name: computed(function() {
// 				return this.get('first_name')+' '+this.get('last_name');
// 			})
// 		};
// 		var Cust = EmberObject.extend(initValues);
// 		var cust = Cust.create();
// 		expect(cust.get('first_name')).to.equal(initValues.first_name);
// 		expect(cust.get('last_name')).to.equal(initValues.last_name);
// 		expect(cust.get('full_name')).to.equal(initValues.first_name+' '+initValues.last_name);
// 	});
//
// 	it("real world example", function() {
// 		var App = {};
// 		App.FinanceProvider = KojacEmberModel.extend({
// 			id: KojacTypes.Int,
// 			name: String
// 		});
// 		App.FinanceProviders = [
// 			App.FinanceProvider.create({
// 				id: 1,
// 				name: 'GE Automotive'
// 			}),
// 			App.FinanceProvider.create({
// 				id: 2,
// 				name: 'St George Bank'
// 			}),
// 			App.FinanceProvider.create({
// 				id: 3,
// 				name: 'Esanda ANZ'
// 			})
// 		];
// 		expect(App.FinanceProviders[0].get('id')).to.equal(1);
// 		expect(App.FinanceProviders[0].get('name')).to.equal('GE Automotive');
// 		expect(App.FinanceProviders[1].get('id')).to.equal(2);
// 		expect(App.FinanceProviders[1].get('name')).to.equal('St George Bank');
// 	});
//
// });
