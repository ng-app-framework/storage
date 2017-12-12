import {Converter} from "../../src/app/Service/Interface/Converter";
import {ObjectConverter} from "../../src/app/Service/Impl/ObjectConverter";

describe('ObjectConverter', () => {
    let converter: Converter = null;

    beforeAll(() => {
        converter = new ObjectConverter();
    });

    // Fixtures

    let getFunctionedObject = function () {
        return {
            foo: function () {
            },
            bar: () => {

            }
        };
    };
    let getCircularObject   = function () {
        let object1  = {
            ref1: null,
            prop: 'bob'
        };
        let object2  = {
            ref2: null,
            prop: 'sam'
        };
        object1.ref1 = object2;
        object2.ref2 = object1;
        return object1;
    };

    // Assertions

    let assertToStringDoesNotThrow   = function (value: any) {
        expect(() => {
            converter.toString(value);
        }).not.toThrow();
    };
    let assertFromStringDoesNotThrow = function (value: any) {
        expect(() => {
            converter.fromString(value);
        }).not.toThrow();
    };

    // Test Cases

    describe('toString', () => {
        it('should be able to convert an object with a scalar property to a string', () => {
            assertToStringDoesNotThrow({foo: 'bar'});
        });
        it('should be able to convert an object with an array property to a string', () => {
            assertToStringDoesNotThrow({foo: ['bar', 'baz']});
        });
        it('should be able to convert an object with an object property to a string', () => {
            assertToStringDoesNotThrow({foo: {bar: 'baz'}});
        });
        it('should be able to filter out functions when converting to a string', () => {
            assertToStringDoesNotThrow(getFunctionedObject());
            expect(converter.toString(getFunctionedObject())).toEqual('{}');
        });
        it('should be able to filter circular references when converting to a string', () => {
            assertToStringDoesNotThrow(getCircularObject());
        });
        it('should return an empty string when scalar values are converted to string (This is an OBJECT Converter)', () => {
            expect(converter.toString(123)).toEqual('');
        });
        it('should not throw when an object fails to convert', () => {
            assertToStringDoesNotThrow(123);
        });
        it('should only return properties that are specified that can be converted to string', () => {
            expect(converter.toString({"shouldReturn": "1", "shouldNotReturn": "woo!"}, (key) => {
                return key !== 'shouldNotReturn';
            })).toEqual('{"shouldReturn":"1"}');
        });
    });
    describe('fromString', () => {

        it('should return an object when providing a json string', () => {
            expect(converter.fromString('{"property":"value"}')).toEqual({property: 'value'});
        });
        it('should return an empty object when parsing fails for a string to object', () => {
            expect(converter.fromString('[')).toEqual({});
        });
        it('should not throw when an object fails to convert', () => {
            assertFromStringDoesNotThrow('[');
        });
        it('should only return properties that are specified that can be converted from string', () => {
            expect(converter.fromString('{"shouldReturn":"1","shouldNotReturn":"woo!"}', (key) => {
                return key !== 'shouldNotReturn';
            })).toEqual({shouldReturn: "1"});
        })
    });
});
