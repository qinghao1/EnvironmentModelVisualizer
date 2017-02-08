


/*
* Draw the list of frames
* @param X: position x
* @param Y: position y
* @param layer: layer that we're drawing on
* @param prevId: id of the enclosing frame
* @param id: current id of the frameArray
* @param firstChild: whether the current frame is the global frame
* @param inputArray
* @param frameArray
*/
function drawList(X, Y, layer, prevId, id, firstChild, inputArray, frameArray) {
  // =================================================================
  //  Initializing sizes
  //  Preparing shapes
  // =================================================================

  listImage = new Kinetic.Group();
  
  const blockDimensions = 25;
  
  // for arrow
  const arrowHeadlength = 5;
  // Adjust stroke width and color here
  var defaultStrokeWidth = 1;
  var defaultStrokeColor = '#eb9800';
  var highlightStrokeWidth = 2;
  var highlightStrokeColor = '#005aff';

  if (prevId != null) {
    // @var target: the left block of the enclosing frame
    var target = frameArray[prevId].find("Rect")[0];

    // lineEnv: the line linking elements of the list
    // sizes:
    var lineEnv_x1 = X + 1.5 * blockDimensions;
    var lineEnv_y1 = Y + 0.5 * blockDimensions;
    var lineEnv_corner_x = target.x() + (firstChild? 0 : 8);
    var lineEnv_corner_y = lineEnv_y1;
    var lineEnv_x2 = lineEnv_corner_x;
    var lineEnv_y2 = target.y() + (firstChild? 0.5 * blockDimensions : 0);
    const lineEnv_angle = Math.atan2(lineEnv_y2 - lineEnv_corner_y, lineEnv_x2 - lineEnv_corner_x);

    var lineEnv = new Kinetic.Line({
      points      : [lineEnv_x1, lineEnv_y1,
                    lineEnv_corner_x, lineEnv_corner_y,
                    lineEnv_x2, lineEnv_y2, 
                    lineEnv_x2 - arrowHeadlength * Math.cos(lineEnv_angle - Math.PI/6), lineEnv_y2 - arrowHeadlength * Math.sin(lineEnv_angle - Math.PI/6), 
                    lineEnv_x2, lineEnv_y2, 
                    lineEnv_x2 - arrowHeadlength * Math.cos(lineEnv_angle + Math.PI/6), lineEnv_y2 - arrowHeadlength * Math.sin(lineEnv_angle + Math.PI/6)],
      strokeWidth : defaultStrokeWidth,
      stroke: defaultStrokeColor
    });
    var lineEnvCenter = new Kinetic.Circle({
                        x: lineEnv_x1,
                        y: lineEnv_y1,
                        radius: 2,
                        stroke: defaultStrokeColor,
                        strokeWidth: defaultStrokeWidth,
                        fill: defaultStrokeColor
                      });
  }

  // blockLeft & blockRight: the shape of an element in the list
  var blockLeft = new Kinetic.Rect({
    x: X,
    y: Y,
    width: blockDimensions,
    height: blockDimensions,
    stroke: defaultStrokeColor,
    strokeWidth: defaultStrokeWidth,
    fill: 'white',
  });
 
  var blockRight = new Kinetic.Rect({
    x: X + blockDimensions,
    y: Y,
    width: blockDimensions,
    height: blockDimensions,
    stroke: defaultStrokeColor,
    strokeWidth: defaultStrokeWidth,
    fill: 'white'
  });

  var diagonal = new Kinetic.Line({
    points      : [X + blockDimensions, Y + blockDimensions,
                   X + 2 * blockDimensions, Y],
    strokeWidth : defaultStrokeWidth,
    stroke: defaultStrokeColor
  });
  
  // add every element to the group
  listImage.add(blockLeft);
  listImage.add(blockRight);

  // =================================================================
  //  Add Effects: Upon mouseover:
  //  .Highlight the track from each frame to the global frame
  //  .Highlight the global frame
  // =================================================================

  // if global frame: add a diagonal line indicating the end of the list
  // if not global frame: add a highlight tracing back to global frame
  if(prevId != null) {
    listImage.add(lineEnv);
    listImage.add(lineEnvCenter);
  } else {
    listImage.add(diagonal);
  }
  // update frameArray here so we can manipulate the color later
  frameArray[id].add(listImage);

  // hightlight the track to global frame when cursor touches each frame
  // and highlight the global frame itself
  if (prevId != null) {
    // if the frame is not global
    blockLeft.on('mouseover', function () {
      var i = prevId;
      var enclosingLeft = [];
      var enclosingRight = [];
      var enclosingLineEnv = [];
      var enclosingLineEnvCenter = [];
      var tempLayer = new Kinetic.Layer();
      while (i != null) {
        enclosingLeft[i] = frameArray[i].find("Rect")[0];
        enclosingRight[i] = frameArray[i].find("Rect")[1];
        enclosingLineEnv[i] = frameArray[i].find("Line")[0];
        enclosingLineEnvCenter[i] = frameArray[i].find("Circle")[0];
        
        enclosingLeft[i].stroke(highlightStrokeColor);
        enclosingLeft[i].strokeWidth(highlightStrokeWidth);

        enclosingRight[i].stroke(highlightStrokeColor);
        enclosingRight[i].strokeWidth(highlightStrokeWidth);

        enclosingLineEnv[i].stroke(highlightStrokeColor);
        enclosingLineEnv[i].strokeWidth(highlightStrokeWidth);

        if (i != 0) {
          enclosingLineEnvCenter[i].stroke(highlightStrokeColor);
          enclosingLineEnvCenter[i].strokeWidth(highlightStrokeWidth);
        }
        frameArray[i].moveToTop();
        i = inputArray[i][1][1];
      }

      blockLeft.stroke(highlightStrokeColor);
      blockLeft.strokeWidth(highlightStrokeWidth);

      blockRight.stroke(highlightStrokeColor);
      blockRight.strokeWidth(highlightStrokeWidth);

      lineEnv.stroke(highlightStrokeColor);
      lineEnv.strokeWidth(highlightStrokeWidth);

      lineEnvCenter.stroke(highlightStrokeColor);
      lineEnvCenter.strokeWidth(highlightStrokeWidth);
      frameArray[id].moveToTop();
      layer.draw();
    });

    blockLeft.on('mouseout', function () {
      var i = prevId;
      var enclosingLeft = [];
      var enclosingRight = [];
      var enclosingLineEnv = [];
      var enclosingLineEnvCenter = [];
      while (i != null) {
        enclosingLeft[i] = frameArray[i].find("Rect")[0];
        enclosingRight[i] = frameArray[i].find("Rect")[1];
        enclosingLineEnv[i] = frameArray[i].find("Line")[0];
        enclosingLineEnvCenter[i] = frameArray[i].find("Circle")[0];
        
        enclosingLeft[i].stroke(defaultStrokeColor);
        enclosingLeft[i].strokeWidth(defaultStrokeWidth);

        enclosingRight[i].stroke(defaultStrokeColor);
        enclosingRight[i].strokeWidth(defaultStrokeWidth);
        
        enclosingLineEnv[i].stroke(defaultStrokeColor);
        enclosingLineEnv[i].strokeWidth(defaultStrokeWidth);
        if (i != 0) {
          enclosingLineEnvCenter[i].stroke(defaultStrokeColor);
          enclosingLineEnvCenter[i].strokeWidth(defaultStrokeWidth);
        }
        frameArray[i].moveToBottom();
        i = inputArray[i][1][1];
      }

      blockLeft.stroke(defaultStrokeColor);
      blockLeft.strokeWidth(defaultStrokeWidth);

      blockRight.stroke(defaultStrokeColor);
      blockRight.strokeWidth(defaultStrokeWidth);

      lineEnv.stroke(defaultStrokeColor);
      lineEnv.strokeWidth(defaultStrokeWidth);

      lineEnvCenter.stroke(defaultStrokeColor);
      lineEnvCenter.strokeWidth(defaultStrokeWidth);
      frameArray[id].moveToBottom();

      layer.draw();
    });    
  } else {
    // if the frame is global
    blockLeft.on('mouseover', function () {
      blockLeft.stroke(highlightStrokeColor);
      blockLeft.strokeWidth(highlightStrokeWidth);

      blockRight.stroke(highlightStrokeColor);
      blockRight.strokeWidth(highlightStrokeWidth);

      diagonal.stroke(highlightStrokeColor);
      diagonal.strokeWidth(highlightStrokeWidth);
      frameArray[id].moveToTop();
      layer.draw();
    });

    blockLeft.on('mouseout', function () {
      blockLeft.stroke(defaultStrokeColor);
      blockLeft.strokeWidth(defaultStrokeWidth);

      blockRight.stroke(defaultStrokeColor);
      blockRight.strokeWidth(defaultStrokeWidth);

      diagonal.stroke(defaultStrokeColor);
      diagonal.strokeWidth(defaultStrokeWidth);
      frameArray[id].moveToBottom();
      layer.draw();
    });
  }
}

