var colors = require('./colors');

function findIndexOfLineStart(str, offset) {
    var index = str.substring(0, offset).lastIndexOf('\n');
    if(index !== -1) {
        ++index;
    }
    return index;
}

function findIndexOfLineEnd(str, offset) {
    return str.indexOf('\n', offset);
}

function findLinesRange(sourceCode, lineCount, offset) {
    var start = offset, end = offset;
    var startLines = lineCount + 1, endLines = lineCount + 1;

    while(start !== -1 && startLines--) {
        start = findIndexOfLineStart(sourceCode, start - 1);
    }

    while(end !== -1 && endLines--) {
        end = findIndexOfLineEnd(sourceCode, end + 1);
    }

    return {
        start: start === -1 ? 0 : start + 1,
        end: end === -1 ? sourceCode.length : end
    };
}

function pad(n, max, character) {
    var nStr = n+'';
    var padCount = max - nStr.length;
    for(var i = 0 ; i < padCount; ++i) {
        nStr = character + nStr;
    }
    return nStr;
}

function getExpressionWithSurroundingLines(sourceCode, range, lineCount) {

    var expressionStart = range[0],
        expressionEnd = range[1];
    var blockRange = findLinesRange(sourceCode, lineCount, range[0]);

    var beforeExpression = sourceCode.substring(blockRange.start, expressionStart);
    var afterExpression = sourceCode.substring(expressionEnd, blockRange.end);

    var expression = sourceCode.substring(expressionStart, expressionEnd);

    return [beforeExpression, expression, afterExpression];
}

function prependLineNumbers(lines, firstLineNumber) {
    var maxLineNumber = firstLineNumber + lines.length;
    var gutterSize = (maxLineNumber+'').length;
    return lines.map(function(line, i) {
        return colors.grey(pad(firstLineNumber + i, gutterSize, ' ')) + ' ' + line;
    });
}

function formatSurroundingCodeBlock(sourceCode, range, line, lineCount) {
    var block = getExpressionWithSurroundingLines(sourceCode, range, lineCount);
    var beforeLines = block[0].split('\n'),
        afterLines = block[2].split('\n'),
        expressionLine = colors.grey(beforeLines.pop()) + colors.red(block[1]) + colors.grey(afterLines.shift());
    var firstLineNumber = line - beforeLines.length;

    beforeLines = beforeLines.map(colors.grey);
    afterLines = afterLines.map(colors.grey);
    var lines = beforeLines.concat(expressionLine);
    lines = lines.concat.call(lines, afterLines);

    lines = prependLineNumbers(lines, firstLineNumber);
    return lines.join('\n');
}

module.exports = function (allowed, filename, sourceCode, error) {
    var location = filename + ':' + error.line + ':' + error.column;
    var block = formatSurroundingCodeBlock(sourceCode, error.range, error.line, 4);

    console.error(location);
    console.error('A private member was accessed from another object than', allowed.join(', ') + ':');
    console.error(block);
};