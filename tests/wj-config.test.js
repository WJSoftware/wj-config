const should = require('chai').should();
const helpers = require('../src/helpers');
const wjConfig = require('../src/wj-config');

const testEnv = 'Development';
const emptyJsons = [{}, {}];

describe('wj-config', () => {
    it('Should throw an error if the provided options is not an object.', () => {
        // Act.
        const act = () => wjConfig(emptyJsons, testEnv, 123);

        // Assert.
        act.should.throw(Error);
    });
    it('Should add environment variables whenever includeEnv is true.', () => {
        // Arrange.
        const options = {
            includeEnv: true,
            env: {
                OPT_envOption: 'ABC'
            }
        };

        // Act.
        const config = wjConfig(emptyJsons, testEnv, options);

        // Assert.
        should.equal(config.envOption, options.env.OPT_envOption);
    });
    it('Should merge the properties from the 2 JSON objects.', () => {
        // Arrange.
        const main = {
            mainProp: true
        };
        const override = {
            overrideProp: 123
        };

        // Act.
        const config = wjConfig([main, override], testEnv);

        // Assert.
        should.equal(config.mainProp, main.mainProp);
        should.equal(config.overrideProp, override.overrideProp);
    });
    it('Should merge the properties from the 2 JSON objects using the second object as override for common properties.', () => {
        // Arrange.
        const main = {
            prop1: 123
        };
        const override = {
            prop1: 456
        };

        // Act.
        const config = wjConfig([main, override], testEnv);

        // Assert.
        config.prop1.should.equal(override.prop1);
    });
    it('Should add the environment property to the resulting configuration object.', () => {
        // Act.
        const config = wjConfig(emptyJsons, testEnv);

        // Assert.
        should.exist(config.environment);
    });
    it('Should save the passed environment name in the environment.value property.', () => {
        // Act.
        const config = wjConfig(emptyJsons, testEnv);

        // Assert.
        should.equal(config.environment.value, testEnv);
    });
    const jsonSourceTestFn = (source) => {
        // Act.
        const config = wjConfig(source, testEnv);

        // Assert.
        should.exist(config.mainProp);
        should.exist(config.overrideProp);
    };
    const mainJson = { mainProp: 1 };
    const overrideJson = { overrideProp: 2 };
    it('Should accept the 2 main JSON sources as properties "main" and "override" of a single object.', () => jsonSourceTestFn({ main: mainJson, override: overrideJson }));
    it('Should accept the 2 main JSON sources as the elements of a 2-element array.', () => jsonSourceTestFn([mainJson, overrideJson]));
    it('Should accept the 2 main JSON sources as a function that when called returns the JSON sources.', () => jsonSourceTestFn(n => n === testEnv ? overrideJson : mainJson));
    it('Should create functions out of leaf properties in the specified objects in the wsPropertyNames property.', () => {
        // Arrange.
        json = {
            ws: {
                host: 'localhost',
                url1: '/abc'
            }
        };

        // Act.
        const config = wjConfig([json, {}], testEnv);

        // Assert.
        should.exist(config.ws.buildUrl);
        config.ws.url1.should.be.a('function');
    });
});
