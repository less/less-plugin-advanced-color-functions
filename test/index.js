var less = require("less"),
    lessTest = require("less/test/less-test"),
    lessTester = lessTest(),
    plugin = require('../lib'),
    stylize = less.lesscHelper.stylize;

console.log("\n" + stylize("LESS - functions", 'underline') + "\n");

lessTester.runTestSet(
    {strictMath: true, silent: true, plugins: [plugin] },
    "functions/");

if (lessTester.finish) {
	lessTester.finish();
}