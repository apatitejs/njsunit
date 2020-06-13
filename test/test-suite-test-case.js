const TestCase = require('../lib/test-case')
const TestSuite = require('../lib/test-suite')

class TestSuiteTestCase extends TestCase {
    constructor() {
        super()
    }

    testBuildElapsedTimeStr() {
        const testSuite = new TestSuite()
        let startTimestamp = new Date(2020, 0, 1)
        let endTimestamp = new Date(2020, 0, 1)
        let actualResult = testSuite.buildElapsedTimeStr(startTimestamp, endTimestamp)
        this.assert(actualResult === '0 ms', null, 'Test 0 ms elapsed time.')

        startTimestamp = new Date(2020, 0, 1, 12, 30, 15)
        endTimestamp = new Date(2020, 0, 1, 12, 30, 25)
        actualResult = testSuite.buildElapsedTimeStr(startTimestamp, endTimestamp)
        this.assert(actualResult === '10 secs', null, 'Test 10 secs elapsed time.')

        startTimestamp = new Date(2020, 0, 1, 12, 30)
        endTimestamp = new Date(2020, 0, 1, 12, 40)
        actualResult = testSuite.buildElapsedTimeStr(startTimestamp, endTimestamp)
        this.assert(actualResult === '10 mins', null, 'Test 10 mins elapsed time.')

        startTimestamp = new Date(2020, 0, 1, 12)
        endTimestamp = new Date(2020, 0, 1, 14)
        actualResult = testSuite.buildElapsedTimeStr(startTimestamp, endTimestamp)
        this.assert(actualResult === '2 hours', null, 'Test 2 hours elapsed time.')

        startTimestamp = new Date(2020, 0, 1)
        endTimestamp = new Date(2020, 0, 3)
        actualResult = testSuite.buildElapsedTimeStr(startTimestamp, endTimestamp)
        this.assert(actualResult === '2 days', null, 'Test 2 days elapsed time.')
    }
}

module.exports = TestSuiteTestCase