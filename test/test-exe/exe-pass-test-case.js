var TestCase = require('../../lib/test-runner').TestCase
class ExePassTestCase extends TestCase {
    constructor() {
        super()
    }

    static shouldExcludeDuringMassTests() {
        return true
    }

	testPassAssertion() {
        this.assert(1 === 1)
	}
}

module.exports = ExePassTestCase