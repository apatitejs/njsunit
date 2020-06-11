var TestCase = require('../../../lib/test-case')
var TestEventEmitter = require('./test-event-emitter')

class SetUpUnhandledErrorTestCase extends TestCase {
	constructor() {
        super()
    }

    static shouldExcludeDuringMassTests() {
        return true
    }

    setUp(onSetUpDone) {
        var evtEmitter = new TestEventEmitter()
        var self = this
        evtEmitter.on('setUpEvent', () => {
            self.assert(false)
        })
        setTimeout(() => {
            evtEmitter.emit('setUpEvent')
        }, 5)
    }

	testUnhandledError() {
	}
}

module.exports = SetUpUnhandledErrorTestCase