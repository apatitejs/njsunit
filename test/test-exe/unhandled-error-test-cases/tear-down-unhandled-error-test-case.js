var TestCase = require('../../../lib/test-case')
var TestEventEmitter = require('./test-event-emitter')

class TearDownUnhandledErrorTestCase extends TestCase {
	constructor() {
        super()
    }

    static shouldExcludeDuringMassTests() {
        return true
    }

    tearDown(onTearDownDone) {
        var evtEmitter = new TestEventEmitter()
        var self = this
        evtEmitter.on('tearDownEvent', () => {
            self.assert(false)
        })
        setTimeout(() => {
            evtEmitter.emit('tearDownEvent')
        }, 5)
    }

	testUnhandledError() {
	}
}

module.exports = TearDownUnhandledErrorTestCase