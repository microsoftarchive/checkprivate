var colors = require('./colors');

function expressionInContext(sourceCode, range, extraSize) {

	var start = Math.max(range[0] - extraSize, 0);
	var end = Math.min(range[1] + extraSize, sourceCode.length);

	var beforeExpression = sourceCode.substr(start, extraSize);
	var afterExpression = sourceCode.substr(end - extraSize, extraSize);
	var expression = sourceCode.substr(range[0], range[1] - range[0]);
	var context = sourceCode.substr(start, end - start);

	var newLineBeforeIndex = beforeExpression.lastIndexOf('\n');
	var newLineAfterIndex = afterExpression.indexOf('\n');

	if(newLineBeforeIndex !== -1) {
		beforeExpression = beforeExpression.substr(newLineBeforeIndex + 1);
	}
	if(newLineAfterIndex !== -1) {
		afterExpression = afterExpression.substr(newLineAfterIndex + 1);
	}

	return [beforeExpression.trimLeft(), expression, afterExpression.trimRight()];
}

module.exports = function (allowed, filename, sourceCode, error) {
	var location = filename + ':' + error.line + ':' + error.column;
	var context = expressionInContext(sourceCode, error.range, 100);
	var sourceLine = 	colors.grey(context[0]) +
						colors.bold(colors.red(context[1])) +
						colors.grey(context[2]);
	console.error(location);
	console.error('   A private member was accessed from another object than', allowed.join(', ') + ':');
	console.error();
	console.error('   ' + sourceLine + '...');
};