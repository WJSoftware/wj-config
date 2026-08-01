import { describe, it, expect } from 'vitest';
import { forEachProperty } from '../src/helpers.js';
import merge from '../src/merge.js';
import type { ConfigurationNode } from '../src/wj-config.js';

describe('merge', () => {
    const testValidationArg1Fn = (arg: ConfigurationNode[]) => {
        // Act.
        const act = () => merge(arg);

        // Assert.
        expect(act).toThrow(Error);
    };
    // @ts-expect-error TS2322 Testing invalid argument type.
    it('Should throw if the first array element is null.', () => testValidationArg1Fn([null]));
    // @ts-expect-error TS2322 Testing invalid argument type.
    it('Should throw if the first array element is undefined.', () => testValidationArg1Fn([undefined]));
    // @ts-expect-error TS2322 Testing invalid argument type.
    it('Should throw if the first argument is not an array.', () => testValidationArg1Fn({}));
    const testValidationArg2Fn = (arg: ConfigurationNode, shouldThrow: boolean) => {
        // Act.
        const act = () => merge([{}, arg]);

        // Assert.
        if (shouldThrow) {
            expect(act).toThrow(Error);
        }
        else {
            expect(act).not.toThrow();
        }
    };
    // @ts-expect-error TS2345 Testing invalid types.
    it('Should not throw if any subsequent array element is null.', () => testValidationArg2Fn(null, false));
    // @ts-expect-error TS2345 Testing invalid types.
    it('Should not throw if any subsequent array element is undefined.', () => testValidationArg2Fn(undefined, false));
    // @ts-expect-error TS2345 Testing invalid types.
    it('Should throw if any subsequent array element is not an object.', () => testValidationArg2Fn(456, true));
    const propertyMismatchTestFn = (config1: Record<string, any>, config2: Record<string, any>) => {
        // Act.
        const act = () => merge([config1, config2]);

        // Assert.
        expect(act).toThrow(Error);
    };
    it('Should create a result that has all the properties defined in objects 1 and 2.', () => {
        // Arrange.
        const config1 = {
            p1: 'A',
            P2: 3,
            p3: false
        };
        const config2 = {
            p1: 'B',
            p3: true,
            p4: [1, 2, 3],
            p5: {
                p5_p1: 'Yes'
            }
        };
        const allProps: string[] = [];
        forEachProperty(config1, key => { allProps.push(key); });
        forEachProperty(config2, key => {
            if (!allProps.includes(key)) {
                allProps.push(key);
            }
        });

        // Act.
        const result = merge([config1, config2]);

        // Assert.
        const resultProps: string[] = [];
        forEachProperty(result, key => { resultProps.push(key.toString()); });
        expect(resultProps).toEqual(expect.arrayContaining(allProps));
    });
    it('Should create a result whose property values are from object 2 properties whenever they exist, and if not, from object 1 properties.', () => {
        // Arrange.
        const config1: Record<string, any> = {
            p1: 'A',
            P2: 3,
            p3: false
        };
        const config2: Record<string, any> = {
            p1: 'B',
            p3: true,
            p4: [1, 2, 3],
            p5: {
                p5_p1: 'Yes'
            }
        };

        // Act.
        const result = merge([config1, config2]);

        // Assert.
        forEachProperty(result, (key, value) => {
            if (config2[key]) {
                expect(value).toBe(config2[key]);
            }
            else {
                expect(value).toBe(config1[key]);
            }
        });
    });
});
