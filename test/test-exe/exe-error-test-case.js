var TestCase = require('../../lib/test-runner').TestCase
class ExeErrorTestCase extends TestCase {
    constructor() {
        super()
    }

    static shouldExcludeDuringMassTests() {
        return true
    }

    static shouldLogErrorStack() {
        return false
    }

    testPromiseWithCallback(onTestPerformed) {
        return new Promise((resolve, reject) => {})
    }

	testError() {
        foo.bar()
	}
}

module.exports = ExeErrorTestCase