require('chai').should();
const helpers = require('../src/helpers');
const wjEnvConfig = require('../src/wj-env-config');

const countLeafProperties = (obj, counter, curKey) => {
    if (!counter) {
        counter = {};
    }
    let count = 0;
    helpers.forEachProperty(obj, (key, value) => {
        if (!helpers.isObject(value)) {
            ++count;
        }
        else {
            const newKey = curKey ? `${curKey}__${key}` : key;
            count += countLeafProperties(value, counter, newKey)[newKey];
        }
    });
    counter[curKey ?? 'Total'] = count;
    return counter;
};

const testPrefix = 'TST_';
const dummyEnv = { AA: 'aa' };

const buildEnvName = (names, prefix) => {
    prefix = prefix ?? testPrefix;
    if (typeof names === 'string') {
        return `${prefix}${names}`;
    }
    let finalName = prefix;
    names.forEach(name => {
        finalName += `${name}__`;
    });
    return finalName.substring(0, finalName.length - 2);
};

describe('wj-env-config', () => {
    const emptyObjectTestFn = (env) => {
        // Act.
        const result = wjEnvConfig(env, testPrefix);

        // Assert.
        let propertyCount = 0;
        helpers.forEachProperty(result, () => { ++propertyCount });
        propertyCount.should.equal(0);
    };
    it('Should return an empty object if the environment values source is null.', () => emptyObjectTestFn(null));
    it('Should return an empty object if the environment values source is undefined.', () => emptyObjectTestFn(undefined));
    it('Should return an empty object if the environment values source is not an object.', () => emptyObjectTestFn(true));
    const invalidPrefixTestFn = (prefix) => {
        // Act.
        const act = () => wjEnvConfig(dummyEnv, prefix);

        // Assert.
        act.should.throw(Error);
    }
    it('Should throw an error if the prefix is null.', () => invalidPrefixTestFn(null));
    it('Should throw an error if the prefix is undefined.', () => invalidPrefixTestFn(undefined));
    it('Should throw an error if the prefix is not a string.', () => invalidPrefixTestFn(123));
    it('Should throw an error if the prefix is an empty string.', () => invalidPrefixTestFn(''));
    const totalPropertyCountTestFn = (env, expectedLeafCount) => {
        // Act.
        const result = wjEnvConfig(env, testPrefix);

        // Assert.
        const leafPropertyCount = countLeafProperties(result);
        leafPropertyCount.Total.should.equal(expectedLeafCount);
    };
    it('Should ignore any environment variables that do not start with the prefix.', () => {
        const env = {};
        env[buildEnvName('AA', '')] = 'aa';
        env[buildEnvName('BB', '')] = 'bb';
        env[buildEnvName('CC', '')] = 'cc';
        totalPropertyCountTestFn(env, 0);
    });
    it('Should add properties based on environment variables that do start with the prefix.', () => {
        const env = {};
        env[buildEnvName('AA')] = 'aa';
        env[buildEnvName('BB')] = 'bb';
        env[buildEnvName('CC')] = 'cc';
        totalPropertyCountTestFn(env, 3);
    });
    const incompatibleValueTestFn = (env) => {
        // Act.
        const act = () => wjEnvConfig(env, testPrefix);

        // Assert.
        act.should.throw(Error);
    };
    it('Should throw an error if during the processing of environment variables, an object attempts to replace a scalar value.', () => {
        const env = {};
        env[buildEnvName(['AA'])] = 'aa';
        env[buildEnvName(['AA', 'L1'])] = 'aa1';
        incompatibleValueTestFn(env);
    });
    it('Should throw an error if during the processing of environment variables, a scalar value attempts to replace an object.', () => {
        const env = {};
        env[buildEnvName(['AA', 'L1'])] = 'aa1';
        env[buildEnvName(['AA'])] = 'aa';
        incompatibleValueTestFn(env);
    });
    const hierarchyTestFn = (env, counts) => {
        // Act.
        const result = wjEnvConfig(env, testPrefix);

        // Assert.
        const leafPropertyCount = countLeafProperties(result);
        helpers.forEachProperty(counts, (key, value) => {
            leafPropertyCount[key].should.equal(value);
        });
    };
    it('Should create a hierarchy of properties on the result object based the environment variable name.', () => {
        const env = {};
        env[buildEnvName(['Application', 'Title'])] = 'wj-config';
        env[buildEnvName(['Application', 'Version', 'Major'])] = '1';
        env[buildEnvName(['Application', 'Version', 'Minor'])] = '2';
        env[buildEnvName(['Application', 'Version', 'Revision'])] = '3';
        env[buildEnvName(['ws', 'gateway', 'host'])] = 'localhost';
        const counts = {
            Total: 5,
            Application: 4,
            Application__Version: 3,
            ws: 1,
            ws__gateway: 1
        };
        hierarchyTestFn(env, counts);
    });
});