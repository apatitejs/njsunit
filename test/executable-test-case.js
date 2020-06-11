var TestCase = require('../lib/test-case')
var path = require('path')
var fs = require('fs')
var exePath = path.resolve('__dirname', '..')

class ExecutableTestCase extends TestCase {
    constructor() {
        super()
    }

    replaceOutputNewLines(outputStr) {
        return outputStr.toString().replace(/(?:\r\n|\r|\n)/g, '')
    }

    testExecutableOutput() {
        var invalidFileName = 'exe-invalid-file.js'
        var actualOutput = require('child_process').execSync('node bin/njsunit.js ' + invalidFileName, {
            cwd: exePath
        })
        actualOutput = this.replaceOutputNewLines(actualOutput)
        var fullInvalidFile = path.join(exePath, invalidFileName)
        var expectedOutput = `File or directory ${fullInvalidFile} does not exist.`
        this.assertEqual(expectedOutput, actualOutput)

        var testDir = path.join(exePath, 'test')
        var renamedTestDir = path.join(exePath, 'test-temp')
        fs.renameSync(testDir, renamedTestDir)
        actualOutput = require('child_process').execSync('node bin/njsunit.js', {
            cwd: exePath
        })
        actualOutput = this.replaceOutputNewLines(actualOutput)
        expectedOutput = `Directory ${testDir} does not exist. Either create the directory ${testDir} or specify the directory as argument.`
        this.assertEqual(expectedOutput, actualOutput)
        fs.renameSync(renamedTestDir, testDir)
    }

    testExecutablePassOutput() {
        var actualOutput = require('child_process').execSync('node bin/njsunit.js test/test-exe/exe-pass-test-case.js', {
            cwd: exePath
        })
        actualOutput = this.replaceOutputNewLines(actualOutput)
        var expectedOutput = `Total Run: 1Total Passed: 1Total Failed: 0Total Errors: 0`
        this.assertEqual(expectedOutput, actualOutput)
    }

    testExecutableFailOutput() {
        var failFileName = path.join(exePath, 'test', 'test-exe', 'exe-fail-test-case.js')
        var actualOutput = this.getExeOutput(failFileName)
        var expectedOutput = 'Total Run: 2Total Passed: 0Total Failed: 2   1. ExeFailTestCase#testFailAssertWithPromise[test]:           Assertion failed.   2. ExeFailTestCase#testFailAssertion[test]:           Assertion failed.Total Errors: 0'
        this.assertEqual(expectedOutput, actualOutput)
        
        failFileName = path.join(exePath, 'test', 'test-exe', 'unhandled-error-test-cases', 'set-up-unhandled-error-test-case.js')
        actualOutput = this.getExeOutput(failFileName)
        expectedOutput = 'Total Run: 1Total Passed: 0Total Failed: 1   1. SetUpUnhandledErrorTestCase#testUnhandledError[setUp]:           Assertion failed.Total Errors: 0'
        this.assertEqual(expectedOutput, actualOutput)

        failFileName = path.join(exePath, 'test', 'test-exe', 'unhandled-error-test-cases', 'unhandled-error-test-case.js')
        actualOutput = this.getExeOutput(failFileName)
        expectedOutput = 'Total Run: 1Total Passed: 0Total Failed: 1   1. UnhandledErrorTestCase#testUnhandledError[test]:           Assertion failed.Total Errors: 0'
        this.assertEqual(expectedOutput, actualOutput)

        failFileName = path.join(exePath, 'test', 'test-exe', 'unhandled-error-test-cases', 'tear-down-unhandled-error-test-case.js')
        actualOutput = this.getExeOutput(failFileName)
        expectedOutput = 'Total Run: 1Total Passed: 0Total Failed: 1   1. TearDownUnhandledErrorTestCase#testUnhandledError[tearDown]:           Assertion failed.Total Errors: 0'
        this.assertEqual(expectedOutput, actualOutput)
    }

