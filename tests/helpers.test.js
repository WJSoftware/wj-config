import 'chai/register-expect.js';
import { isArray, isConfig, isFunction, forEachProperty, attemptParse } from '../out/helpers.js'; 

describe('helpers', () => {
    describe('isArray', () => {
        const testFn = (testObj, expectedResult) => {
            // Act.
            const result = isArray(testObj);

            // Assert.
            expect(result).to.equal(expectedResult);
        };
        it('Should return true if the given object is an empty array.', () => testFn([], true));
        it('Should return true if the given object is an array.', () => testFn([1, 'A'], true));
        it('Should return false if the given object is null.', () => testFn(null, false));
        it('Should return false if the given object is undefined.', () => testFn(undefined, false));
        it('Should return false if the given object is a number.', () => testFn(1, false));
        it('Should return false if the given object is a string.', () => testFn('ABC', false));
        it('Should return false if the given object is a Boolean.', () => testFn(true, false));
        it('Should return true if the given object is an arrow function.', () => testFn(() => { }, false));
        it('Should return true if the given object is an anonymous function.', () => testFn(function () { }, false));
        it('Should return true if the given object is a named function.', () => testFn(namedFunction, false));
        it('Should return false if the given object is an empty object.', () => testFn({}, false));
        it('Should return false if the given object is an object.', () => testFn({ a: 'b' }, false));
    });
    describe('isObject', () => {
        const testFn = (testObj, expectedResult) => {
            // Act.
            const result = isConfig(testObj);

            // Assert.
            expect(result).to.equal(expectedResult);
        };
        it('Should return false if the given object is an empty array.', () => testFn([], false));
        it('Should return false if the given object is an array.', () => testFn([1, 'A'], false));
        it('Should return true if the given object is null.', () => testFn(null, true));
        it('Should return false if the given object is undefined.', () => testFn(undefined, false));
        it('Should return false if the given object is a number.', () => testFn(1, false));
        it('Should return false if the given object is a string.', () => testFn('ABC', false));
        it('Should return false if the given object is a Boolean.', () => testFn(true, false));
        it('Should return false if the given object is a date.', () => testFn(new Date(), false));
        it('Should return true if the given object is an arrow function.', () => testFn(() => { }, false));
        it('Should return true if the given object is an anonymous function.', () => testFn(function () { }, false));
        it('Should return true if the given object is a named function.', () => testFn(namedFunction, false));
        it('Should return true if the given object is an empty object.', () => testFn({}, true));
        it('Should return true if the given object is an object.', () => testFn({ a: 'b' }, true));
    });
    describe('isFunction', () => {
        const testFn = (testObj, expectedResult) => {
            // Act.
            const result = isFunction(testObj);

            // Assert.
            expect(result).to.equal(expectedResult);
        };
        it('Should return false if the given object is an empty array.', () => testFn([], false));
        it('Should return false if the given object is an array.', () => testFn([1, 'A'], false));
        it('Should return false if the given object is null.', () => testFn(null, false));
        it('Should return false if the given object is undefined.', () => testFn(undefined, false));
        it('Should return false if the given object is a number.', () => testFn(1, false));
        it('Should return false if the given object is a string.', () => testFn('ABC', false));
        it('Should return false if the given object is a Boolean.', () => testFn(true, false));
        it('Should return true if the given object is an arrow function.', () => testFn(() => { }, true));
        it('Should return true if the given object is an anonymous function.', () => testFn(function () { }, true));
        it('Should return true if the given object is a named function.', () => testFn(namedFunction, true));
        it('Should return false if the given object is an empty object.', () => testFn({}, false));
        it('Should return false if the given object is an object.', () => testFn({ a: 'b' }, false));
    });
    describe('forEachProperty', () => {
        function TestObj() {
            this.a = 'A';
            this.b = 'B';
            this.c = 'C';
        }
        TestObj.prototype.protoProperty = true;
        const testObj = new TestObj();
        it('Should throw an error if the provided callback is not a function.', () => {
            // Act.
            const act = () => forEachProperty(testObj, 1);

            // Assert.
            expect(act).to.throw(Error);
        });
        it('Should only enumerate the direct properties of an object.', () => {
            // Arrange.
            let counter = 0;

            // Act.
            forEachProperty(testObj, () => { ++counter; });

            // Assert.
            expect(counter).to.equal(3);
        });
        const loopControlTestFn = (returnObj, expectedLoopCount) => {
            // Arrange.
            let counter = 0;

            // Act.
            forEachProperty(testObj, () => { ++counter; return returnObj; })

            // Assert.
            expect(counter).to.equal(expectedLoopCount);
        };
        it('Should break the loop if the callback function returns true.', () => loopControlTestFn(true, 1));
        it('Should break the loop if the callback function returns a non-empty string.', () => loopControlTestFn('A', 1));
        it('Should break the loop if the callback function returns a number other than zero.', () => loopControlTestFn(777, 1));
        it('Should break the loop if the callback function returns an object.', () => loopControlTestFn({}, 1));
        it('Should continue the loop if the callback function returns false.', () => loopControlTestFn(false, 3));
        it('Should continue the loop if the callback function returns an empty string.', () => loopControlTestFn('', 3));
        it('Should continue the loop if the callback function returns zero.', () => loopControlTestFn(0, 3));
        it('Should continue the loop if the callback function returns null.', () => loopControlTestFn(null, 3));
        it('Should continue the loop if the callback function returns undefined.', () => loopControlTestFn(undefined, 3));
    });
    describe('attemptParse', () => {
        it('Should throw an error if the provided value is not a string.', () => {
            //Act.
            const act = () => attemptParse(true);

            // Assert.
            expect(act).to.throw(Error);
        });
        const conversionTestCases = [
            {
                value: false,
                type: 'Boolean'
            },
            {
                value: true,
                type: 'Boolean'
            },
            {
                value: 0,
                type: 'Integer'
            },
            {
                value: 1,
                type: 'Integer'
            },
            {
                value: 77,
                type: 'Integer'
            },
            {
                value: -1,
                type: 'Integer'
            },
            {
                value: -1234567890123456,
                type: 'Integer'
            },
            {
                value: 1234567890123456,
                type: 'Integer'
            },
            {
                value: 0.0,
                type: 'Floating Point'
            },
            {
                value: 0.123546,
                type: 'Floating Point'
            },
            {
                value: 3.14159265359,
                type: 'Floating Point'
            },
            {
                value: 1239980.383,
                type: 'Floating Point'
            },
            {
                value: -1.554,
                type: 'Floating Point'
            },
            {
                value: -0.54658879,
                type: 'Floating Point'
            },
            {
                value: 0.5E-74,
                type: 'Floating Point'
            },
            {
                value: 456e300,
                type: 'Floating Point'
            },
            {
                value: 7.54567e045,
                type: 'Floating Point'
            },
            {
                value: 4.889e+57,
                type: 'Floating Point'
            },
            {
                value: 5.87e-1,
                type: 'Floating Point'
            }
        ];
        const conversionTestFn = (value) => {
            // Act.
            const result = attemptParse(value.toString());

            // Assert.
            expect(result).to.be.a(typeof value);
            expect(result).to.equal(value);
        }
        conversionTestCases.forEach((testCase) => {
            it(`Should convert the ${testCase.type} value ${testCase.value} to its native data type.`, () => conversionTestFn(testCase.value));
        });
        const hexTestCases = [
            {
                value: '0x23312',
                expected: 0x23312
            },
            {
                value: '0xaFD12',
                expected: 0xaFD12
            },
            {
                value: '0xabcdef',
                expected: 0xabcdef
            },
            {
                value: '0xABCDEF',
                expected: 0xABCDEF
            },
            {
                value: '0x09456A',
                expected: 0x09456A
            },
            {
                value: '0x0000F',
                expected: 0xF
            },
            {
                value: '0xFFFFFFDDDDDDD',
                expected: 0xFFFFFFDDDDDDD
            },
        ]
        const hexTestFn = (value, expectedValue) => {
            // Act.
            const result = attemptParse(value);

            // Assert.
            expect(result).to.equal(expectedValue);
        };
        hexTestCases.forEach(testCase => {
            it(`Should convert the hexadecimal value ${testCase.value} to its decimal value ${testCase.expected}.`, () => hexTestFn(testCase.value, testCase.expected));
        });
        const stringTestCases = [
            {
                value: 'The quick brown fox',
                name: 'a string'
            },
            {
                value: {},
                name: 'an empty object'
            },
            {
                value: { a: 1 },
                name: 'an object'
            },
            {
                value: [],
                name: 'an empty array'
            },
            {
                value: [1, 2],
                name: 'an array'
            },
            {
                value: () => { },
                name: 'an arrow function'
            },
            {
                value: namedFunction,
                name: 'a named function'
            },
            {
                value: function () { },
                name: 'an anonymous function'
            }
        ];
        const stringTestFn = (value) => {
            // Act.
            const result = attemptParse(value);

            // Assert.
            expect(result).to.be.a('string');
            expect(result).to.equal(value.toString());
        }
        stringTestCases.forEach(testCase => {
            it(`Should return the string representation of ${testCase.name}.`, () => stringTestFn(testCase.value.toString()));
        });
    });
    function namedFunction() { }
});
