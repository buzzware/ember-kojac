import {afterEach, beforeEach, describe, it} from 'mocha';
import {assert,expect} from 'chai';

import _ from 'lodash';
import bf from 'ember-kojac/utils/BuzzFunctions';

import Kojac from 'ember-kojac/utils/Kojac';
import KojacTypes from 'ember-kojac/utils/KojacTypes';
import KojacObject from 'ember-kojac/utils/KojacObject';

describe("KojacObject", function() {

	it("JRs tests",function(){
		var Person = KojacObject.extend({
		  //init: function(isDancing){
		  //  this.dancing = isDancing;
		  //},
		  dance: function(){
		    return this.dancing;
		  }
		});
		var Ninja = Person.extend({
		  init: function(){
		    this._super({dancing: false});
		  },
		  dance: function(){
		    // Call the inherited version of dance()
		    return this._super();
		  },
		  swingSword: function(){
		    return true;
		  }
		});

		var p = new Person({dancing: true});
		expect(p.dance()).to.be.ok;

		var n = new Ninja();
		expect(n.dance()).to.not.be.ok;
		expect(n.swingSword()).to.be.ok;

		// Should all be true
		expect(p instanceof Person).to.be.ok;
		expect(p instanceof KojacObject).to.be.ok;
		expect(n instanceof Ninja).to.be.ok;
		expect(n instanceof Person).to.be.ok;
		expect(n instanceof KojacObject).to.be.ok;
	});

	it("test _super", function() {

		var Person = KojacObject.extend({
//			init: function(aProperties){
//				this.dancing = isDancing;
//			},
			dance: function(){
				return this.dancing;
			}
		});
		var Ninja = Person.extend({
			init: function(){
				this._super({dancing: false});
			},
			dance: function(){
				// Call the inherited version of dance()
				return this._super();
			},
			swingSword: function(){
				return true;
			}
		});

		var p = new Person({dancing: true});
		expect(p.dance()).to.be.ok;

		var n = new Ninja();
		expect(n.dance()).to.not.be.ok;
		expect(n.swingSword()).to.be.ok;

		// Should all be true
		expect(p instanceof Person).to.be.ok;
		expect(p instanceof KojacObject).to.be.ok;
		expect(n instanceof Ninja).to.be.ok;
		expect(n instanceof Person).to.be.ok;
		expect(n instanceof KojacObject).to.be.ok;

	});

	it("KojacObject descendant should clone objects and arrays when used as class default values when extending, but not when instantiating", function(){
		var OpDefObject = {};
		var values = {
      anObject: OpDefObject,
      aNumber: 5
    };
		values.anArray = [];
		var Op = KojacObject.extend(values);
		var op1 = new Op();
		var op2 = new Op();
		expect(op1.aNumber).to.equal(5);
		expect(op2.aNumber).to.equal(5);
		op2.aNumber = 7;
		expect(op2.aNumber).to.equal(7);

		expect(op1.anObject).not.to.equal(OpDefObject);
		op1.anObject.something = "elephant";
		expect(op1.anObject).to.eql({something: "elephant"});
		expect(op2.anObject).not.to.equal(OpDefObject);
		expect(op2.anObject).to.eql({});

		var instanceObject = {name: 'instanceObject'};
		var op3 = new Op({anObject: instanceObject});
		expect(op3.anObject).to.equal(instanceObject);

		expect(op3.toJSON).to.not.be.undefined;
	});

	it("KojacObject should not clone objects or arrays when used as instance values", function(){
		var anObject = {};
		var anArray = [];
		var op = new KojacObject({
			anObject: anObject,
			anArray: anArray,
			aNumber: 5
		});
		expect(op.aNumber).to.equal(5);
		expect(op.anObject).to.equal(anObject);
		expect(op.anArray).to.equal(anArray);
		expect(op.toJSON).to.not.be.undefined;
	});

	it("create base class and object", function() {

		var Person = KojacObject.extend({
			dancing: false
		});
		var Ninja = Person.extend({
			dancing: true
		});

		var p = new Person();
		expect(p.dancing).to.not.be.ok;
		p = new Person({dancing: true});
		expect(p.dancing).to.be.ok;

		var n = new Ninja();
		expect(n.dancing).to.be.ok;
		n = new Ninja({dancing: false});
		expect(n.dancing).to.not.be.ok;

	});

	it("test if KojacObject methods are bound", function() {
		var TestModel3 = KojacObject.extend({
			count: 4,
			inc: function() {
				this.count += 1;
			}
		});
		var testModel3 = new TestModel3();
		expect(testModel3.count).to.equal(4);
		testModel3.inc();
		expect(testModel3.count).to.equal(5);

		var TestModel4 = TestModel3.extend({
			inc2: function() {
				this.count += 1;
			}
		});
		var testModel4 = new TestModel4();
		expect(testModel4.count).to.equal(4);
		testModel4.inc();
		expect(testModel4.count).to.equal(5);
		testModel4.inc2();
		expect(testModel4.count).to.equal(6);

		var testModel42 = new TestModel4();
		expect(testModel42.count).to.equal(4);

	});

});

