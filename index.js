var esprima = require('esprima');
var fs = require('fs');
var detectPrivateMemberAccess = require('./detect');
var reportError = require('./report');

var allowedIdentifiers = ['this', 'self', '_super'];
var filename = process.argv[2];

var sourceCode = fs.readFileSync(filename, {encoding: 'utf-8'});
var ast = esprima.parse(sourceCode, {
	loc: true,
	range: true,
	tolerant: true
});

var boundReportError = reportError.bind(null, allowedIdentifiers, filename, sourceCode);

var errors = detectPrivateMemberAccess(ast, allowedIdentifiers);
errors.forEach(boundReportError);

if(errors.length) {
	//let the caller of this program know there were some errors
	process.exit(1);
}