/**
* Draw the headings for the tables
* @param X
* @param Y
* @param layer
*/

function drawFrameHeading(X, Y, layer) {
  imageHeading = new Kinetic.Group();

  var blockVar = new Kinetic.Rect({
    x: X,
    y: Y,
    width: tableVarWidth,
    height: tableCellHeight,
    stroke: 'black',
    strokeWidth: 1,
    fill: 'black'
  });

  var txtVar = new Kinetic.Text({
    text : "Var",
    align : 'center',
    width : 60,
    y : Y + 9,
    x : X + 10,
    fontStyle : "normal",
    fontFamily: "Courier",
    fontSize : 13,
    fill :'white'
  });

  var blockValue = new Kinetic.Rect({
    x: X + tableVarWidth,
    y: Y,
    width: tableValueWidth,
    height: tableCellHeight,
    stroke: 'black',
    strokeWidth: 1,
    fill: 'black'
  });

  var txtValue = new Kinetic.Text({
    text : "Value",
    align       : 'center',
    width       : 50,
    y : Y + 9,
    x : (X + tableVarWidth) + 10,
    fontFamily: "Courier",
    fontStyle : "normal",
    fontSize : 13,
    fill    :'white'
  });

  
  // for arrow
  const arrowHeadlength = 5;
  // lineDown: the line from head of each element of the list to its table
  // sizes:
  var lineDown_x1 = X + 37;
  var lineDown_y1 = Y - 37;
  var lineDown_x2 = lineDown_x1;
  var lineDown_y2 = Y;
  const lineDown_angle = Math.atan2(lineDown_y2 - lineDown_y1, lineDown_x2 - lineDown_x1);

  var lineDown = new Kinetic.Line({
    points      : [lineDown_x1  , lineDown_y1,
                  lineDown_x2, lineDown_y2, 
                  lineDown_x2 - arrowHeadlength * Math.cos(lineDown_angle - Math.PI/6), lineDown_y2 - arrowHeadlength * Math.sin(lineDown_angle - Math.PI/6), 
                  lineDown_x2, lineDown_y2, 
                  lineDown_x2 - arrowHeadlength * Math.cos(lineDown_angle + Math.PI/6), lineDown_y2 - arrowHeadlength * Math.sin(lineDown_angle + Math.PI/6)],
    strokeWidth : 1,
    id : 'lineDown',
    stroke : 'black'
  });
  
  imageHeading.add(blockVar);
  imageHeading.add(blockValue);
  imageHeading.add(txtVar);
  imageHeading.add(txtValue);
  imageHeading.add(lineDown);
  return imageHeading;
}

