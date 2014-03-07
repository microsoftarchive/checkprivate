function traverse(object, visitor) {
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function detectPrivateMemberAccess(ast, allowedPrivateMembersObjects) {

	var errors = [];

	traverse(ast, function(node) {
		var object, property, isPrivateMember;

		if(node.type !== 'MemberExpression') {
			return;
		}

		object = node.object;
		property = node.property;
		//we can only check if both operands are identifiers
		if(object.type !== 'Identifier' || property.type !== 'Identifier') {
			return;
		}

		isPrivateMember = property.name.substr(0, 1) === '_' && property.name.length > 1;

		if(isPrivateMember && allowedPrivateMembersObjects.indexOf(object.name) === -1) {
			errors.push({
				'expression': object.name + '.' + property.name,
				'line': object.loc.start.line,
				'column': object.loc.start.column,
				'range': [object.range[0], property.range[1]]
			});
		}
	});

	return errors;
}

module.exports = detectPrivateMemberAccess;