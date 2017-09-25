//This is the main API for the environment model visualizer.

/* Main function that renders the environment
 * @param frame is the frame object from the interpreter
 * @param canvas is the canvas where the environment model will be rendered.
 *        It should be in a wrapper div with CSS overflow:scroll
 *        so that you can scroll around the model
 */

 function render_environment(frame, canvas) {
    // Set the stage (render target) if it has not already been set.
    // stageWidth and stageHeight are constants in visualizer js
    stage ||= new Kinetic.Stage({
     container: canvas,
     width: stageWidth,
     height: stageHeight
   });

    // Render
    parseInput(convert_new_to_old(frame));
  }