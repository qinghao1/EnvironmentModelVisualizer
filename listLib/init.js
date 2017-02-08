/* Resize the canvas to given width and height, preserving original content */
function resize_canvas(canvas, width, height) {
    var ctx = canvas.getContext('2d');
    var image = ctx.getImageData(0,0,canvas.width, canvas.height);
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(image, 0, 0);
}
var stage;


function calcStageSize() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    return {x: windowWidth - 30, y: windowHeight - 100};
}

function updateButtons() {
    if (currentid <= 0) {
        $("#prevBtn").attr('disabled', 'disabled');
    } else {
        $("#prevBtn").removeAttr('disabled');
    }

    if (currentid >= layerList.length - 1) {
        $("#nextBtn").attr('disabled', 'disabled');
    } else {
        $("#nextBtn").removeAttr('disabled');
    }
}
//jQuery(function($) {
    size = calcStageSize();
    stage = new Kinetic.Stage({
        width: size.x,
        height: size.y,
        container:"container"
    });

    function resizeStageToFitScreen(stage) {
        return function() {
            size = calcStageSize();
            stage.setWidth(size.x);
            stage.setHeight(size.y);
        }
    }

    window.addEventListener('resize', resizeStageToFitScreen(stage), false);
    updateButtons();

    $('#prevBtn').click(function() {
        if (currentid > 0) currentid--; show(currentid);
        updateButtons();
    });

    $("#nextBtn").click(function() {
        if (currentid + 1 < layerList.length) currentid++; show(currentid);
        updateButtons();
    })
//});