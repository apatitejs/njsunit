var TestCase = require('../../lib/test-case')

class TearDownTimeoutTestCase extends TestCase {
	constructor() {
        super()
    }

	tearDown(onTearDownDone) {
	}

	testTearDownTimeout(onTestPerformed) {
        onTestPerformed()
	}

    throwForStepTimeout(stepName) {
        if (stepName === 'tearDown') {
            this.shouldThrow(() => {
                super.throwForStepTimeout(stepName)
            }, Error, `tearDown still running after timeout of 2000 ms.
If this is expected then override the static method TestCase#testCaseTimeout in your test
case class and return the expected timeout in milliseconds else probably you forgot to call
callback() passed as argument.`)
            this.onTestAbortedOrFinished()
        } else {
            super.throwForStepTimeout(stepName)
        }
    }
}

module.exports = TearDownTimeoutTestCase