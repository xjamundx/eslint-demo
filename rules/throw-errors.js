'use strict';

/**
 * Will enforce the rule that you should only throw error objects
 */
module.exports = function(context) {

	// placeholder for valid errors
	var errors = {};

	return {

		/**
		 * Make a list of any variables that are instances of Error
		 * @param node
		 */
		'VariableDeclarator': function(node) {
			if (node.id.type === 'Identifier' &&
				node.init &&
				node.init.type === 'NewExpression' &&
				node.init.callee.name === 'Error'
			) {
				errors[node.id.name] = true;
			}
		},

		'ThrowStatement': function(node) {

			// checking for the throw new Error() case
			if (node.argument.type === 'NewExpression' &&
				node.argument.callee.name === 'Error') {
				return;
			}

			// if you're doing throw x; make sure x isn't actually undefined
			// then make sure it's a variable that's already been defined in this
			// file as a variable (will not help when I expect an error from a callback
			// function, or it's coming from another module)
			if (node.argument.type === 'Identifier' &&
				node.argument.name !== 'undefined' &&
				errors[node.argument.name]
			) {
				return;
			}

			context.report(node, 'Please only throw new Error() objects.');
		}
	}
};
