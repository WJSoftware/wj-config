import 'chai/register-expect.js';
import DictionaryDataSource from '../out/DictionaryDataSource.js';

describe('DictionaryDataSource', () => {
    it('Should name itself as "Dictionary" upon construction.', () => {
        // Act.
        const ds = new DictionaryDataSource({}, ':');

        // Assert.
        expect(ds.name).to.equal('Dictionary');
    });
    const failedConstructionTest = (dic, sep) => {
        // Act.
        const act = () => new DictionaryDataSource(dic, sep);

        // Assert.
        expect(act).to.throw(Error);
    };
    const failedConstructionTests = [
        {
            dic: 123,
            sep: ':',
            target: 'dictionary',
            text: 'a number'
        },
        {
            dic: 'hi',
            sep: ':',
            target: 'dictionary',
            text: 'a string'
        },
        {
            dic: true,
            sep: ':',
            target: 'dictionary',
            text: 'a Boolean'
        },
        {
            dic: new Date(),
            sep: ':',
            target: 'dictionary',
            text: 'a date'
        },
        {
            dic: [],
            sep: ':',
            target: 'dictionary',
            text: 'an empty array'
        },
        {
            dic: '',
            sep: ':',
            target: 'dictionary',
            text: 'an empty string'
        },
        {
            dic: ['abc'],
            sep: ':',
            target: 'dictionary',
            text: 'an array'
        },
        {
            dic: () => false,
            sep: ':',
            target: 'dictionary',
            text: 'a function'
        },
        {
            dic: null,
            sep: ':',
            target: 'dictionary',
            text: 'null'
        },
        {
            dic: undefined,
            sep: ':',
            target: 'dictionary',
            text: 'undefined'
        },
        {
            dic: { 'key': 'value' },
            sep: '',
            target: 'hierarchy separator',
            text: 'an empty string'
        },
        {
            dic: { 'key': 'value' },
            sep: null,
            target: 'hierarchy separator',
            text: 'null'
        },
        {
            dic: { 'key': 'value' },
            sep: undefined,
            target: 'hierarchy separator',
            text: 'undefined'
        },
        {
            dic: { 'key': 'value' },
            sep: () => false,
            target: 'hierarchy separator',
            text: 'a function'
        },
        {
            dic: { 'key': 'value' },
            sep: [],
            target: 'hierarchy separator',
            text: 'an empty array'
        },
        {
            dic: { 'key': 'value' },
            sep: ['def'],
            target: 'hierarchy separator',
            text: 'an array'
        },
        {
            dic: { 'key': 'value' },
            sep: {},
            target: 'hierarchy separator',
            text: 'an empty object'
        },
        {
            dic: { 'key': 'value' },
            sep: { 'ab': 'cd' },
            target: 'hierarchy separator',
            text: 'an object'
        },
    ];
    failedConstructionTests.forEach(t => {
        it(`Should throw an error if constructed with ${t.text} for ${t.target}.`, () => failedConstructionTest(t.dic, t.sep));
    });
    describe('getObject', () => {
        it('Should throw an error if the provided dictionary was not a flat object.', () => {
            // Arrange.
            const dic = {
                prop1: 123, prop2: {
                    prop3: 'abc'
                }
            };
            const ds = new DictionaryDataSource(dic, ':');

            // Act.
            const act = async () => await ds.getObject();

            // Assert.
            expect(act).to.throw(Error);
        });
        const successfulResultsTest = async (dic, expectedResult, prefix) => {
            // Arrange.
            const ds = new DictionaryDataSource(dic, ':', prefix);

            // Act.
            const result = await ds.getObject();

            // Assert.
            expect(result).to.be.deep.equal(expectedResult);
        };
        const successfulResultsTests = [
            {
                prefix: undefined,
                dic: { prop1: 'abc', prop2: 123 },
                expected: { prop1: 'abc', prop2: 123 }
            }
        ];
        // it('Should return the inflat', () => );
        // it('', () => );
        // it('', () => );
        // it('', () => );
        // it('', () => );
    });
});
