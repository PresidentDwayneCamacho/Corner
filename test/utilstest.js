/**
 * controller test
 */


var chai = require('chai');
var expect = chai.expect;


var regexFactor = require('../utils/utils');


describe('regexFactor',function(){
    it('tests if string is an email address',function(){
        expect(regexFactor('abe@cpp.edu')).to.not.be.null;
        expect(regexFactor('a@cpp.edu')).to.not.be.null;
        expect(regexFactor('abcemail')).to.be.null;
        expect(regexFactor('reuters.com')).to.be.null;
        expect(regexFactor('hconner@')).to.be.null;
        expect(regexFactor('')).to.be.null;
    });
    it('tests if email address is from @cpp.edu',function(){
        expect(regexFactor('gregario@cpp.edu')).to.not.be.null;
        expect(regexFactor('akldsnf@cpp.edu')).to.not.be.null;
        expect(regexFactor('andy@gmail.com')).to.be.null;
        expect(regexFactor('rcohn@cpp.com')).to.be.null;
    });
    it('returns the prefix of address, i.e. expression before @cpp.edu',function(){
        expect(regexFactor('gharm@cpp.edu')).to.equal('gharm');
        expect(regexFactor('cchristy@cpp.edu')).to.equal('cchristy');
        expect(regexFactor('z@cpp.edu')).to.equal('z');
    });
    it('prevents empty prefixes, i.e. @cpp.edu ',function(){
        expect(regexFactor('@cpp.edu')).to.be.null;
    });
    it('prevents non-alphabetic characters, though this may not be correct',function(){
        expect(regexFactor('123@cpp.edu')).to.be.null;
        expect(regexFactor('a2b3@cpp.edu')).to.be.null;
        expect(regexFactor('ewrw!!@cpp.edu')).to.be.null;
    });
});
