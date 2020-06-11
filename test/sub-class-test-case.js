var AbstractTestCase = require('./abstract-test-case')
var TestFailure = require('../lib/test-failure')

class SubClassTestCase extends AbstractTestCase {
    constructor() {
        super()
    }

    testShouldBeCalled() {
        this.shouldThrow(() => {
            this.assert(false)
        }, TestFailure, 'Assertion failed.')
    
        var self = this
        this.shouldThrow(() => {
            self.testShouldNeverBeCalled()
        }, TestFailure, 'Assertion failed.')
    }
}

module.exports = SubClassTestCase