/**
* Draw the contents of the tables
* @param X
* @param Y
* @param layer
* @param varName
* @param value
*/

function drawFrameContent(X, Y, layer, varName, value, realValue) {
  var image = new Kinetic.Group();
  var txtVar = varName;
  var txtValue = value;

  var blockVar = new Kinetic.Rect({
    x: X,
    y: Y,
    width: tableVarWidth,
    height: tableCellHeight,
    stroke: 'black',
    strokeWidth: 1,
    fill: 'white'
  });

  var txt1 = new Kinetic.Text({
    text : txtVar,
    align       : 'center',
    width       : 60,
    y : Y + 7,
    x : X + 10,
    fontFamily: "Courier",
    fontStyle : "normal",
    fontSize : 13,
    fill    :'black'
  });

  var blockValue = new Kinetic.Rect({
    x: X + tableVarWidth,
    y: Y,
    width: tableValueWidth,
    height: tableCellHeight,
    stroke: 'black',
    strokeWidth: 1,
    fill: 'white'
  });

  var txt2 = new Kinetic.Text({
    text : txtValue,
    align       : 'center',
    width       : tableValueWidth,
    y : Y+7,
    x : X + tableValueWidth,
    fontFamily: "Courier",
    fontStyle : "normal",
    fontSize : 13,
    fill    :'black'
  });

  if (txtValue == 'list/pair') {
    var id = toString(realValue);
    var dimension = 350;
    //var shape = drawPair(realValue, X + tableValueWidth * 2, Y - dimension/2, dimension, id);
    var shape = drawPair(realValue, X + tableValueWidth * 2, Y, dimension, id);
    

    txt2.on('mouseover', function() {
      txt2.fill("#005aff");
      stage.draw();
      document.body.style.cursor = 'pointer';
    });
    
    txt2.on('click' , function() {
      var tweenIn = new Kinetic.Tween({
        node: shape, 
        duration: 0.3,
        opacity: 1
      });
    
      tweenIn.play();
      shape.moveToTop();
      stage.draw();
    });

    txt2.on('mouseout', function() {
      var tweenOut = new Kinetic.Tween({
        node: shape, 
        duration: 0.3,
        opacity: 0,
        onFinish: function() {
          shape.moveDown();
          document.body.style.cursor = 'auto';
        }
      });
      tweenOut.play();
      txt2.fill("black");
      stage.draw();
      document.body.style.cursor = 'default';
    });
  }


  image.add(blockVar);
  image.add(blockValue);
  image.add(txt1);
  image.add(txt2);

  return image;
}

/**
* @lst a (non-empty)list as an input
* @x the x axis value for the starting point of list visualization
* @y the y axis value for the starting point of list visualization
* @dimension the default size of drawing, which shall be resized in this function
* @thisId  for debugging
*/
function drawPair(lst, x, y, dimension, thisId) {
    var layerPair = new Kinetic.Layer({
      width : 500,
      height : 500,
      opacity : 0,
      id : thisId,
    });
    
    var pairBack = new Kinetic.Rect({
      x: x,
      y: y,
      width: dimension,
      height: dimension,
      fill: 'white',
      stroke : '#eb9800',
      id : 'pairBackground',
      opacity : 1
    });

    // resize
    var length = list_to_tree(lst, "length") * 40;
    if (length < 100){
      length = 100;
    }

    pairBack.setWidth(length);
    pairBack.setHeight(length);

    var posX = x + length/4;
    var posY = y + length/10;

    layerPair.add(pairBack);

    drawTree(list_to_tree(lst, "tree"), posX , posY, layerPair);
    stage.add(layerPair);

    stage.draw();
    return layerPair;
}

