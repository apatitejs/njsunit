var TestCase = require('../lib/test-case')

class ErrorTestCase extends TestCase {
	constructor() {
        super()
    }

	testReferenceError() {
        this.shouldThrow(() => {
            foo.bar()
        }, ReferenceError, 'foo is not defined')
	}
}

module.exports = ErrorTestCase