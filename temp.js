function environment_stack_to_inputArray(environment_stack) {
	var inputArray = [];
	var index = 0;
	var current_stack = environment_stack;
	while (!is_empty_environment(current_stack)) {
		inputArray.push(environment_to_array(head(current_stack), index));
		current_stack = tail(current_stack);
	}
	return inputArray;
}

function environment_to_array(environment_object, index) {
	var environmentArray = [];
	environmentArray.push(["__viz_index", index]);
	environmentArray.push(["__viz_enclosing", index > 0 ? index - 1 : undefined]);
	environmentArray.push(["local_functions", get_local_functions(environment_object)]);
	for (var assignment in environment_object) {
	    if (environment_object.hasOwnProperty(assignment)) {
	        if ()
    }
}
}