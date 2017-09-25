//Stage is the canvas where the environment model will be rendered.
//It's best to wrap this in a wrapper div with CSS overflow:scroll
//with a large width/height for the canvas
//so that you can scroll around the model, because the size
//is dynamic and might overflow the canvas

function render_environment(frame, canvas) {
    //Set the stage if it has not already been set
    stage ||= new Kinetic.Stage({
      container: canvas,
      width: stageWidth,
      height: stageHeight
    });

    //Render it
    parseInput(convert_new_to_old(frame));
}