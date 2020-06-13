var TestResult = require('./test-result')

class TestSuite {
    constructor(name) {
        this.name = name
        this.tests = []
        this.totalTestCases = 0
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
        this.totalTestCases = this.tests.length
        process.on('uncaughtException', onUncaughtException)
        this.runTests(result, () => {
            process.removeListener('uncaughtException', onUncaughtException)
            self.currentTestCase = null
            onTestsRan(result)
        })
    }

    handleUncaughtException(err) {
        var stepName = this.currentTestCase.getCurrStepNameInProgress()
        this.currentTestCase.onTestFailureOrError(stepName, err)
    }

    runTests(result, onTestsRan) {
        if (this.tests.length === 0) {
            return onTestsRan()
        }

        this.currentTestCase = this.tests.shift()
        console.log(`${this.currentTestCase.displayString()}:`)
        const startTime = new Date()
        this.currentTestCase.runCase(result, () => {
            const endTime = new Date()
            console.log(`${this.currentTestCase.displayString()} finished in ${this.buildElapsedTimeStr(startTime, endTime)}`)
            console.log('')
            this.runTests(result, onTestsRan)
        }, (assertionResult, assertionDescr) => {
            let descr = assertionDescr ? assertionDescr : `Assertion ${assertionResult ? 'Passed' : 'Failed'}`
            if (assertionResult) {
                console.log('    \x1b[32m%s\x1b[0m', `[√] ${descr}`)
            } else {
                console.log('    \x1b[47m\x1b[31m%s\x1b[0m', `[×] ${descr}`)
            }
        })
    }

    buildElapsedTimeStr(startTimestamp, endTimestamp) {
        const secondInMs = 1000
        const minuteInMs = secondInMs * 60
        const hourInMs = minuteInMs * 60
        const dayInMs = hourInMs * 24
        let elapsedTimeInMs = endTimestamp - startTimestamp
        if (elapsedTimeInMs < secondInMs) {
            return `${elapsedTimeInMs} ms`
        } else if (elapsedTimeInMs < minuteInMs) {
            return `${elapsedTimeInMs / secondInMs} secs`
        } else if (elapsedTimeInMs < hourInMs) {
            return `${elapsedTimeInMs / minuteInMs} mins`
        } else if (elapsedTimeInMs < dayInMs) {
            return `${elapsedTimeInMs / hourInMs} hours`
        } else {
            return `${elapsedTimeInMs / dayInMs} days`
        }
    }
}

module.exports = TestSuite