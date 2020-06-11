var TestResult = require('./test-result')

class TestSuite {
    constructor(name) {
        this.name = name
        this.tests = []
        this.currentTestCase = null
    }

    addTest(testCase) {
        this.tests.push(testCase)
    }

    run(onTestsRan) {
        var self = this
        var result = new TestResult()
        var onUncaughtException = function(err) {
            self.handleUncaughtException(err)
        }
        process.on('uncaughtException', onUncaughtException)
        this.runTests(result, this.tests, () => {
            process.removeListener('uncaughtException', onUncaughtException)
            self.currentTestCase = null
            onTestsRan(result)
        })
    }

    handleUncaughtException(err) {
        var stepName = this.currentTestCase.getCurrStepNameInProgress()
        this.currentTestCase.onTestFailureOrError(stepName, err)
    }

    runTests(result, tests, onTestsRan) {
        if (tests.length === 0)
            return onTestsRan()

        this.currentTestCase = tests.shift()
        var self = this
        this.currentTestCase.runCase(result, () => {
            self.runTests(result, tests, onTestsRan)
        })
    }

}

module.exports = TestSuite