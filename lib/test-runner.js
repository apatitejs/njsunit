var fs = require('fs')
var path = require('path')
var TestCase = require('./test-case')

class TestRunner {
    constructor(fileNameOrDir) {
        this.jsFiles = []
        this.testDir = ''
        this.isSingleFileTest = false
        var stats = fs.statSync(fileNameOrDir)
        if (stats.isDirectory()) {
            this.addAllJSFiles(fileNameOrDir)
            this.testDir = fileNameOrDir
        } else {
            this.isSingleFileTest = true
            this.jsFiles.push(fileNameOrDir)
            this.testDir = path.dirname(fileNameOrDir)
        }
        this.exitAfterTests = process.argv.indexOf('--noexit') === -1
    }

    static get TestCase () {
        return TestCase
    }

    addAllJSFiles(dir) {
        var list = fs.readdirSync(path.resolve(dir))
        var self = this
        list.forEach((eachFile) => {
            var file = path.resolve(dir, eachFile)
            if (fs.statSync(file).isDirectory()) {
                self.addAllJSFiles(file)
            } else if (file.indexOf('.js') === (file.length - 3)) {
                self.jsFiles.push(file)
            }
        })
    }

    run() {
        var SuiteClass = TestCase.suiteClass()
        var suite = new SuiteClass(TestCase.name)
        var self = this
        this.jsFiles.forEach(eachFile => {
            var TestClass = require(eachFile)
            if ((TestClass.prototype instanceof TestCase) && !TestClass.isAbstract()) {
                if ((self.isSingleFileTest) || (!TestClass.shouldExcludeDuringMassTests()))
                    TestClass.addTestsFromSelectors(suite)
            }
        })
        suite.run((result) => {
            result.out()
            var success = (result.failures.length === 0) && (result.errors.length === 0)
            if (self.exitAfterTests)
                process.exit(success ? 0 : 1)
        })
    }
}

module.exports = TestRunner