function drawFunction(X, Y, body, defined_in, frameArray, targetId, currentId, contentArray, sameFrame, originalName) {
  // =================================================================
  //  Initializing sizes
  //  Preparing shapes
  // =================================================================

  var r = 10;
  var adjustY = 15;
  var centerXOne = X - r;
  var centerXTwo = X + r;
  var centerYOne = Y + adjustY;
  var centerYTwo = Y + adjustY;
  var image = new Kinetic.Group();
  var circleColor = '#005aff';
  var replicatedFuncColor = '#ff2600';
  var textX = X - 205 + tableVarWidth;
  var textY = Y + tableCellHeight/4;

  // if the function is "original"
  if (targetId == null) {
    // Left circle
    var circleOne = new Kinetic.Circle({
                          x: centerXOne,
                          y: centerYOne,
                          radius: r,
                          stroke: circleColor,
                          strokeWidth: 1,
                          name : "circleOne" + currentId
                        });
    var circleOneCenter = new Kinetic.Circle({
                          x: centerXOne,
                          y: centerYOne,
                          radius: 2,
                          stroke: circleColor,
                          strokeWidth: 1,
                          fill: circleColor
                        });
    var circleOneFull = new Kinetic.Group();
    circleOneFull.add(circleOne);
    circleOneFull.add(circleOneCenter);  
    //Right circle
    var circleTwo = new Kinetic.Circle({
                          x: centerXTwo,
                          y: centerYTwo,
                          radius: r,
                          stroke: circleColor,
                          strokeWidth: 1,
                          name : "whatever"
                        });
    var circleTwoCenter = new Kinetic.Circle({
                          x: centerXTwo,
                          y: centerYTwo,
                          radius: 2,
                          stroke: circleColor,
                          strokeWidth: 1,
                          fill: circleColor
                        });
    var circleTwoFull = new Kinetic.Group();
    circleTwoFull.add(circleTwo);
    circleTwoFull.add(circleTwoCenter);
    var outArrow_x1 = X - 205 + 1.5 * tableVarWidth;
    var outArrow_y1 = centerYOne;
    var outArrow_x2 = centerXOne - r;
    var outArrow_y2 = outArrow_y1;
    const outArrow_angle = Math.atan2(outArrow_y2 - outArrow_y1, outArrow_x2 - outArrow_x1);

    var outArrow = new Kinetic.Line({
      points      : [outArrow_x1  , outArrow_y1,
                    outArrow_x2, outArrow_y2, 
                    outArrow_x2 - arrowHeadlength * Math.cos(outArrow_angle - Math.PI/6), outArrow_y2 - arrowHeadlength * Math.sin(outArrow_angle - Math.PI/6), 
                    outArrow_x2, outArrow_y2, 
                    outArrow_x2 - arrowHeadlength * Math.cos(outArrow_angle + Math.PI/6), outArrow_y2 - arrowHeadlength * Math.sin(outArrow_angle + Math.PI/6)],
      stroke : circleColor,
      strokeWidth : 1
    });
    var arrowTail = new Kinetic.Circle({
                          x: outArrow_x1,
                          y: outArrow_y1,
                          radius: 2,
                          stroke: circleColor,
                          strokeWidth: 1,
                          fill: circleColor
                        });
    var outArrowFull = new Kinetic.Group();
    outArrowFull.add(outArrow);
    outArrowFull.add(arrowTail);
    
    image.add(circleOneFull);
    image.add(circleTwoFull);
    image.add(outArrowFull);
  } else {
    var functionText = new Kinetic.Text({
      x: textX,
      y: textY,
      text : originalName,
      align       : 'center',
      width       : tableVarWidth,
      fontFamily: "Courier",
      fontStyle : "oblique",
      fontSize : 13,
      fill    :circleColor,
      id: originalName
    });
    image.add(functionText);
  }

  // if the function is "original"
  if (targetId == null) {
    // =================================================================
    //  Drawing function body representation
    //  Function body will pop over when the left circle is clicked on.
    // =================================================================

    // formatting: add new lines to function body
    var txt = body.replace(/"; "/g, ";");
    txt = body.replace(/;/g, "; \n");
    txt = txt.replace(/'{ '/g, "{");
    txt = txt.replace(/{/g, "{ \n\t");
    txt = txt.replace(/'} '/g, "}");
    txt = txt.replace(/}/g, "} \n");

    var functionBody = new Kinetic.Layer({
        x : 0,
        y : 0,
        width : 500,
        height : 500,
        //opacity : 0,
        id : 'functionBody'
      });

    var functionGroup = new Kinetic.Group({
      opacity : 0
    });

    var txt1 = new Kinetic.Text({
      text : txt,
      align       : 'left',
      width       : 230,
      fontFamily: "Courier",
      fontStyle : "normal",
      fontSize : 14,
      fill    :circleColor,
    });

    var thisX = X;
    var thisY = Y - txt1.getHeight()/4;
    txt1.x(thisX + 10);
    txt1.y(thisY + 5);

    var functionBack = new Kinetic.Rect({
      x: thisX,
      y: thisY,
      width: txt1.getTextWidth() + 10,
      height: txt1.getHeight() + 10,
      fill: '#ffe3b0',
      stroke : '#eb9800',
      id : 'redRect',
      opacity : 1
    });
    
    functionGroup.add(functionBack);
    functionGroup.add(txt1);
    functionBody.add(functionGroup);
    stage.add(functionBody);
    var zIndex = functionBody.getAbsoluteZIndex();

    circleOneFull.on('mouseover', function() {
      circleOne.fill(circleColor);
      stage.draw();
      document.body.style.cursor = 'pointer';
    });

    circleOneFull.on('click' , function() {
      var tweenIn = new Kinetic.Tween({
        node: functionGroup, 
        duration: 0.3,
        opacity: 1
      });
      tweenIn.play();
      functionBody.moveToTop();
      stage.draw();
    });

    circleOneFull.on('mouseout', function() {
        var tweenOut = new Kinetic.Tween({
        node: functionGroup, 
        duration: 0.3,
        opacity: 0,
        onFinish: function() {
          functionBody.moveDown();
          document.body.style.cursor = 'auto';
        }
      });
      //functionBody.setOpacity(1);
      circleOne.fill('white');
      tweenOut.play();
      stage.draw(); //important
    });
  }

  // =================================================================
  //  Drawing link back to original frame
  //  An arrow (which links back to the frame in which the function
  //  was originally defined) will appear when the cursor hover over
  //  the right circle.
  //  Draw the arrow according to 3 possible cases.
  // =================================================================

  // @var destX: x value of original frame
  // @var destY: y value of original frame
  var destFrameX = frameArray[defined_in].get("Rect")[0].x();
  var destFrameY = frameArray[defined_in].get("Rect")[0].y();

  if (targetId == null) {
  } else if (!sameFrame){
    var targetCircles = frameArray[defined_in].find("Circle");
    var destX = targetCircles[targetId * 5].x();
    var destY = targetCircles[targetId * 5].y();
  } else {
    var targetCircles = contentArray[targetId].find("Circle");
    var destX = targetCircles[0].x();
    var destY = targetCircles[0].y();
  }

  // find the targeted original function
  var pointsPath = [];

  if (targetId == null) {
    // we'll need 5 points for this case
    var x1 = centerXTwo;
    var y1 = centerYTwo;
    var x2 = x1 + 20;
    var y2 = y1;
    var x3 = x2;
    var y3 = destFrameY + blockDimensions + 10;
    var x4 = destFrameX + blockDimensions * 3/4;
    var y4 = y3;
    var x5 = x4;
    var y5 = destFrameY + blockDimensions;
    var defFrameArrow_angle = Math.atan2(y5 - y4, x5 - x4);

    pointsPath = [x1, y1,
                  x2, y2,
                  x3, y3,
                  x4, y4,
                  x5, y5,
                  x5 - arrowHeadlength * Math.cos(defFrameArrow_angle - Math.PI/6), y5 - arrowHeadlength * Math.sin(defFrameArrow_angle - Math.PI/6), 
                  x5, y5, 
                  x5 - arrowHeadlength * Math.cos(defFrameArrow_angle + Math.PI/6), y5 - arrowHeadlength * Math.sin(defFrameArrow_angle + Math.PI/6)];
  } else {
    var arrowTextTailX = textX + tableValueWidth;
    var arrowTextTailY = textY + 0.25 * tableCellHeight;

    var arrowTextTail = new Kinetic.Circle({
                          x: arrowTextTailX,
                          y: arrowTextTailY,
                          radius: 2,
                          stroke: replicatedFuncColor,
                          strokeWidth: 1,
                          visible: false
                        });
    image.add(arrowTextTail);
    if (!sameFrame) {
      // we'll need 6 points for this case
      var x1 = arrowTextTailX;
      var y1 = arrowTextTailY;
      var x2 = x1 + 20 + 4*r;
      var y2 = y1;
      var x3 = x2;
      var y3 = destFrameY + blockDimensions + 10;
      var x4 = destX - 30;
      var y4 = y3;
      var x5 = x4;
      var y5 = destY; //+ blockDimensions - 3;
      var x6 = destX - r;
      var y6 = y5;
      var defFrameArrow_angle = Math.atan2(y6 - y5, x6 - x5);

      pointsPath = [x1, y1,
                    x2, y2,
                    x3, y3,
                    x4, y4,
                    x5, y5,
                    x6, y6,
                    x6 - arrowHeadlength * Math.cos(defFrameArrow_angle - Math.PI/6), y6 - arrowHeadlength * Math.sin(defFrameArrow_angle - Math.PI/6), 
                    x6, y6, 
                    x6 - arrowHeadlength * Math.cos(defFrameArrow_angle + Math.PI/6), y6 - arrowHeadlength * Math.sin(defFrameArrow_angle + Math.PI/6)];
    } else {
      // we'll need 5 points for this case
      var x1 = arrowTextTailX;
      var y1 = arrowTextTailY;
      var x2 = x1 + 15;
      var y2 = y1;
      var x3 = x2;
      var y3 = destY;
      var x4 = destX - r;
      var y4 = y3;
      var defFrameArrow_angle = Math.atan2(y4 - y3, x4 - x3);

      pointsPath = [x1, y1,
                    x2, y2,
                    x3, y3,
                    x4, y4,
                    x4 - arrowHeadlength * Math.cos(defFrameArrow_angle - Math.PI/6), y4 - arrowHeadlength * Math.sin(defFrameArrow_angle - Math.PI/6), 
                    x4, y4, 
                    x4 - arrowHeadlength * Math.cos(defFrameArrow_angle + Math.PI/6), y4 - arrowHeadlength * Math.sin(defFrameArrow_angle + Math.PI/6)];
    }
  }

  var definedLeft = frameArray[defined_in].find("Rect")[0];
  var definedRight = frameArray[defined_in].find("Rect")[1];

  if (targetId == null) {
    var defFrameArrow = new Kinetic.Line({
      points : pointsPath,
      stroke : circleColor,
      strokeWidth : 1,
      visible: false
    });
    image.add(defFrameArrow);

    circleTwoFull.on('mouseover', function() {
      circleTwo.fill(circleColor);
      definedRight.stroke(circleColor);
      definedRight.strokeWidth(2);
      definedLeft.stroke(circleColor);
      definedLeft.strokeWidth(2);
      if (defined_in == 0) {
        var definedDiagLine = frameArray[defined_in].find("Line")[0];
        definedDiagLine.stroke(circleColor);
        definedDiagLine.strokeWidth(2);
      }

      defFrameArrow.visible(true);
      stage.draw();
      document.body.style.cursor = 'pointer';
    });

    circleTwoFull.on('mouseout', function() {
      var originalColor = '#eb9800';
      circleTwo.fill('white');
      definedRight.stroke(originalColor);
      definedRight.strokeWidth(1);
      definedLeft.stroke(originalColor);
      definedLeft.strokeWidth(1);
      if (defined_in == 0) {
        var definedDiagLine = frameArray[defined_in].find("Line")[0];
        definedDiagLine.stroke(originalColor);
        definedDiagLine.strokeWidth(1);
      }

      defFrameArrow.visible(false);
      stage.draw(); 
      document.body.style.cursor = 'auto';
    });
  } else {
    var defFrameArrow = new Kinetic.Line({
      points : pointsPath,
      stroke : replicatedFuncColor,
      strokeWidth : 1,
      visible: false
    });
    image.add(defFrameArrow);
    if (!sameFrame) {
      functionText.on('mouseover', function() {
        arrowTextTail.visible(true);
        defFrameArrow.visible(true);
        image.moveToTop();
        functionText.fill(replicatedFuncColor);
        targetCircles[targetId * 5].stroke(replicatedFuncColor);
        targetCircles[targetId * 5 + 1].stroke(replicatedFuncColor);
        targetCircles[targetId * 5 + 2].stroke(replicatedFuncColor);
        targetCircles[targetId * 5 + 3].stroke(replicatedFuncColor);
        stage.draw();
        document.body.style.cursor = 'pointer';
      });

      functionText.on('mouseout', function() {
        arrowTextTail.visible(false);
        defFrameArrow.visible(false);
        functionText.fill(circleColor);
        targetCircles[targetId * 5].stroke(circleColor);
        targetCircles[targetId * 5 + 1].stroke(circleColor);
        targetCircles[targetId * 5 + 2].stroke(circleColor);
        targetCircles[targetId * 5 + 3].stroke(circleColor);
        stage.draw(); 
        document.body.style.cursor = 'auto';
      });
    } else {
      functionText.on('mouseover', function() {
        arrowTextTail.visible(true);
        defFrameArrow.visible(true);
        image.moveToTop();
        functionText.fill(replicatedFuncColor);
        targetCircles[0].stroke(replicatedFuncColor);
        targetCircles[1].stroke(replicatedFuncColor);
        targetCircles[2].stroke(replicatedFuncColor);
        targetCircles[3].stroke(replicatedFuncColor);
        stage.draw();
        document.body.style.cursor = 'pointer';
      });

      functionText.on('mouseout', function() {
        arrowTextTail.visible(false);
        defFrameArrow.visible(false);
        functionText.fill(circleColor);
        targetCircles[0].stroke(circleColor);
        targetCircles[1].stroke(circleColor);
        targetCircles[2].stroke(circleColor);
        targetCircles[3].stroke(circleColor);
        stage.draw(); 
        document.body.style.cursor = 'auto';
      });
    }
  }
  return image;
}


