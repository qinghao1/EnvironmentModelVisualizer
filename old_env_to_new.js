var all_frames_array = [];

//Object map of all functions. Each function is a object property (key),
//and the value is {index: i, defined_in: j}
var all_functions = {count: 0};

//Array of pointers to the all_functions values. We need this because we lose the original function
//object after env_obj_to_array() has finished.
var all_functions_by_index = [];

//Helper function to check if a object is a function
function is_function(obj) {
  return typeof obj === "function";
}

/**
 * Checks frame equality by checking all variables to see if they have the same name and value.
 * Will return true if two frames are called by different functions but have the same variables!
 * For example function f1() {var x = 5;} and f2() {var x = 5;}
 * This is an unavoidable flaw due to how the interpreter works
 * @param frame1
 * @param frame2
 * @return whether they are equal (same variable name and value)
*/
function check_frame_equality(frame1, frame2) {
  for (var i = 3; i < frame1.length; i++) {
    if (frame2[i] === undefined) return false;
    if (frame1[i][0] != frame2[i][0]) return false; //Variable name don't match
    if (frame1[i][1].a != frame2[i][1].a) return false; //Variable type don't match (function, pair, primitive)
    if (frame1[i][1].value != frame2[i][1].value) { //Variable value
      switch(frame1[i][1].a) {
        case "primitive":
          return false;
        case "pair": 
          if (!equal(frame1[i][1].value, frame2[i][1].value)) return false; //Must check by value because reference is unavailable
          break;
        case "function": //Check function object properties
          if (
            frame1[i][1].value.defined_in != frame2[i][1].value.defined_in ||
            frame1[i][1].value.index != frame2[i][1].value.index
          ) return false;
          break;
      }
    }
  }
  return true;
}

/**
 * Adds a single frame to the all_frames_array.
 * @param current_frame the frame we are adding
 * @return the __viz_index of frame if it is already in all_frames, or its new __viz_index otherwise
*/
function add_to_all_frame_array(current_frame) {
  //We need to handle global frames specially, and update the global values
  if (current_frame[1][1] === undefined) { //Intialize the global frame
    if (all_frames_array.length === 0) { 
      current_frame[0] = (["__viz_index", 0]);
      all_frames_array[0] = current_frame;

      //Change defined_in of local functions to global frame
      for (var i = 3; i < current_frame.length; i++) {
        if (current_frame[i][1].a === "function") {
          current_frame[i][1].defined_in = 0;
          all_functions_by_index[current_frame[i][1].index].defined_in = 0;
        }
      }
    } else { //Update the global frame
      //Look for and add new variables
      for (var i = 3; i < current_frame.length; i++) {
        var global_frame = all_frames_array[0];

        //Change defined_in if it's a function
        if (current_frame[i][1].a === "function") current_frame[i][1].defined_in = 0;

        update_global_frame(current_frame, i, global_frame);
      }
    }
    return 0;
  } else {
    //Check if current_frame is already in all_frames array. If it is we do nothing.
    for (var _viz_index = 0; _viz_index < all_frames_array.length; _viz_index++) {
      if (check_frame_equality(current_frame, all_frames_array[_viz_index])) {
        return _viz_index;
      }
    }
    //Otherwise, assign __viz_index as newest frame
    var new_viz_index = all_frames_array.length;
    current_frame[0] = (["__viz_index", new_viz_index]);
    //And change defined_in of functions to correct frame index
    for (var i = 3; i < current_frame.length; i++) {
      if (current_frame[i][1].a === "function") {
        //Check if it is a local function. If so, change defined_in to current frame.
        //Otherwise, change it to the defined_in of all_functions.
        if (all_functions_by_index[current_frame[i][1].index].defined_in === undefined) {
          //This means we have not set defined_in, so it is a new local function
          current_frame[i][1].defined_in = new_viz_index;
          all_functions_by_index[current_frame[i][1].index].defined_in = new_viz_index;
        } else {
          //Set the defined_in to the first frame that has the function
          current_frame[i][1].defined_in = all_functions_by_index[current_frame[i][1].index].defined_in;
        }
      }
    }
    //And finally add to all_frames_array
    all_frames_array.push(current_frame);
    console.log(current_frame)
    return new_viz_index;
  }
}
/**
 * Updates global frame using a single variable from current frame.
 * Helper function for control flow.
 * @param current_frame current frame
 * @param i index of variable in current frame
 * @param global_frame global frame
*/
function update_global_frame(current_frame, i, global_frame){
  for (var j = 3; j < global_frame.length; j++) {
    if (current_frame[i][0] === global_frame[j][0]) {
      //Same variable name, so update value
      global_frame[j][1] = current_frame[i][1];
      return;
    }
  }
  //These variables have not already been defined, so we need to add them to global frame
  //First, update local functions of global frame if the variable is a function
  if (current_frame[i][1].a === "function") {
    all_functions_by_index[current_frame[i][1].index].defined_in = 0;
    //Add to local_functions of global frame:
    //Look for currently indexed function in local_functions of current frame and add to global local_functions
    var curr_index = current_frame[i][1].index;
    for (var k = 0; k < current_frame[2][1].length; k++) {
      if (current_frame[2][1][k].index === curr_index) {
        global_frame[2][1].push(current_frame[2][1][k]);
      }
    }
  }
  //Finally, add to global frame
  global_frame.push(current_frame[i]);
}

