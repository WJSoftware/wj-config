require('chai').should();
const helpers = require('../src/helpers');
const merge = require('../src/merge');

describe('merge', () => {
    const testValidationArg1Fn = arg => {
        // Act.
        const act = () => merge(arg, null);

        // Assert.
        act.should.throw(Error);
    };
    it('Should throw if the first argument is null.', () => testValidationArg1Fn(null));
    it('Should throw if the first argument is undefined.', () => testValidationArg1Fn(undefined));
    it('Should throw if the first argument is not an object.', () => testValidationArg1Fn([]));
    const testValidationArg2Fn = (arg, shouldThrow) => {
        // Act.
        const act = () => merge({}, arg);

        // Assert.
        if (shouldThrow) {
            act.should.throw(Error);
        }
        else {
            act.should.not.throw();
        }
    };
    it('Should not throw if the second argument is null.', () => testValidationArg2Fn(null, false));
    it('Should not throw if the second argument is undefined.', () => testValidationArg2Fn(undefined, false));
    it('Should throw if the second argument is not an object.', () => testValidationArg2Fn(456, true));
    const propertyMismatchTestFn = (config1, config2) => {
        // Act.
        const act = () => merge(config1, config2);

        // Assert.
        act.should.throw(Error);
    };
    it('Should throw an error if the value of a property in object 1 is an object but in object 2 is a scalar value.', () => propertyMismatchTestFn({
        p1: 'Set A',
        p2: {
            p2_p1: true
        },
        p3: 123
    }, {
        p1: 'Set B',
        p2: false,
        p3: 456
    }));
    it('Should throw an error if the value of a property in object 1 is an object but in object 2 is an array.', () => propertyMismatchTestFn({
        p1: 'Set A',
        p2: {
            p2_p1: true
        },
        p3: 123
    }, {
        p1: 'Set B',
        p2: [true, false],
        p3: 456
    }));
    it('Should throw an error if the value of a property in object 1 is a scalar value but in object 2 is an object.', () => propertyMismatchTestFn({
        p1: 'Set A',
        p2: {
            p2_p1: true
        },
        p3: 123
    }, {
        p1: {
            p1_p1: 'Set B'
        },
        p2: {
            p2_p1: false
        },
        p3: 456
    }));
    it('Should throw an error if the value of a property in object 1 is an array value but in object 2 is an object.', () => propertyMismatchTestFn({
        p1: 'Set A',
        p2: {
            p2_p1: true
        },
        p3: [123]
    }, {
        p1: 'Set B',
        p2: {
            p2_p1: false
        },
        p3: {
            p3_p1: [456]
        }
    }));
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
        const allProps = [];
        helpers.forEachProperty(config1, key => { allProps.push(key); });
        helpers.forEachProperty(config2, key => {
            if (!allProps.includes(key)) {
                allProps.push(key);
            }
        });

        // Act.
        const result = merge(config1, config2);

        // Assert.
        const resultProps = [];
        helpers.forEachProperty(result, key => { resultProps.push(key); });
        resultProps.should.have.same.members(allProps);
    });
    it('Should create a result whose property values are from object 2 properties whenever they exist, and if not, from object 1 properties.', () => {
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

        // Act.
        const result = merge(config1, config2);

        // Assert.
        helpers.forEachProperty(result, (key, value) => {
            if (config2[key]) {
                value.should.equal(config2[key]);
            }
            else {
                value.should.equal(config1[key]);
            }
        });
    });
});
