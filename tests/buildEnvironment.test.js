import 'chai/register-expect.js';
import { buildEnvironment } from '../out/Environment.js';
import { forEachProperty, isConfigNode, isFunction } from '../out/helpers.js';

const testEnvNames = [
    'Dev',
    'Test',
    'Prod'
];

describe('buildEnvironment', () => {
    const testErrorFn = (envNames) => {
        // Arrange.
        const envName = 'Dev';

        // Act.
        const act = () => buildEnvironment(envName, envNames);

        // Assert.
        expect(act).to.throw(Error);
    }
    it('Should throw an error if the environment names array is empty.', () => testErrorFn([]));
    it('Should throw an error if the environment names array is not an array.', () => testErrorFn({}));
    it('Should throw an error if the environment names array is null.', () => testErrorFn(null));
    it('Should throw an error if the environment names array is undefined.', () => testErrorFn(undefined));
    it('Should create an IEnvironmentDefinition object if only given the current environment name.', () => {
        // Arrange.
        const envName = 'Dev';

        // Act.
        const env = buildEnvironment(envName, testEnvNames);

        // Assert.
        expect(isConfigNode(env.current)).to.be.true;
        expect(env.current.name).to.equal(envName);
    });
    it('Should save the provided environment names in the all property.', () => {
        // Arrange.
        const envName = 'Dev';

        // Act.
        const env = buildEnvironment(envName, testEnvNames);

        // Assert.
        expect(env.all).to.have.same.members(testEnvNames);
    });
    it('Should create one environment check function for each environment name.', () => {
        // Arrange.
        const envName = 'Dev';

        // Act.
        const env = buildEnvironment(envName, testEnvNames);

        // Assert.
        const foundFns = [];
        forEachProperty(env, (key, value) => {
            if (key.startsWith('is') && isFunction(value)) {
                foundFns.push(key);
            }
        });
        expect(foundFns.length).to.equal(testEnvNames.length);
        expect(foundFns).to.have.same.members(testEnvNames.map(x => `is${x}`));
    });
    const missingEnvNameTest = (envDef) => {
        // Act.
        const act = () => buildEnvironment(envDef, testEnvNames);

        // Assert.
        expect(act).to.throw(Error);
    };
    it('Should throw an error if the provided environment name is not part of the list of environment names (name only).', () => missingEnvNameTest('MyDev'));
    it('Should throw an error if the provided environment name is not part of the list of environment names (IEnivironmentDefinition).', () => missingEnvNameTest({ name: 'MyDev' }));
    describe('hasTraits', () => {
        const traitMismatchTest = (envDef, testTraits) => {
            // Arrange.
            const env = buildEnvironment(envDef, testEnvNames);

            // Act.
            const act = () => env.hasTraits(testTraits);

            // Assert.
            expect(act).to.throw(TypeError);
        };
        it('Should throw if given a numeric test trait when the current environment traits are of the string kind.', () => traitMismatchTest({ name: 'Dev', traits: ['abc', 'def'] }, 3));
        it('Should throw if given a string test trait when the current environment traits are of the numeric kind.', () => traitMismatchTest({ name: 'Dev', traits: 3 }, 'def'));
        it('Should throw if given an array of string test traits when the current environment traits are of the numeric kind.', () => traitMismatchTest({ name: 'Dev', traits: 3 }, ['abc', 'def']));
        const runTestFn = (envDef, testTraits, expectedResult) => {
            // Arrange.
            const env = buildEnvironment(envDef, testEnvNames);

            // Act.
            const result = env.hasTraits(testTraits);

            // Assert.
            expect(result).to.equal(expectedResult);
        };
        describe('Numeric Traits', () => {
            it('Should return true if the test traits match the entirety of the current enviroment\'s traits.', () => runTestFn({ name: 'Dev', traits: 7 }, 7, true));
            it('Should return true if the test traits match a subset of the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: 7 }, 5, true));
            it('Should return false if one of the test traits is not found in the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: 7 }, 9, false));
        });
        describe('String Traits', () => {
            it('Should return true if the test traits match the entirety of the current enviroment\'s traits.', () => runTestFn({ name: 'Dev', traits: ['abc', 'def', 'ghi'] }, ['ghi', 'abc', 'def'], true));
            it('Should return true if the test traits match a subset of the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: ['abc', 'def', 'ghi'] }, ['abc', 'ghi'], true));
            it('Should return false if one of the test traits is not found in the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: ['abc', 'def', 'ghi'] }, ['abc', 'jkl'], false));
        });
    });
    describe('hasAnyTrait', () => {
        const traitMismatchTest = (envDef, testTraits) => {
            // Arrange.
            const env = buildEnvironment(envDef, testEnvNames);

            // Act.
            const act = () => env.hasAnyTrait(testTraits);

            // Assert.
            expect(act).to.throw();
        }
        it('Should throw if given a numeric test trait when the current environment traits are of the string kind.', () => traitMismatchTest({ name: 'Dev', traits: ['abc', 'def'] }, 3));
        it('Should throw if given a string test trait when the current environment traits are of the numeric kind.', () => traitMismatchTest({ name: 'Dev', traits: 3 }, ['abc', 'def']));
        const runTestFn = (envDef, testTraits, expectedResult) => {
            // Arrange.
            const env = buildEnvironment(envDef, testEnvNames);

            // Act.
            const result = env.hasAnyTrait(testTraits);

            // Assert.
            expect(result).to.equal(expectedResult);
        };
        describe('Numeric Traits', () => {
            it('Should return true if the test traits match the entirety of the current enviroment\'s traits.', () => runTestFn({ name: 'Dev', traits: 7 }, 7, true));
            it('Should return true if the test traits match a subset of the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: 7 }, 5, true));
            it('Should return true if at least one the test traits is found in the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: 7 }, 9, true));
            it('Should return false if none of the test traits are found in the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: 7 }, 24, false));
        });
        describe('String Traits', () => {
            it('Should return true if the test traits match the entirety of the current enviroment\'s traits.', () => runTestFn({ name: 'Dev', traits: ['abc', 'def', 'ghi'] }, ['ghi', 'abc', 'def'], true));
            it('Should return true if the test traits match a subset of the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: ['abc', 'def', 'ghi'] }, ['abc', 'ghi'], true));
            it('Should return true if at least one the test traits is found in the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: ['abc', 'def', 'ghi'] }, ['abc', 'jkl'], true));
            it('Should return false if none of the test traits are found in the current environment\'s traits.', () => runTestFn({ name: 'Dev', traits: ['abc', 'def', 'ghi'] }, ['jkl', 'mno'], false));
        });
    });
});
