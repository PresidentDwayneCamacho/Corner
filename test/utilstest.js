/**
 * controller test
 */


var chai = require('chai');
var expect = chai.expect;


var chaiTest = require('../utils/utils');

describe('regexFactor',function(){
    it('tests if string is an email address',function(){
        expect(chaiTest.regexFactor('abe@cpp.edu')).to.not.be.null;
        expect(chaiTest.regexFactor('a@cpp.edu')).to.not.be.null;
        expect(chaiTest.regexFactor('abcemail')).to.be.null;
        expect(chaiTest.regexFactor('reuters.com')).to.be.null;
        expect(chaiTest.regexFactor('hconner@')).to.be.null;
        expect(chaiTest.regexFactor('')).to.be.null;
    });
    it('tests if email address is from @cpp.edu',function(){
        expect(chaiTest.regexFactor('gregario@cpp.edu')).to.not.be.null;
        expect(chaiTest.regexFactor('akldsnf@cpp.edu')).to.not.be.null;
        expect(chaiTest.regexFactor('andy@gmail.com')).to.be.null;
        expect(chaiTest.regexFactor('rcohn@cpp.com')).to.be.null;
        expect(chaiTest.regexFactor('rcohn@cpp.eduu')).to.be.null;
    });
    it('returns the prefix of address, i.e. expression before @cpp.edu',function(){
        expect(chaiTest.regexFactor('gharm@cpp.edu')).to.equal('gharm');
        expect(chaiTest.regexFactor('cchristy@cpp.edu')).to.equal('cchristy');
        expect(chaiTest.regexFactor('z@cpp.edu')).to.equal('z');
    });
    it('prevents empty prefixes, i.e. @cpp.edu ',function(){
        expect(chaiTest.regexFactor('@cpp.edu')).to.be.null;
    });
    it('prevents non-alphabetic characters, though this may not be correct',function(){
        expect(chaiTest.regexFactor('123@cpp.edu')).to.be.null;
        expect(chaiTest.regexFactor('a2b3@cpp.edu')).to.be.null;
        expect(chaiTest.regexFactor('ewrw!!@cpp.edu')).to.be.null;
    });
});

describe('isPrime',function(){
    it('tests if number is prime or not',function(){
        expect(chaiTest.isPrime(13)).to.be.true;
        expect(chaiTest.isPrime(24)).to.be.false;
        expect(chaiTest.isPrime(31)).to.be.true;
    });
});

describe('isPrime',function(){
    it('tests math function library',function(){
       var result = Math.max(1, 10);
        expect(result==10).to.be.true;
    });
});