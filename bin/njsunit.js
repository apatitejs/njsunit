#!/usr/bin/env node
'use strict';

var TestRunner = require('../lib/test-runner')

var fileNameOrDir = process.argv[2]
var path = require('path')
var fs = require('fs')

if (fileNameOrDir) {
    fileNameOrDir = path.resolve(fileNameOrDir)
    if (!fs.existsSync(fileNameOrDir))
        return console.log(`File or directory ${fileNameOrDir} does not exist.`)
} else {
    var dir = path.resolve('./test')
    if (!fs.existsSync(dir))
        return console.log(`Directory ${dir} does not exist. Either create the directory ${dir} or specify the directory as argument.`)
    fileNameOrDir = dir
}

var runner = new TestRunner(fileNameOrDir)
runner.run()