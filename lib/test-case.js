var TestSuite = require('./test-suite')
var TestFailure = require('./test-failure')

class TestCase {
    constructor() {
        this.testSelector = ''
        this.testResult = null
        this.stepInProgress = {
            setUp: false,
            test: false,
            tearDown: false
        }
        this.hasFailure = false
        this.failureDescription = ''
        this.hasError = false
        this.errorDescription = ''
        this.failOrErrorStepName = ''
        this.abortTest = false
        this.testFinished = false
        this.onCaseRan = null
        this.stepTimeouts = []
        this.currentStepCallback = null
        this.onAsserted = null
    }

    static testCaseTimeout() {
        return 2000
    }

    static suiteClass() {
        return TestSuite;
    }

    static isAbstract() {
        return this.name === 'TestCase'
    }

    static shouldExcludeDuringMassTests() {
        return false
    }

    static selector(testSelector) {
        var newTestCase = new this()
        newTestCase.setTestSelector(testSelector)
        return newTestCase
    }

    static addTestsFromSelectors(suite) {
        var self = this
        var selectors = Object.getOwnPropertyNames(this.prototype).filter((propName) => {
            return (propName.indexOf('test') === 0) && (typeof self.prototype[propName] === 'function')
        })
        
        selectors.forEach((eachSelector) => {
            suite.addTest(self.selector(eachSelector))
        })
    }

    static shouldLogErrorStack() {
        return true
    }

    getCurrStepNameInProgress() {
        if (this.stepInProgress.setUp)
            return 'setUp'
        else if (this.stepInProgress.test)
            return 'test'
        else
            return 'tearDown'
    }
    setTestSelector(testSelector) {
        this.testSelector = testSelector
    }

    runCase(testResult, onCaseRan, onAsserted) {
        this.testResult = testResult
        this.onCaseRan = onCaseRan
        this.onAsserted = onAsserted
        var self = this
        this.performStep('setUp', 'setUp', () => {
            self.performStep('test', self.testSelector, () => {
                self.performStep('tearDown', 'tearDown', () => {
                    self.onTestAbortedOrFinished()
                })
            })
        })
    }

    onTestAbortedOrFinished() {
        if (!this.hasFailure && !this.hasError) {
            this.testResult.passed.push(this)
        }
        this.testResult = null
        this.testFinished = true
        this.clearStepTimeouts()
        this.onCaseRan()
    }

    onTestFailureOrError(stepName, error) {
        this.failOrErrorStepName = stepName
        this.stepInProgress[stepName] = false
        if (error instanceof TestFailure) {
            this.hasFailure = true
            this.failureDescription = error.message
            this.testResult.failures.push(this)
            this.currentStepCallback()
        } else {
            this.abortTest = true
            this.hasError = true
            this.errorDescription = this.constructor.shouldLogErrorStack() ? error.stack : error.message
            this.testResult.errors.push(this)
            this.onTestAbortedOrFinished()
        }
        this.currentStepCallback = null
    }

    performStep(stepName, selectorName, onStepPerformed) {
        if (this.abortTest || this.testFinished)
            return
        this.currentStepCallback = onStepPerformed
        this.clearStepTimeouts()
        try {
            this.stepInProgress[stepName] = true
            this.checkStepTimeout(stepName)
            if (this[selectorName].length === 0) {
                this.performStepWithoutCallback(stepName, selectorName, onStepPerformed)
            } else {
                this.performStepWithCallback(stepName, selectorName, onStepPerformed)
            }
        } catch (error) {
            this.onTestFailureOrError(stepName, error)
        }
    }

    performStepWithoutCallback(stepName, selectorName, onStepPerformed) {
        var promise = this[selectorName]()
        if (promise instanceof Promise) {
            this.catchPromiseErrors(stepName, promise, onStepPerformed)
        } else {
            this.stepInProgress[stepName] = false
            onStepPerformed()
        }
    }

    performStepWithCallback(stepName, selectorName, onStepPerformed) {
        var self = this
        var promise = this[selectorName](() => {
            self.stepInProgress[stepName] = false
            onStepPerformed()
        })
        if (promise instanceof Promise) {
            throw new Error('Both promise and callback cannot be used.')
        }
    }

    catchPromiseErrors(stepName, promise, onStepPerformed) {
        var self = this
        promise
            .then(() => {
                self.stepInProgress[stepName] = false
                onStepPerformed()
            })
            .catch((err) => {
                self.onTestFailureOrError(stepName, err)
            })
    }

