var TestCase = require('../../../lib/test-case')
var TestEventEmitter = require('./test-event-emitter')

class UnhandledErrorTestCase extends TestCase {
	constructor() {
        super()
    }

    static shouldExcludeDuringMassTests() {
        return true
    }

    testUnhandledError(onTestPerformed) {
        var evtEmitter = new TestEventEmitter()
        var self = this
        evtEmitter.on('testEvent', () => {
            self.assert(false)
        })
        setTimeout(() => {
            evtEmitter.emit('testEvent')
        }, 5)
    }
}

module.exports = UnhandledErrorTestCase