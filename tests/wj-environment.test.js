require('chai').should();
const environment = require('../src/wj-environment');
const helpers = require('../src/helpers');

const testEnvNames = [
    'Dev',
    'Test',
    'Prod'
];

describe('wj-environment', () => {
    const testErrorFn = (envNames) => {
        // Arrange.
        const envName = 'Dev';

        // Act.
        const act = () => environment(envName, envNames);

        // Assert.
        act.should.throw(Error);
    }
    it('Should throw an error if the environment names array is empty.', () => testErrorFn([]));
    it('Should throw an error if the environment names array is not an array.', () => testErrorFn({}));
    it('Should throw an error if the environment names array is null.', () => testErrorFn(null));
    it('Should throw an error if the environment names array is undefined.', () => testErrorFn(undefined));
    it('Should save the provided environment name in the value property.', () => {
        // Arrange.
        const envName = 'Dev';

        // Act.
        const env = environment(envName, testEnvNames);

        // Assert.
        env.value.should.equal(envName);
    });
    it('Should save the provided environment names in the names property.', () => {
        // Arrange.
        const envName = 'Dev';

        // Act.
        const env = environment(envName, testEnvNames);

        // Assert.
        env.names.should.have.same.members(testEnvNames);
    });
    it('Should create one environment check function for each environment name.', () => {
        // Arrange.
        const envName = 'Dev';

        // Act.
        const env = environment(envName, testEnvNames);

        // Assert.
        const foundFns = [];
        helpers.forEachProperty(env, (key, value) => {
            if (key.startsWith('is') && helpers.isFunction(value)) {
                foundFns.push(key);
            }
        });
        foundFns.length.should.equal(testEnvNames.length);
        foundFns.should.have.same.members(testEnvNames.map(x => `is${x}`));
    });
    it('Should throw an error if the provided environment name is not part of the list of environment names.', () => {
        // Arrange.
        const envName = 'MyDev';

        // Act.
        const act = () => environment(envName, testEnvNames);

        // Assert.
        act.should.throw(Error);
    });
});
