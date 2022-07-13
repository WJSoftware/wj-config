require('chai').should();
const helpers = require('../src/helpers');
const makeWsUrlFunctions = require('../src/makeWsUrlFunctions');

describe('makeWsUrlFunctions', () => {
    const incorrectTypeTestFn = (obj, shouldThrow) => {
        // Act.
        const act = () => makeWsUrlFunctions(obj);

        // Assert.
        if (shouldThrow) {
            act.should.throw(Error);
        }
        else {
            act.should.not.throw();
        }
    }
    it('Should not throw an error if given null as object.', () => incorrectTypeTestFn(null, false));
    it('Should not throw an error if given undefined as object.', () => incorrectTypeTestFn(undefined, false));
    it('Should throw an error if given a non-object.', () => incorrectTypeTestFn(123, true));
    it('Should identify the first object with host or rootPath as the root object.');
    it('Should identify one root object per branch.');
    it('Should not alter any object in the hierarchy if no root object is found.');
    it('Should not convert any properties found on objects above the root object.');
    it('Should not convert any properties whose name start with an underscore.');
    it('Should not convert the reserved properties host, scheme, port, rootPath and buildUrl.');
    it('Should convert any properties in the root object whose name is not reserved and does not start with underscore.');
    it('Should convert any properties in child objects of a root object whose name is not reserved and does not start with underscore.');
    describe('buildUrl', () => {
        it('Should build a relative path if no host is provided.');
        it('Should build an absolute URL if a host is provided.');
        it('Should build a URL with the http scheme if a host is provided and no scheme is provided.');
        it('Should build a URL with a port number if a port is provided.');
        it('Should build a URL with the provided host, scheme and port.');
        it('Should build a URL with all the rootPath values in its hierarchy path.');
        it('Should build a URL with no route replacements if no replacement object, function or array is provided.');
        it('Should build a URL with replaceable route values replaced if a replacement object is provided.');
        it('Should build a URL with replaceable route values replaced if a replacement function is provided.');
        it('Should build a URL with replaceable route values replaced if a replacement array is provided.');
    });
});
