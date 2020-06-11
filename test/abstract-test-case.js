var TestCase = require('../lib/test-case')

class AbstractTestCase extends TestCase {
    constructor() {
        super()
    }

    static isAbstract() {
        return this.name === 'AbstractTestCase'
    }

    testShouldNeverBeCalled() {
        this.assert(false)
    }
}

module.exports = AbstractTestCase