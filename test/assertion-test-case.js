var TestCase = require('../lib/test-case')
var TestFailure = require('../lib/test-failure')

class AssertionTestCase extends TestCase {
	constructor() {
        super()
    }

    testPromise() {
        var self = this
        var promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 5)
        })

        return promise.then(() => {
            self.shouldThrow(() => {
                self.assert(false, null, 'Failed assertion test in a promise.')
            }, TestFailure)
        })
    }

    testAllPassAssertions() {
        this.shouldNotThrow(() => {
            this.assert(1 === 1)
        }, TestFailure)

        this.shouldNotThrow(() => {
            this.assertNull(null)
        }, TestFailure)

        this.shouldNotThrow(() => {
            this.assertUndefined(undefined)
        }, TestFailure)

        this.shouldNotThrow(() => {
            this.assertNullOrUndefined(null)
            this.assertNullOrUndefined(undefined)
        }, TestFailure)

        this.shouldNotThrow(() => {
            this.assertNotNull(25)
        }, TestFailure)

        this.shouldNotThrow(() => {
            this.assertNotUndefined(25)
        }, TestFailure)

        this.shouldNotThrow(() => {
            this.assertNotNullOrUndefined(25)
        }, TestFailure)

        this.shouldNotThrow(() => {
            this.assertEqual(25, 25)
        }, TestFailure)

        this.shouldNotThrow(() => {
            this.assertNotEqual(1, 25)
        }, TestFailure)
    }

    testAllFailAssertions() {
        this.shouldThrow(() => {
            this.assert(1 === 2, null, 'Failed assertion test: When equality assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed.')

        this.shouldThrow(() => {
            this.assert(1 === 2, '1 was expected to be equal to 2?', 'Failed assertion test: When equality assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, '1 was expected to be equal to 2?')

        this.shouldThrow(() => {
            this.assertNull(24, null, 'Failed assertion test: When null assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Expected value to be null.')

        this.shouldThrow(() => {
            this.assertNull(24, 'Value should have been null? No way.', 'Failed assertion test: When null assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, 'Value should have been null? No way.')

        this.shouldThrow(() => {
            this.assertUndefined(24, null, 'Failed assertion test: When undefined assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Expected value to be undefined.')

        this.shouldThrow(() => {
            this.assertUndefined(24, 'Value should have been undefined? No way.', 'Failed assertion test: When undefined assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, 'Value should have been undefined? No way.')

        this.shouldThrow(() => {
            this.assertNullOrUndefined(24, null, 'Failed assertion test: When null or undefined assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Expected value to be either null or undefined.')

        this.shouldThrow(() => {
            this.assertNullOrUndefined(24, 'Value should have been null or undefined? No way.', 'Failed assertion test: When null or undefined assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, 'Value should have been null or undefined? No way.')

        this.shouldThrow(() => {
            this.assertNotNull(null, null, 'Failed assertion test: When not null assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Did not expect value to be null.')

        this.shouldThrow(() => {
            this.assertNotNull(null, 'Value should have been NOT null? No way.', 'Failed assertion test: When not null assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, 'Value should have been NOT null? No way.')

        this.shouldThrow(() => {
            this.assertNotUndefined(undefined, null, 'Failed assertion test: When not undefined assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Did not expect value to be undefined.')

        this.shouldThrow(() => {
            this.assertNotUndefined(undefined, 'Value should have been NOT undefined? No way.', 'Failed assertion test: When not undefined assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, 'Value should have been NOT undefined? No way.')

        this.shouldThrow(() => {
            this.assertNotNullOrUndefined(null, null, 'Failed assertion test: When not null or undefined assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Did not expect value to be either null or undefined.')

        this.shouldThrow(() => {
            this.assertNotNullOrUndefined(null, 'Value should have been NOT null or undefined? No way.', 'Failed assertion test: When not null or undefined assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, 'Value should have been NOT null or undefined? No way.')

        this.shouldThrow(() => {
            this.assertNotNullOrUndefined(undefined, null, 'Failed assertion test: When not null or undefined (undefined case) assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Did not expect value to be either null or undefined.')

        this.shouldThrow(() => {
            this.assertNotNullOrUndefined(undefined, 'Value should have been NOT null or undefined? No way.', 'Failed assertion test: When not null or undefined (undefined case) assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, 'Value should have been NOT null or undefined? No way.')

        this.shouldThrow(() => {
            this.assertEqual(1, 2, null, 'Failed assertion test: When equality assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Values should have been equal. Expected: "1", Actual: "2"')

        this.shouldThrow(() => {
            this.assertEqual(1, 2, '1 == 2?', 'Failed assertion test: When equality assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, '1 == 2?')

        this.shouldThrow(() => {
            this.assertNotEqual(1, 1, null, 'Failed assertion test: When not equal assertion fails, the default assertion text should be displayed.')
        }, TestFailure, 'Assertion failed. Values should not have been equal. Expected: "1", Actual: "1"')

        this.shouldThrow(() => {
            this.assertNotEqual(1, 1, '1 !== 1?', 'Failed assertion test: When not equal assertion fails, the custom assertion text should be displayed.')
        }, TestFailure, '1 !== 1?')

        var self = this
        this.shouldThrow(() => {
            self.shouldThrow(() => {
                foo.bar()
            }, SyntaxError, null, 'Fail when wrong error class instead of expected error class.')
        }, TestFailure, 'Should have thrown an error of class SyntaxError. But ReferenceError was thrown.')

        this.shouldThrow(() => {
            self.shouldThrow(() => {
                self.assert(25 === 25)
            }, ReferenceError, null, 'Fail when wrong error class instead of expected error class.')
        }, TestFailure, 'Should have thrown an error of class ReferenceError. But no error was thrown.')

        this.shouldThrow(() => {
            self.shouldThrow(() => {
                foo.bar()
            }, ReferenceError, 'bar is not defined', 'Fail when error is thrown with a different expected error test.')
        }, TestFailure, 'Error was thrown as expected but the error message was "foo is not defined" instead of "bar is not defined".')

        this.shouldThrow(() => {
            self.shouldNotThrow(() => {
                foo.bar()
            }, SyntaxError)
        }, Error, 'foo is not defined')

        this.shouldThrow(() => {
            self.shouldNotThrow(() => {
                foo.bar()
            }, ReferenceError)
        }, TestFailure, 'Should not have thrown an error of class ReferenceError.')

        this.shouldThrow(() => {
            self.shouldNotThrow(() => {
                foo.bar()
            }, ReferenceError, 'foo is not defined')
        }, TestFailure, 'Should not have thrown an error of class ReferenceError with message: "foo is not defined".')
    }

}

module.exports = AssertionTestCase