/**
 * Adds function to all functions, so that index and defined_in can be set.
 * @param f function to add
 * @return index of function
*/ 
function add_function(f) {
  if (!all_functions[f]) { //Set new index if it doesn't exist
    all_functions[f] = {index: all_functions.count, defined_in: undefined};
    all_functions_by_index[all_functions.count] = all_functions[f];
    all_functions.count++;
  }
  return all_functions[f].index;
}

/**
* Converts a single environment frame (that comes in the form of an object)
* to an array that is compatible with the old visualizer.
* @param obj the frame
* @param viz_enclosing index of enclosing frame
* @return an array (representing one frame) that can be understood by the old interpreter
*/
function env_obj_to_array(obj, viz_enclosing) {

  return_table = [];
  var_array = [];
  func_array = [];

  //Iterate through all declarations in the current environment
  for (var declaration in obj) {
    if (obj.hasOwnProperty(declaration)) {
        if (declaration === "this" || !obj[declaration]) continue; //Skip the "this" variable and undefined variables
        if (is_function(obj[declaration])) { //Function
          if (all_functions[obj[declaration]] === undefined) { //It's a new local function
            // Sanitize function
            var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
            var ARGUMENT_NAMES = /([^\s,]+)/g;
            var f_text = obj[declaration].toString().replace(STRIP_COMMENTS, '');
            var f_body = f_text.slice(f_text.indexOf('{'));
            var f_param = f_text.slice(f_text.indexOf('(')+1, f_text.indexOf(')')).match(ARGUMENT_NAMES);

            var function_object = {
              name: declaration,
              index: add_function(obj[declaration]),
              body: f_body,
              parameters: f_param || []
            }
            func_array.push(function_object); //This is in the local_functions table, which is the [2] entry of the actual table
          }

          //Add functions to var table (it may or may not be a new local function)
          var function_definition = {a: "function",
            defined_in: undefined, //This will be changed in add_to_all_frame_array
            index: all_functions[obj[declaration]].index
          };

          var_array.push([declaration, function_definition]); //This is in the actual table
        } else if (is_pair(obj[declaration])) { //Pair
          var pair_object = {a: "pair", value: obj[declaration]};
          var_array.push([declaration, pair_object]);
        } else { //Primitive
          var primitive_object = {a: "primitive", value: obj[declaration]};
          var_array.push([declaration, primitive_object]);
        }
    }
  }

  //Return the table as specified
  return_table[1] = (["__viz_enclosing", viz_enclosing]);
  return_table[2] = (["local_functions", func_array]);
  return return_table.concat(var_array);
}

/**
 * Adds list of new environment objects (at current breakpoint) to the list of all
 * frames (that includes all previous breakpoints). 
 * @param env the current environment list at the breakpoint (which is a list of environment objects)
*/
function add_env_list_to_all_frames(env) {
  //Iterates through the environment list from bottom to top (starting with global environment).
  //First converts each frame to an array that is compatible with the old visualizer. 
  //Then it adds this array to the array of all frames (over all previous breakpoints)
  var current_environment_stack = tail(reverse(env)); //Skip global environment
  var current_enclosing_index = undefined;
  while (!is_empty_list(current_environment_stack)) {
    var environment_array = env_obj_to_array( //Convert this to an array that is compatible with the old visualizer
      head(current_environment_stack),
      current_enclosing_index //__viz_enclosing
    );
    current_enclosing_index = add_to_all_frame_array(environment_array);
    current_environment_stack = tail(current_environment_stack);
  }
}

function get_all_frames() {
  return all_frames_array;
}

function get_all_functions() {
  return all_functions;
}