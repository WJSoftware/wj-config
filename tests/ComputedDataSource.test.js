import 'chai/register-expect.js';
import { ComputedDataSource } from '../out/ComputedDataSource.js';

describe('ComputedDataSource', async () => {
    const badConstructionTest = (arg) => {
        // Act.
        const act = () => new ComputedDataSource(arg);

        // Assert
        expect(act).to.throw(Error);
    };
    const badConstructionTests = [
        {
            arg: ['abc'],
            text: 'an array'
        },
        {
            arg: [],
            text: 'an empty array'
        },
        {
            arg: {},
            text: 'an empty object'
        },
        {
            arg: { test: 123 },
            text: 'an object'
        },
        {
            arg: 456,
            text: 'a number'
        },
        {
            arg: true,
            text: 'a Boolean'
        },
        {
            arg: 'abc',
            text: 'a string'
        },
        {
            arg: null,
            text: 'null'
        },
        {
            arg: undefined,
            text: 'undefined'
        }
    ];
    badConstructionTests.forEach(t => {
        it(`Should throw an error if constructed with ${t.text}.`, () => badConstructionTest(t.arg));
    });
    it('Should have the name "Computed" after construction.', () => {
        // Act.
        const ds = new ComputedDataSource(() => null);

        // Assert.
        expect(ds.name).to.equal('Computed');
    });
    const returnValueTest = async (fn, expectedRv) => {
        // Arrange.
        const ds = new ComputedDataSource(fn);

        // Act.
        const result = await ds.getObject();

        // Assert.
        expect(result).to.deep.equal(expectedRv);
    };
    it('Should return the return value of the synchronous function provided during construction.', async () => {
        const result = { v: 'abc' };
        const fn = () => result;
        await returnValueTest(fn, result);
    });
    it('Should return the return value of the asynchronous function provided during construction.', async () => {
        const result = { v: 'abc' };
        const fn = () => new Promise((rslv, rjct) => rslv(result));
        await returnValueTest(fn, result);
    });
});
