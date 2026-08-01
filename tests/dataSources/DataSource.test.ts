import { describe, it, expect } from 'vitest';
import { DataSource } from '../../src/dataSources/DataSource.js';

describe('DataSource', () => {
    it('Should make the name given during construction available through the "name" property.', () => {
        // Arrange.
        const name = 'myDS';

        // Act.
        const ds = new DataSource(name);

        // Assert
        expect(ds.name).toBe(name);
    });
    it('Should return a trace object with the values of the "name" and "index" properties.', () => {
        // Arrange.
        const name = 'myDS';
        const index = 3;
        const ds = new DataSource(name);
        ds.index = index;

        // Act.
        const trace = ds.trace();

        // Assert.
        expect(trace).toEqual({ name: name, index: index });
    });
});
