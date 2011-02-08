#!/usr/bin/env node

var watcher = require("../watcher")

watcher.start(process.ARGV[2])