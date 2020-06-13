# njsunit

Simple port of SUnit (Smalltalk) unit testing. Class based unit testing framework for Node.js.

[![npm](https://img.shields.io/npm/v/njsunit.svg)](https://npmjs.org/package/njsunit)
[![Linux Build](https://img.shields.io/travis/apatitejs/njsunit/master.svg?label=linux)](https://travis-ci.org/apatitejs/njsunit)
[![Windows Build](https://img.shields.io/appveyor/ci/apatitejs/njsunit/master.svg?label=windows)](https://ci.appveyor.com/project/apatitejs/njsunit)
[![Coverage Status](https://coveralls.io/repos/github/apatitejs/njsunit/badge.svg?branch=master)](https://coveralls.io/github/apatitejs/njsunit?branch=master)

## Quick Start - CLI

```bash
C:\my-project> npm install njsunit --save-dev
```

Create directory named test in your project directory. Create your test file (all your test methods should start with "test"):

```js
const TestCase = require('njsunit').TestCase

class ExampleTestCase extends TestCase {
    constructor() {
        super()
    }
    testStringIndexOf() {
        this.assert('abc'.indexOf('b') === 1, null, 'Index of "b" in the string "abc" should be 1.')
    }

    displayString() {
        return 'My Example Test Case'
    }
}

module.exports = ExampleTestCase
```

Update the test script in your package.json

```js
  "scripts": {
    "test": "njsunit"
  }
```

Run the tests

```bash
C:\my-project> npm test
```

Above would result in the following output in Windows:

```bash
> test@1.0.0 test C:\my-project\test
> njsunit

My Example Test Case:
    [√] Index of "b" in the string "abc" should be 1.
My Example Test Case finished in 0 ms

Total Run: 1
Total Passed: 1
Total Failed: 0
Total Errors: 0
```

To run test cases in individual files, provide the file name as parameter

```bash
C:\my-project> npm test ./test/example-test-case.js
```

## Quick Start - API

```bash
C:\my-project> npm install njsunit --save-dev
```

Create file example-test-case.js and paste the code:

```js
const TestCase = require('njsunit').TestCase

class ExampleTestCase extends TestCase {
    constructor() {
        super()
    }
    testStringIndexOf() {
        this.assert('abc'.indexOf('b') === 1, null, 'Index of "b" in the string "abc" should be 1.')
    }

    displayString() {
        return 'My Example Test Case'
    }
}

var SuiteClass = ExampleTestCase.suiteClass()
var suite = new SuiteClass('ExampleTestCase')
ExampleTestCase.addTestsFromSelectors(suite)
suite.run((result) => {
    result.out()
})
```

Save the file, run the test

```bash
C:\my-project> node example-test-case.js
```

Above would result in the following output in Windows:

```bash
My Example Test Case:
    [√] Index of "b" in the string "abc" should be 1.
My Example Test Case finished in 0 ms

Total Run: 1
Total Passed: 1
Total Failed: 0
Total Errors: 0
```

## All available assertions

```js
var TestCase = require('njsunit').TestCase

class ExampleTestCase extends TestCase {
    constructor() {
        super()
    }
    setUp() { // would be called before execution of every test
    }
    tearDown() {// would be called after execution of every test
    }
    testExamples() {
        this.assert('abc'.indexOf('b') === 1)
        this.assert('abc'.indexOf('b') === 1, 'Some description for failed assertion')
        this.assert('abc'.indexOf('b') === 1, 'Some description for failed assertion', 'Index of "b" in the string "abc" should be 1.')
        this.assertEqual('abc', 'abc') // same as this.assert('abc' === 'abc')
        this.assertEqual('abc', 'abc', 'Some description for failed assertion')
        this.assertEqual('abc', 'abc', 'Some description for failed assertion', 'The strings "abc" and "abc" must always be equal.')
        this.assertNotEqual('abc', 'def') // same as this.assert('abc' !== 'def')
        this.assertNotEqual('abc', 'def', 'Some description for failed assertion')
        this.assertNull(null)
        this.assertNull(null, 'Some description for failed assertion')
        this.assertUndefined(undefined)
        this.assertUndefined(undefined, 'Some description for failed assertion')
        this.assertNullOrUndefined(null)
        this.assertNullOrUndefined(null, 'Some description for failed assertion')
        this.assertNotNull('abc')
        this.assertNotNull('abc', 'Some description for failed assertion')
        this.assertNotUndefined('abc')
        this.assertNotUndefined('abc', 'Some description for failed assertion')
        this.assertNotNullOrUndefined('abc')
        this.assertNotNullOrUndefined('abc', 'Some description for failed assertion')
        this.shouldThrow(() => {
            foo.bar()
        }, ReferenceError, 'foo is not defined')
        this.shouldNotThrow(() => {
            var foo = {
                bar: () => {
                    console.log('bar')
                }
            }
            foo.bar()
        }, ReferenceError, 'foo is not defined')
    }
}

module.exports = ExampleTestCase
```

The test methods and setUp/tearDown methods are passed optional callback functions which you could call when your tests are finished.
```js
class ExampleTestCase extends TestCase {
    constructor() {
        super()
    }
    setUp(onSetUpDone) {
        onSetUpDone()
    }
    tearDown(onTearDownDone) {
        onTearDownDone()
    }
    testExample(onTestPerformed) {
        this.assert('abc'.indexOf('b') === 1)
        onTestPerformed()
    }
}

module.exports = ExampleTestCase
```

The default timeout for a test case is 2000ms. Override the static method testCaseTimeout() to specify the timeout in ms you want.

```js
class ExampleTestCase extends TestCase {
    constructor() {
        super()
    }
    static testCaseTimeout() {
        return 5000
    }
    testExample(onTestPerformed) {
        this.assert('abc'.indexOf('b') === 1)
        onTestPerformed()
    }
}

module.exports = ExampleTestCase
```

Override the static method isAbstract() if a TestCase sub class is abstract and should not execute tests.

```js
class MyAbstractTestCase extends TestCase {
    constructor() {
        super()
    }
    static isAbstract() {
        return this.name === 'MyAbstractTestCase'
    }
}

module.exports = MyAbstractTestCase
```

```js
class ExampleTestCase extends MyAbstractTestCase {
    constructor() {
        super()
    }
    testExample(onTestPerformed) {
        this.assert('abc'.indexOf('b') === 1)
        onTestPerformed()
    }
}

module.exports = ExampleTestCase
```
## Contributions

Welcome.

## License

  [MIT](LICENSE)