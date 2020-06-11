var TestCase = require('../../lib/test-case')

class SetUpTimeoutTestCase extends TestCase {
	constructor() {
        super()
    }

	setUp(onSetupDone) {
	}

	testSetUpTimeout(onTestPerformed) {
        onTestPerformed()
	}

    throwForStepTimeout(stepName) {
        if (stepName === 'setUp') {
            this.shouldThrow(() => {
                super.throwForStepTimeout(stepName)
            }, Error, `setUp still running after timeout of 2000 ms.
If this is expected then override the static method TestCase#testCaseTimeout in your test
case class and return the expected timeout in milliseconds else probably you forgot to call
callback() passed as argument.`)
            this.onTestAbortedOrFinished()
        } else {
            super.throwForStepTimeout(stepName)
        }
    }
}

module.exports = SetUpTimeoutTestCase