    checkStepTimeout(stepName) {
        var self = this
        var stepTimout = setTimeout(() => {
            try {
                self.throwForStepTimeout(stepName)
            } catch (err) {
                self.onTestFailureOrError(stepName, err)
            }
        }, this.constructor.testCaseTimeout())
        this.stepTimeouts.push(stepTimout)
    }

    clearStepTimeouts() {
        this.stepTimeouts.forEach((eachTimeout) => {
            clearTimeout(eachTimeout)
        })
        this.stepTimeouts = []
    }

    throwForStepTimeout(stepName) {
        throw new Error(`${stepName} still running after timeout of ${this.constructor.testCaseTimeout()} ms.
If this is expected then override the static method TestCase#testCaseTimeout in your test
case class and return the expected timeout in milliseconds else probably you forgot to call
callback() passed as argument.`)
    }

    setUp(onSetupFinished) {
        onSetupFinished()
    }

    tearDown(onTearDownFinished) {
        onTearDownFinished()
    }

    displayString() {
        return `${this.constructor.name}#${this.testSelector}`
    }

    assert(boolean, errOrFailDescr, assertionDescr) {
        this.onAsserted(boolean, assertionDescr)
        if (!boolean) {
            throw new TestFailure(errOrFailDescr ? errOrFailDescr : 'Assertion failed.')
        }
    }

    assertNull(obj, errOrFailDescr, assertionDescr) {
        this.assert(obj === null, errOrFailDescr ? errOrFailDescr : `Assertion failed. Expected value to be null.`, assertionDescr)
    }

    assertUndefined(obj, errOrFailDescr, assertionDescr) {
        this.assert(obj === undefined, errOrFailDescr ? errOrFailDescr : `Assertion failed. Expected value to be undefined.`, assertionDescr)
    }

    assertNullOrUndefined(obj, errOrFailDescr, assertionDescr) {
        this.assert(obj === null || obj === undefined, errOrFailDescr ? errOrFailDescr : `Assertion failed. Expected value to be either null or undefined.`, assertionDescr)
    }

    assertNotNull(obj, errOrFailDescr, assertionDescr) {
        this.assert(obj !== null, errOrFailDescr ? errOrFailDescr : `Assertion failed. Did not expect value to be null.`, assertionDescr)
    }

    assertNotUndefined(obj, errOrFailDescr, assertionDescr) {
        this.assert(obj !== undefined, errOrFailDescr ? errOrFailDescr : `Assertion failed. Did not expect value to be undefined.`, assertionDescr)
    }

    assertNotNullOrUndefined(obj, errOrFailDescr, assertionDescr) {
        this.assert(obj !== null && obj !== undefined, errOrFailDescr ? errOrFailDescr : `Assertion failed. Did not expect value to be either null or undefined.`, assertionDescr)
    }

    assertEqual(expected, actual, errOrFailDescr, assertionDescr) {
        this.assert(expected === actual, errOrFailDescr ? errOrFailDescr : `Assertion failed. Values should have been equal. Expected: "${expected}", Actual: "${actual}"`, assertionDescr)
    }

    assertNotEqual(expected, actual, errOrFailDescr, assertionDescr) {
        this.assert(expected !== actual, errOrFailDescr ? errOrFailDescr : `Assertion failed. Values should not have been equal. Expected: "${expected}", Actual: "${actual}"`, assertionDescr)
    }

    shouldThrow(func, errClass, errMsg, assertionDescr) {
        var thrownErr
        try {
            func()
        } catch (err) {
            thrownErr = err
        }
        this.assert(thrownErr instanceof errClass, `Should have thrown an error of class ${errClass.name}. But ${thrownErr ? thrownErr.constructor.name : 'no error'} was thrown.`, assertionDescr)
        if (errMsg) {
            this.assert(thrownErr.message === errMsg, `Error was thrown as expected but the error message was "${thrownErr.message}" instead of "${errMsg}".`, assertionDescr)
        }
    }

    shouldNotThrow(func, errClass, errMsg, assertionDescr) {
        var thrownErr = null
        try {
            func()
        } catch (err) {
            thrownErr = err
            if (!(thrownErr instanceof errClass))
                throw err

            if (errMsg)
                this.assert(thrownErr.message !== errMsg, `Should not have thrown an error of class ${errClass.name} with message: "${errMsg}".`, assertionDescr)
            else
                this.assert(false, `Should not have thrown an error of class ${errClass.name}.`, assertionDescr)
        }
    }
}

module.exports = TestCase