    getExeOutput(fileName) {
        var actualOutput = require('child_process').execSync('node bin/njsunit.js ' + fileName + ' --noexit', {
            cwd: exePath
        })
        return this.replaceOutputNewLines(actualOutput)
    }

    testExecutableErrorOutput() {
        var errorFileName = path.join(exePath, 'test', 'test-exe', 'exe-error-test-case.js')
        var actualOutput = this.getExeOutput(errorFileName)
        var expectedOutput = 'Total Run: 2Total Passed: 0Total Failed: 0Total Errors: 2   1. ExeErrorTestCase#testPromiseWithCallback[test]:           Both promise and callback cannot be used.   2. ExeErrorTestCase#testError[test]:           foo is not defined'
        this.assertEqual(expectedOutput, actualOutput)
    }

    testProcessExitCode() {
        var failFileName = path.join(exePath, 'test', 'test-exe', 'exe-fail-test-case.js')
        this.shouldThrow(() => {
            require('child_process').execSync('node bin/njsunit.js ' + failFileName, {
                cwd: exePath
            })
        }, Error)
    }

    testExecutableForCoverage() {
        /*
        The method testExecutable actually covers everything, but for istanbul,
        it is not recognized as coverage because of child process. So again executing
        for istanbul.
        */
        var invalidFileName = 'exe-invalid-file.js'
        var istanbul = path.join('node_modules','.bin', 'istanbul')
        if (!fs.existsSync(istanbul))
            return
        require('child_process').execSync(istanbul + ' cover bin/njsunit.js ' + invalidFileName + ' --dir ./coverage/cvr1', {
            cwd: exePath
        })

        require('child_process').execSync(istanbul + ' cover bin/njsunit.js --dir ./coverage/cvr2 -- test/exe-error-test-case.js', {
            cwd: exePath
        })

        var testDir = path.join(exePath, 'test')
        var renamedTestDir = path.join(exePath, 'test-temp')
        fs.renameSync(testDir, renamedTestDir)
        require('child_process').execSync(istanbul + ' cover bin/njsunit.js --dir ./coverage/cvr3', {
            cwd: exePath
        })
        fs.renameSync(renamedTestDir, testDir)

        var fileName = path.join(exePath, 'test', 'test-exe', 'exe-timeout-fail-test-case.js')

        require('child_process').execSync(istanbul + ' cover bin/njsunit.js --dir ./coverage/cvr4 -- ' + fileName + ' --noexit', {
            cwd: exePath
        })

        fileName = path.join(exePath, 'test', 'test-exe', 'exe-fail-test-case.js')
        this.doExecSyncForCoverageTest(fileName, 5)

        fileName = path.join(exePath, 'test', 'test-exe', 'unhandled-error-test-cases', 'set-up-unhandled-error-test-case.js')
        this.doExecSyncForCoverageTest(fileName, 6)

        fileName = path.join(exePath, 'test', 'test-exe', 'unhandled-error-test-cases', 'unhandled-error-test-case.js')
        this.doExecSyncForCoverageTest(fileName, 7)

        fileName = path.join(exePath, 'test', 'test-exe', 'unhandled-error-test-cases', 'tear-down-unhandled-error-test-case.js')
        this.doExecSyncForCoverageTest(fileName, 8)

        fileName = path.join(exePath, 'test', 'test-exe', 'exe-error-test-case.js')
        this.doExecSyncForCoverageTest(fileName, 9)
    }

    doExecSyncForCoverageTest(fileName, dirId) {
        var istanbul = path.join('node_modules','.bin', 'istanbul')
        this.shouldThrow(() => {
            require('child_process').execSync(istanbul + ` cover bin/njsunit.js --dir ./coverage/cvr${dirId} -- ` + fileName, {
                cwd: exePath
            })
        }, Error)
    }
}

module.exports = ExecutableTestCase