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
            dic: { a: { b: 1 }},
            sep: ':',
            target: 'dictionary',
            text: 'a non-flat object'
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
    const successfulConstructionTests = [
        {
            dic: { a: 'b' },
            sep: ':',
            text: 'a flat object',
            target: 'dictionary',
        },
        {
            dic: { a: 'b' },
            sep: ':',
            text: '":"',
            target: 'hierarchy separator',
        },
        {
            dic: { a: 'b' },
            sep: '_',
            text: '"_"',
            target: 'hierarchy separator',
        },
        {
            dic: { a: 'b' },
            sep: '__',
            text: '"__"',
            target: 'hierarchy separator',
        },
        {
            dic: { a: 'b' },
            sep: '_sep_',
            text: '"_sep_"',
            target: 'hierarchy separator',
        },
    ];
    const successfulConstructionTest = (dic, sep) => {
        // Act.
        const dds = new DictionaryDataSource(dic, sep);

        // Assert.
        expect(!!dds).to.be.true;
    };
    successfulConstructionTests.forEach(t => {
        it(`Should successfully construct with ${t.text} for ${t.target}.`, () => successfulConstructionTest(t.dic, t.sep));
    });
    const prefixTests = [
        {
            prefix: 'ThePrefix_',
            succeeds: true,
        },
        {
            prefix: (n) => !!n,
            text: 'a function',
            succeeds: true,
        },
        {
            prefix: true,
            succeeds: false,
        },
        {
            prefix: false,
            succeeds: false,
        },
        {
            prefix: 1,
            succeeds: false,
        },
        {
            prefix: new Date(),
            text: 'a date object',
            succeeds: false,
        },
        {
            prefix: new Map(),
            text: 'a map object',
            succeeds: false,
        },
        {
            prefix: new Set(),
            text: 'a set object',
            succeeds: false,
        },
        {
            prefix: new WeakMap(),
            text: 'a weak map object',
            succeeds: false,
        },
        {
            prefix: '',
            text: 'an empty string',
            succeeds: false,
        },
    ];
    const prefixTest = (prefix, succeeds) => {
        // Act.
        const act = () => new DictionaryDataSource({ a: 1 }, ':', prefix);

        // Assert.
        let expectation = expect(act);
        if (succeeds) {
            expectation = expectation.not;
        }
        expectation.to.throw();
    };
    prefixTests.forEach(t => {
        it(`Should ${t.succeeds ? 'succeed' : 'fail'} when trying to construct the data source with "${t.text ?? t.prefix}" as prefix.`, () => prefixTest(t.prefix, t.succeeds));
    });
    const validationWithPrefixTests = [
        {
            dic: { p_a: 1, b: 2, c: { c_p: true } },
            prefix: 'p_',
        },
        {
            dic: { a: 1, b: 2, invalid: { c_p: true } },
            prefix: (n) => n !== 'invalid',
            text: 'a function'
        },
    ];
    const validationWithPrefixTest = (dic, prefix) => {
        // Act.
        const act = () => new DictionaryDataSource(dic, ':', prefix);

        // Assert.
        expect(act).not.to.throw();
    };
    validationWithPrefixTests.forEach(t => {
        it(`Should validate the dictionary using "${t.text ?? t.prefix}" as prefix.`, () => validationWithPrefixTest(t.dic, t.prefix));
    });
    describe('getObject', () => {
        it('Should throw an error if the provided dictionary function returns a non-flat object.', async () => {
            // Arrange.
            const dic = {
                prop1: 123, prop2: {
                    prop3: 'abc'
                }
            };
            const ds = new DictionaryDataSource(() => dic, ':');
            let didThrow = false;

            // Act.
            try {
                await ds.getObject();
            }
            catch {
                didThrow = true;
            }

            // Assert.
            expect(didThrow).to.equal(true);
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
