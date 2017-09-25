/* Converts the Frame object from the current interpreter to the old environment list which is 
*  compatible with the visualizer
*  The 'Frame' object and its 'Environment' are unified into a single Frame object
*  (as specified in the user guide), and Frames are sequentially added into the Environment
*  stack. Note the difference in terminology, frame here refers to a single piece of the
*  environment stack.
*/

var function_count = 0; //Global variable that is necessary for function index
var all_frames_array = []; //Global variable that stores the environment array (each frame is an element)

/**
 * The main function that converts a 'new' Frame object into a 'old' Environment stack
 * @param env the current environment list at the breakpoint (which is a list of environment objects)
 * @return the global all_frames_array that is compatible 
 */
function convert_new_to_old(frame) {
  //Iterates down the frame array starting with the innermost global environment, to the uppermost.
  //First converts each new 'environment' to an array that is compatible with the old visualizer. 
  //Then it adds this array to the array of all frames (over all previous breakpoints)
  var current_enclosing_index = undefined;
  while (frame) {
    if (frame.environment) {
      var environment_array = env_obj_to_array( 
        //Convert 'environment' of frame to an array that is compatible with the old visualizer
        frame.environment,
        current_enclosing_index //__viz_enclosing
      );
      current_enclosing_index = add_to_all_frame_array(environment_array);
    } else {
      //No environment
      console.log("Error: this frame has no environment property");
      console.log(frame);
    }
    frame = frame.parent;
  }
  return all_frames_array;
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
        if (declaration === "this" || is_undefined(obj[declaration])) continue; //Skip the "this" variable and undefined variables
        if (is_function(obj[declaration])) { 
          //Function
          //Add function to the local_functions table, which is the [2] entry of the actual table

          // Sanitize function
          var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
          var ARGUMENT_NAMES = /([^\s,]+)/g;
          var f_text = obj[declaration].toString()
                      // .replace(STRIP_COMMENTS, ''); //TODO: Doesn't work for some reason
                      var f_body = f_text.slice(f_text.indexOf('{'));
                      var f_param = f_text.slice(f_text.indexOf('(')+1, f_text.indexOf(')')).match(ARGUMENT_NAMES);

                      var function_object = {
                        name: declaration,
                        index: function_count,
                        body: f_body,
                        parameters: f_param || []
                      }

                      func_array.push(function_object);

          //Add function to var table
          var function_definition = {a: "function",
            defined_in: undefined, //This will be changed in add_to_all_frame_array
            index: function_count
          };

          var_array.push([declaration, function_definition]); //This is in the actual table

          function_count++;
        } else if (is_pair(obj[declaration])) { 
          //Pair
          var pair_object = {a: "pair", value: obj[declaration]};
          var_array.push([declaration, pair_object]);
        } else { 
          //Primitive
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
 * Adds a single frame to the all_frames_array.
 * @param current_frame the frame we are adding
 * @return the __viz_index of frame if it is already in all_frames, or its new __viz_index otherwise
 */
 function add_to_all_frame_array(current_frame) {
  //We need to handle global frames specially, and update the global values
  if (current_frame[1][1] === undefined) { //Intialize the global frame
    current_frame[0] = (["__viz_index", 0]);
    all_frames_array[0] = current_frame;

    //Change defined_in of local functions to global frame
    for (var i = 3; i < current_frame.length; i++) {
      if (current_frame[i][1].a === "function") {
        current_frame[i][1].defined_in = 0;
      }
    }
    return 0;
  } else {
    //Otherwise, assign __viz_index as newest frame
    var new_viz_index = all_frames_array.length;
    current_frame[0] = (["__viz_index", new_viz_index]);
    //And change defined_in of functions to correct frame index
    for (var i = 3; i < current_frame.length; i++) {
      if (current_frame[i][1].a === "function") {
        current_frame[i][1].defined_in = new_viz_index;
      }
    }
    //And finally add to all_frames_array
    all_frames_array.push(current_frame);
    return new_viz_index;
  }
}

//Helper functions
function is_function(obj) {
  return typeof obj === "function";
}

function is_undefined(obj) {
  return typeof obj === "undefined";
}