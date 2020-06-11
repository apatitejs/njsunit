var fs = require('fs')

class TestResult {

    constructor() {
        this.failures = []
        this.errors = []
        this.passed = []
    }

    out() {
        var totalRun = this.failures.length + this.errors.length + this.passed.length
        this.writeLog(`Total Run: ${totalRun}`)
        this.writeLog(`Total Passed: ${this.passed.length}`)
        this.writeLog(`Total Failed: ${this.failures.length}`)
        this.failures.forEach((eachFaliedCase, idx) => {
            this.writeLog(`   ${idx + 1}. ${eachFaliedCase.displayString()}[${eachFaliedCase.failOrErrorStepName}]:`)
            this.writeLog(`           ${eachFaliedCase.failureDescription}`)
        })
        this.writeLog(`Total Errors: ${this.errors.length}`)
        this.errors.forEach((eachErrorCase, idx) => {
            this.writeLog(`   ${idx + 1}. ${eachErrorCase.displayString()}[${eachErrorCase.failOrErrorStepName}]:`)
            eachErrorCase.errorDescription.split('\n').forEach((eachLine) => {
                this.writeLog(`           ${eachLine}`)
            })
        })
    }

    writeLog(logToWrite) {
        console.log(logToWrite)
    }
}

module.exports = TestResult