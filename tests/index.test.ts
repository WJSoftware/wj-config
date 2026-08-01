import { describe, it, expect } from 'vitest';
import { Builder } from '../src/builders/Builder.js';
import * as allExports from '../src/index.js';

describe('All Exports', () => {
    it('Should export buildEnvironment function.', () => {
        // Assert.
        expect(allExports.buildEnvironment).toBeDefined();
    });
    it('Should export the EnvironmentDefinition class.', () => {
        // Assert.
        expect(allExports.EnvironmentDefinition).toBeDefined();
    });
    it('Should export the entry function as default.', () => {
        // Assert.
        expect(allExports.default).toBeDefined();
        expect(typeof allExports.default).toBe('function');
    });
});
describe('wjConfig', () => {
    it('Should return a builder object when called.', () => {
        // Act.
        const result = allExports.default();

        // Assert.
        expect(result).toBeInstanceOf(Builder);
    });
});