/**
* Combine headings and contents
* Insert contents into the table. Draw everything as a group.
* @param X
* @param Y
* @param layer
* @param frameContent: an array containing pairs: [varName, varValue] 
* @param inputArray: original input array, containing all the information
* @param frameArray: array containing the drawn shapes
* @param currentFrameId: index of current frame
* @param delay: overall delay array
*/

function drawFrame(X, Y, layer, frameContent, inputArray, frameArray, currentFrameId, delay) {
  image2 = new Kinetic.Group();

  image2.add(drawFrameHeading(X,Y,layer));
  var count = 0;
  var nextX = X;
  var nextY = Y + 25;
  // keep track of local shapes
  var contentArray = [];
  // go through the frameContent array
  while(count <= frameContent.length - 1) {
    var varName = head(frameContent[count]);
    var tagType = tail(frameContent[count]).a;  // tag
    
    var isFunc = false;
    var varRealValue;
    //var varValue;
    switch(tagType) {
      case "primitive":
        varValue = tail(frameContent[count]).value;
        break;
      case "function":
        var index = tail(frameContent[count]).index;
        var defined_in = tail(frameContent[count]).defined_in;
        if (defined_in > currentFrameId) {
          delay[delay.length] = {
            localFrame: currentFrameId,
            funcIndex: index,
            varIndex: count, 
            name: varName,
            definedIn: defined_in
          };
          varValue = '';
          break;
        }
        varValue = '';
        var localFunctions = inputArray[defined_in][2][1];
        for (var i = 0; i < localFunctions.length; i++) {
          if (localFunctions[i].index == index) {
            var functionBody = "\nBody: " + (localFunctions[i]).body;
            var functionParams = "Params: " + (localFunctions[i]).parameters.toString();
            functionBody = functionParams + functionBody;
            // mark whether a function is defined locally
            var targetId = null;
            var sameFrame = false;
            var originalName = localFunctions[i].name;
            if (currentFrameId != defined_in){
              targetId = index;
            } else if (varName != originalName && originalName != 'lambda') {
              targetId = index;
              sameFrame = true;
            }

            break;
          }
        }
        isFunc = true;
        image2.add(drawFrameContent(nextX, nextY, layer, varName, varValue, null));
        contentArray[i] = drawFunction(nextX + 205, nextY, functionBody, defined_in, frameArray, targetId, index, contentArray, sameFrame, originalName);
        image2.add(contentArray[i]);
        
        break;
      case "pair":
        varValue = "list/pair";
        varRealValue = tail(frameContent[count]).value;
        break;
    }

    if (varValue == null) {
      varValue = "undefined";
    }
    if (!isFunc) {
      image2.add(drawFrameContent(nextX, nextY, layer, varName, varValue, varRealValue));
    }
    nextY += 25;
    count ++;
  }
  return image2;
}

