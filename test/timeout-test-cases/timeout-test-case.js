var TestCase = require('../../lib/test-case')

class TimeoutTestCase extends TestCase {
	constructor() {
        super()
    }

	testTimeout(onTestPerformed) {
	}

    throwForStepTimeout(stepName) {
        if (stepName === 'test') {
            this.shouldThrow(() => {
                super.throwForStepTimeout(stepName)
            }, Error, `test still running after timeout of 2000 ms.
If this is expected then override the static method TestCase#testCaseTimeout in your test
case class and return the expected timeout in milliseconds else probably you forgot to call
callback() passed as argument.`)
            this.onTestAbortedOrFinished()
        } else {
            super.throwForStepTimeout(stepName)
        }
    }
}

module.exports = TimeoutTestCase