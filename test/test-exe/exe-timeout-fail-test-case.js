var TestCase = require('../../lib/test-runner').TestCase
class ExeTimeoutFailTestCase extends TestCase {
    constructor() {
        super()
    }

    static shouldExcludeDuringMassTests() {
        return true
    }

	testFailAssertion() {
        this.assert(1 === 2)
	}

	testError() {
        foo.bar()
	}

    testTimeout(onTestPerformed) {
        setTimeout(() => {
            onTestPerformed()
        }, TestCase.testCaseTimeout() + 1)
    }
}

module.exports = ExeTimeoutFailTestCase