function drawDelay(delay, frameArray, inputArray) {
  var image = new Kinetic.Group();
  for (var i = 0; i < delay.length; i++) {
    var index = delay[i].funcIndex;
    var defined_in = delay[i].definedIn;
    var currentFrameId = delay[i].localFrame;
    var varName = delay[i].name;
    var varIndex = delay[i].varIndex;

    var posX = frameArray[currentFrameId].get("Rect")[2].x();
    var posY = frameArray[currentFrameId].get("Rect")[2].y() + (varIndex + 1)* tableCellHeight;
    varValue = '';
    var localFunctions = inputArray[defined_in][2][1];
    for (var j = 0; j < localFunctions.length; j++) {
      if (localFunctions[j].index == index) {
        // mark whether a function is defined locally
        var originalName = localFunctions[j].name;
        
        image.add(drawDelayFunction(posX, posY, defined_in, currentFrameId, j, varName, frameArray, originalName));
        break;
      }
    }
  }
  return image;
}

function drawDelayFunction(posX, posY, defined_in, currentFrameId, targetId, varName, frameArray, originalName) {
  var r = 10;
  var image = new Kinetic.Group();
  var circleColor = '#005aff';
  var replicatedFuncColor = '#ff2600';

  // =================================================================
  //  Drawing link back to original frame
  //  An arrow (which links back to the frame in which the function
  //  was originally defined) will appear when the cursor hover over
  //  the right circle.
  //  Draw the arrow according to 3 possible cases.
  // =================================================================

  // @var destFrameX: x value of original frame
  // @var destFrameY: y value of original frame
  // @var currentFrameX: x value of current frame
  // @var currentFrameY: y value of current frame
  // @var destX: x value of target circle
  // @var destY: y value of target circle

  var destFrameX = frameArray[defined_in].get("Rect")[0].x();
  var destFrameY = frameArray[defined_in].get("Rect")[0].y();

  var currentFrameX = frameArray[currentFrameId].get("Rect")[0].x();
  var currentFrameY = frameArray[currentFrameId].get("Rect")[0].y();

  var targetCircles = frameArray[defined_in].find("Circle");
  var destX = targetCircles[targetId * 5 + 1].x();
  var destY = targetCircles[targetId * 5 + 1].y();
  
  // @var textX, textY: x, y value of the function text

  var textX = posX + tableVarWidth;
  var textY = posY + tableCellHeight/4;

  var functionText = new Kinetic.Text({
    x: textX,
    y: textY,
    text : originalName,
    align       : 'center',
    width       : tableVarWidth,
    fontFamily: "Courier",
    fontStyle : "oblique",
    fontSize : 13,
    fill    :circleColor,
    id: originalName
  });

  // find the targeted original function
  var pointsPath = [];

  var arrowTextTailX = textX + tableValueWidth;
  var arrowTextTailY = textY + 0.25 * tableCellHeight;

  var arrowTextTail = new Kinetic.Circle({
                        x: arrowTextTailX,
                        y: arrowTextTailY,
                        radius: 2,
                        stroke: replicatedFuncColor,
                        strokeWidth: 1,
                        visible: false
                      });
  image.add(arrowTextTail);

  // we'll need 6 points for this case
  var x1 = arrowTextTailX;
  var y1 = arrowTextTailY;
  var x2 = x1 + 15;
  var y2 = y1;
  var x3 = x2;
  var y3 = currentFrameY + blockDimensions + 10;
  var x4 = destX - 30;
  var y4 = y3;
  var x5 = x4;
  var y5 = destY; //+ blockDimensions - 3;
  var x6 = destX - r;
  var y6 = y5;
  var defFrameArrow_angle = Math.atan2(y6 - y5, x6 - x5);

  var pointsPath = [x1, y1,
                    x2, y2,
                    x3, y3,
                    x4, y4,
                    x5, y5,
                    x6, y6,
                    x6 - arrowHeadlength * Math.cos(defFrameArrow_angle - Math.PI/6), y6 - arrowHeadlength * Math.sin(defFrameArrow_angle - Math.PI/6), 
                    x6, y6, 
                    x6 - arrowHeadlength * Math.cos(defFrameArrow_angle + Math.PI/6), y6 - arrowHeadlength * Math.sin(defFrameArrow_angle + Math.PI/6)];


  var defFrameArrow = new Kinetic.Line({
    points : pointsPath,
    stroke : replicatedFuncColor,
    strokeWidth : 1,
    visible: false
  });
  image.add(defFrameArrow);
  image.add(functionText);

  functionText.on('mouseover', function() {
    arrowTextTail.visible(true);
    defFrameArrow.visible(true);
    image.moveToTop();
    functionText.fill(replicatedFuncColor);
    targetCircles[targetId * 5 + 1].stroke(replicatedFuncColor);
    targetCircles[targetId * 5 + 2].stroke(replicatedFuncColor);
    targetCircles[targetId * 5 + 3].stroke(replicatedFuncColor);
    targetCircles[targetId * 5 + 4].stroke(replicatedFuncColor);
    stage.draw();
    document.body.style.cursor = 'pointer';
  });

  functionText.on('mouseout', function() {
    arrowTextTail.visible(false);
    defFrameArrow.visible(false);
    functionText.fill(circleColor);
    targetCircles[targetId * 5 + 1].stroke(circleColor);
    targetCircles[targetId * 5 + 2].stroke(circleColor);
    targetCircles[targetId * 5 + 3].stroke(circleColor);
    targetCircles[targetId * 5 + 4].stroke(circleColor);
    stage.draw(); 
    document.body.style.cursor = 'auto';
  });

  return image;
}

