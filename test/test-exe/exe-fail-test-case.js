var TestCase = require('../../lib/test-runner').TestCase
class ExeFailTestCase extends TestCase {
    constructor() {
        super()
    }

    static shouldExcludeDuringMassTests() {
        return true
    }

    testFailAssertWithPromise() {
        var self = this
        var promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 5)
        })

        return promise.then(() => {
            self.assert(false)
        })
    }

	testFailAssertion() {
        this.assert(1 === 2)
	}
}

module.exports = ExeFailTestCase