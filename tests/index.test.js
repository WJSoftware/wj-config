import 'chai/register-expect.js';
import { Builder } from '../out/Builder.js';
import * as allExports from '../out/index.js';

describe('All Exports', () => {
    it('Should export buildEnvironment function.', () => {
        // Assert.
        expect(allExports.buildEnvironment).to.exist;
    });
    it('Should export the EnvironmentDefinition class.', () => {
        // Assert.
        expect(allExports.EnvironmentDefinition).to.exist;
    });
    it('Should export the DataSource class.', () => {
        // Assert.
        expect(allExports.DataSource).to.exist;
    });
    it('Should export the entry function as default.', () => {
        // Assert.
        expect(allExports.default).to.exist;
        expect(allExports.default).to.be.a('function');
    });
});
describe('wjConfig', () => {
    it('Should return a builder object when called.', () => {
        // Act.
        const result = allExports.default();

        // Assert.
        expect(result).to.be.instanceOf(Builder);
    });
})