// ======================================================
//  Initializations and Sizes
// ======================================================

const stageWidth = 1200;
const stageHeight = 1200;
const paddingX = 500;
const paddingY = 500;

var initX = stageWidth - paddingX;
var initY = stageHeight - paddingY;
var incrementInitX = 250;
var frameX = initX - 25;
var frameY = initY + 50;
var incrementFrameX = 200;
var incrementInitY = 200;

var tableVarWidth = 75;
var tableValueWidth = 75;
var tableCellHeight = 25;


var effectiveStageWidth = initX;
var effectiveStageHeight = initY;
// for arrow
const arrowHeadlength = 5;

const blockDimensions = 25;

var stage = new Kinetic.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight
  });


// ======================================================
//  Main Parser
// ======================================================

/*
* Parsing the input pair
* @param inputArray
* Description: use a for loop to iterate through the input array
* For details on the structure of the input array, please read the user guide.
* @return: a pair with head = stage width and tail = stage height (for JFDI integration)
*/

function parseInput(inputArray) {
  var totalFramesNo = inputArray.length;
  var relativePosY = 0;
  var compareEnclosingFrameId = 0;
  var posX = initX;
  var posY = initY;
  const fixedHeightAlloc = 100;

  stage.clear();
  var layer = new Kinetic.Layer();
  var frameArray = [];
  var delay = [];
  var prevAdj = false;
  var distance = 0;
  for (var i = 0; i < totalFramesNo; i++) {
    // initialization
    var currentFrame = inputArray[i];
    var frameVarNumber = currentFrame.length - 3;
    // @var firstChild: whether the current frame is the first frame that links back to enclosing frame
    // mainly for aesthetic purposes
    var firstChild = true; 
    
    var currentFrameId = currentFrame[0][1];
    var enclosingFrameId = currentFrame[1][1];
    
    var tableHeight = frameVarNumber * tableCellHeight;

    // list and table arrangement: deciding how much should be added on to posY 

    // make enough space for the tables
    if (i <= totalFramesNo - 2 
        && inputArray[i+1][1][1] == currentFrameId
        && inputArray[i+1].length - 3 > tableHeight) {
      tableHeight = (inputArray[i+1].length - 3) * tableCellHeight;
    }
    
    // determine whether to increase/decrease posY
    //
    // @var distance: the distance correction in special case: when a function defined
    // in another frame was called in the current frame.
    //
    // .if the frame is global: 
    // => no change needed.
    // .if the previous frame in the array is the enclosing frame of current frame:
    // => check if any correction is required. Else no change in posY.
    // .if the previous frame in the array is NOT the enclosing frame of current frame:
    // => check if any correction is required. Decrease posY.

    if (enclosingFrameId == null) {
      layer.clear();
    } else if (enclosingFrameId == inputArray[i-1][0][1]) {
      if (prevAdj) {
        posY = posY - distance;
        distance = 0;
        prevAdj = false;
      }
    } else if (enclosingFrameId > inputArray[i-1][1][1]) {
      distance = frameArray[enclosingFrameId].get("Rect")[0].y() - posY;
      posY = posY + distance;
      prevAdj = true;
    } else if (enclosingFrameId != inputArray[i-1][0][1]) {
      firstChild = false;
      if (prevAdj) {
        posY = posY - distance;
        distance = 0;
        prevAdj = false;
      }
      posY = posY - tableHeight - fixedHeightAlloc;
    }  


    // if there is an enclosing frame, move posX to the left of that enclosing frame
    if (enclosingFrameId != null) {
      var target = frameArray[enclosingFrameId].get("Rect")[0];
      posX = target.x() - incrementInitX;
    }

    // initialize a new group
    frameArray[i] = new Kinetic.Group({
      id : currentFrameId,
      enclosing : enclosingFrameId
    });
    
    // actual drawing
    drawList(posX, posY, layer, enclosingFrameId, currentFrameId, firstChild, inputArray, frameArray);
    if (frameVarNumber > 0) {
      var frameVarContent = [];
      for (var j = 0; j < frameVarNumber; j++) {
        frameVarContent[j] = currentFrame[j + 3];
      }
      frameArray[i].add(drawFrame(posX - 25, posY + 50, layer, frameVarContent, inputArray, frameArray, currentFrameId, delay));
    }
    layer.add(frameArray[i]);
    layer.draw();
  }

  // create a new layer for the delayed actions
  // this is needed for aesthetic purpose 
  // (so that delayed fns won't be hidden when other frames were move to top)
  var delayLayer = new Kinetic.Layer();
  delayLayer.add(drawDelay(delay, frameArray, inputArray));
  delayLayer.draw();
  
  stage.add(layer);
  stage.add(delayLayer);
  return pair(stageWidth, stageHeight);
}
