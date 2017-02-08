
/*
* Draw the list of frames
* @modified
*/
function drawList(X, Y, layer, prevId, relativePos, tableLength) {
  listImage = new Kinetic.Group();
  
  const blockDimensions = 50;
  
  // for arrow
  const arrowHeadlength = 10;
  
  if (prevId != null) {
    var target = frameArray[prevId].find("Rect")[0];
    //var actualY = Y - (relativePos - 1) * incrementInitY;
    // lineEnv: the line linking elements of the list
    // sizes:
    var lineEnv_x1 = X + 1.5 * blockDimensions;
    var lineEnv_y1 = Y + 0.5 * blockDimensions;
    var lineEnv_corner_x = target.x() + ((relativePos == 1)? 0 : 15);//X + 395;
    var lineEnv_corner_y = lineEnv_y1;
    var lineEnv_x2 = lineEnv_corner_x;
    var lineEnv_y2 = target.y() + ((relativePos == 1)? 0.5 * blockDimensions : 0);
    const lineEnv_angle = Math.atan2(lineEnv_y2 - lineEnv_corner_y, lineEnv_x2 - lineEnv_corner_x);

    var lineEnv = new Kinetic.Line({
      points      : [lineEnv_x1, lineEnv_y1,
                    lineEnv_corner_x, lineEnv_corner_y,
                    lineEnv_x2, lineEnv_y2, 
                    lineEnv_x2 - arrowHeadlength * Math.cos(lineEnv_angle - Math.PI/6), lineEnv_y2 - arrowHeadlength * Math.sin(lineEnv_angle - Math.PI/6), 
                    lineEnv_x2, lineEnv_y2, 
                    lineEnv_x2 - arrowHeadlength * Math.cos(lineEnv_angle + Math.PI/6), lineEnv_y2 - arrowHeadlength * Math.sin(lineEnv_angle + Math.PI/6)],
      strokeWidth : 2,
      stroke: '#eb9800'
    });
  }
  //var fullListId = "listId"+listId;

  // blockLeft & blockRight: the shape of an element in the list
  var blockLeft = new Kinetic.Rect({
    x: X,
    y: Y,
    width: blockDimensions,
    height: blockDimensions,
    stroke: '#eb9800',
    strokeWidth: 3,
    fill: 'white',
  });
 
  var blockRight = new Kinetic.Rect({
    x: X + blockDimensions,
    y: Y,
    width: blockDimensions,
    height: blockDimensions,
    stroke: '#eb9800',
    strokeWidth: 3,
    fill: 'white'
  });

  var diagonal = new Kinetic.Line({
    points      : [X + blockDimensions, Y + blockDimensions,
                   X + 2 * blockDimensions, Y],
    strokeWidth : 3,
    stroke: '#eb9800'
  });
  
  // add every element to the group
  listImage.add(blockLeft);
  listImage.add(blockRight);

  // if the pair represents global env: add a diagonal line 
  // indicating the end of the list
  if(prevId != null) {
    listImage.add(lineEnv);
    blockLeft.on('mouseover', function () {
      blockLeft.stroke('#005aff');
      blockLeft.strokeWidth(4);
      blockLeft.moveToTop();

      blockRight.stroke('#005aff');
      blockRight.strokeWidth(4);
      blockRight.moveToTop();

      lineEnv.stroke('#005aff');
      lineEnv.strokeWidth(4);
      lineEnv.moveToTop();
      layer.draw();
    });
    blockLeft.on('mouseout', function () {
      blockLeft.stroke('#eb9800');
      blockLeft.strokeWidth(2);

      blockRight.stroke('#eb9800');
      blockRight.strokeWidth(2);

      lineEnv.stroke('#eb9800');
      lineEnv.strokeWidth(2);
      layer.draw();
    });
  } else {
    listImage.add(diagonal);
  }
  
  return listImage;
}

/**
* Draw the headings for the tables
* @modified
*/

function drawFrameHeading(X, Y, layer) {
  imageHeading = new Kinetic.Group();

  var blockVar = new Kinetic.Rect({
    x: X,
    y: Y,
    width: tableVarWidth,
    height: tableCellHeight,
    stroke: 'black',
    strokeWidth: 2,
    fill: 'black'
  });

  var txtVar = new Kinetic.Text({
    text : "Var",
    align : 'center',
    width : 120,
    y : Y + 15,
    x : X + 20,
    fontStyle : "bold",
    fontSize : 20,
    fill :'white'
  });

  var blockValue = new Kinetic.Rect({
    x: X + tableVarWidth,
    y: Y,
    width: tableValueWidth,
    height: tableCellHeight,
    stroke: 'black',
    strokeWidth: 2,
    fill: 'black'
  });

  var txtValue = new Kinetic.Text({
    text : "Value",
    align       : 'center',
    width       : 100,
    y : Y + 15,
    x : (X + tableVarWidth) + 20,
    fontStyle : "bold",
    fontSize : 20,
    fill    :'white'
  });

  
  // for arrow
  const arrowHeadlength = 10;
  // lineDown: the line from head of each element of the list to its table
  // sizes:
  var lineDown_x1 = X + 75;
  var lineDown_y1 = Y - 75;
  var lineDown_x2 = lineDown_x1;
  var lineDown_y2 = Y;
  const lineDown_angle = Math.atan2(lineDown_y2 - lineDown_y1, lineDown_x2 - lineDown_x1);

  var lineDown = new Kinetic.Line({
    points      : [lineDown_x1  , lineDown_y1,
                  lineDown_x2, lineDown_y2, 
                  lineDown_x2 - arrowHeadlength * Math.cos(lineDown_angle - Math.PI/6), lineDown_y2 - arrowHeadlength * Math.sin(lineDown_angle - Math.PI/6), 
                  lineDown_x2, lineDown_y2, 
                  lineDown_x2 - arrowHeadlength * Math.cos(lineDown_angle + Math.PI/6), lineDown_y2 - arrowHeadlength * Math.sin(lineDown_angle + Math.PI/6)],
    strokeWidth : 2,
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
*/

function drawFrameContent(X, Y, layer, varName, value) {
  var image = new Kinetic.Group();
  var txtVar = varName;
  var txtValue = value;

  var blockVar = new Kinetic.Rect({
    x: X,
    y: Y,
    width: tableVarWidth,
    height: tableCellHeight,
    stroke: 'black',
    strokeWidth: 2,
    fill: 'white'
  });

  var txt1 = new Kinetic.Text({
    text : txtVar,
    align       : 'center',
    width       : 120,
    y : Y + 10,
    x : X + 20,
    fontStyle : "normal",
    fontSize : 20,
    fill    :'black'
  });

  var blockValue = new Kinetic.Rect({
    x: X + tableVarWidth,
    y: Y,
    width: tableValueWidth,
    height: tableCellHeight,
    stroke: 'black',
    strokeWidth: 2,
    fill: 'white'
  });

  var txt2 = new Kinetic.Text({
    text : txtValue,
    align       : 'center',
    width       : 100,
    y : Y+10,
    x : X + tableValueWidth+ 10,
    fontStyle : "normal",
    fontSize : 20,
    fill    :'black'
  });

  image.add(blockVar);
  image.add(blockValue);
  image.add(txt1);
  image.add(txt2);

  return image;
}

/**
* Combine headings and contents
* Insert contents into the table. Draw everything as a group.
* @param varArray: array of variable name
* @param valueArray
*/

function drawFrame(X, Y, layer, frameContent) {
  image2 = new Kinetic.Group({
    draggable: true,
    //id: tableId
    //visible: false
  });

  image2.add(drawFrameHeading(X,Y,layer));
  var count = frameContent.length - 1;
  var nextX = X;
  var nextY = Y + 50;
  while(count >= 0) {
    var varName = head(frameContent[count]);
    var varValue = tail(frameContent[count]).tag;
    if (varValue == null) {
      varValue = "undefined";
    }
    image2.add(drawFrameContent(nextX, nextY, layer, varName, varValue));
    nextY += 50;
    count --;
  }
  image2.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
  });
  image2.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });

  return image2;

}



function connectThem(a, b, index){
  
  //layer.add(connectingLine);
  //alert('here');
  // get the XY of the actor+useCase to connect

  var x1 = a.x() + 120;
  var y1 = a.y() + 150;
  var x2 = b.x() + 150;
  var y2 = b.y() + 200;

  const arrowHeadlength = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  var connectingLine = new Kinetic.Line({
      points      : [x1, y1,
                    x2, y2, 
                    x2 - arrowHeadlength * Math.cos(angle - Math.PI/6), y2 - arrowHeadlength * Math.sin(angle - Math.PI/6), 
                    x2, y2, 
                    x2 - arrowHeadlength * Math.cos(angle + Math.PI/6), y2 - arrowHeadlength * Math.sin(angle + Math.PI/6)],
      strokeWidth : 3,
      stroke : 'green',
      draggable : true
  });
  /*
  // reposition the connecting line
  connectingLine.setPoints([x1, y1,
                            x2, y2, 
                            x2 - arrowHeadlength * Math.cos(angle - Math.PI/6), y2 - arrowHeadlength * Math.sin(angle - Math.PI/6), 
                            x2, y2, 
                            x2 - arrowHeadlength * Math.cos(angle + Math.PI/6), y2 - arrowHeadlength * Math.sin(angle + Math.PI/6)]);*/

  // send the connecting line to the back
  //connectingLine.setZIndex(0);

  // redraw the layer
  //layer.draw();
  //layer.add(connectingLine);
  layer.add(connectingLine);
};
//------------------------------------------------------
// For general testing. Waiting for the interpreter.
//------------------------------------------------------
/*
* Some initialization
*/
var initX = 1500;
var initY = 1500;
var incrementInitX = 400;
var frameX = initX - 50;
var frameY = initY + 100;
var incrementFrameX = 400;
var incrementInitY = 400;

var tableVarWidth = 150;
var tableValueWidth = 150;
var tableCellHeight = 50;
/*
* Input starts
* For testing only. Actual input will be different.
*/

var FrameOneVars = ["x","y", "f()","z"];
var FrameOneValues = [5,10, "body","list"];
var FrameTwoVars = ["p","q", "g()"];
var FrameTwoValues = ["undefined","z", "f()"];
var FrameThreeVars = ["T", "a()"];
var FrameThreeValues = ["true", "g()"];
var testArray = [FrameOneVars, FrameTwoVars, FrameThreeVars];
var testArray2 = [FrameOneValues, FrameTwoValues, FrameThreeValues];
//Input ends

var test = testArray.length - 1;


var stage = new Kinetic.Stage({
  container: 'container',
  width: 2000,
  height: 2000
});

var frameArray = [];
var listArray = [];
var connectingLine = [];
var layer = new Kinetic.Layer();
var numberTest = test;

/*
* Parsing the input pair
* @param inputPair
* @param prevId: id of the previous frame. If the frame is global: prevId = null;
* @param frameNo & total: keep track of the frames pointing to current frame (for aesthetic purposes)
* Description: go through the given input pair and draw list/frames accordingly
* Please see user_guide.txt and interpreter.js for more details on the input.
* UNDER CONSTRUCTION. 
*/

function parseInput(posX, posY, inputPair, prevId, relativePos) {
  // get the frame id and frame content from the input
  //var id = tail((head(inputPair))[0]).index;
  //var id = 0;
  var frameContent = head(inputPair);
  var tableLength = frameContent.length;
  var counter = frameArray.length;
  if (prevId == null) {
    layer.clear();
  }
  // put the frame list and table into 1 group

  frameArray[counter] = new Kinetic.Group();
  // draw the frame list
  frameArray[counter].add(drawList(posX, posY, layer, prevId, relativePos, tableLength));
  //alert('added list');
  // draw the table  
  frameArray[counter].add(drawFrame(posX - 50, posY + 100, layer, frameContent));
  layer.add(frameArray[counter]);
  //alert('added frame');

  layer.draw();
  // count the total number of frames pointing to current frames
  var total = 0;
  var tailInput = tail(inputPair);
  while (!is_empty_list(tailInput)) {
    total++;
    tailInput = tail(tailInput);
  }
  var incrementY = 0;

  // recursively continue parsing
  // next: see if there's any other frames pointing to current frame
  var next = tail(inputPair);

  // there might be multiple frames pointing to the same current frame
  // call parseInput on all of them
  // var i: keep track of the frames pointing to current frame (e.g. frames 1 of 3...)
  //        mainly for visual arrangement.
 for (var i = 1; i <= total; i++) {
    parseInput(posX - incrementInitX, posY - incrementY, head(next), counter, i);
    incrementY += incrementInitY;
    next = tail(next);
  }
  return 1;
}

function getFrameInfo(frameArray) {

}



/*

while(test >= 0) {
  //alert(listArray.length);
  if (test > 0) {
    listArray[test] = drawList(initX, initY, layer, test, 3, 3);
  } else {
    listArray[test] = drawList(initX, initY, layer, test, 3, null);
  }
  //listArray[listArray.length - 1].setId("listID" + test);
  
  //alert(test);
  layer.add(listArray[test]);
    //alert('after ' +listArray.length);

  frameArray[test] = drawFrame(frameX, frameY, layer, testArray[test], testArray2[test], test);
  //frameArray[frameArray.length - 1].setId("tableID" + test);

  layer.add(frameArray[test]);
   
  //connectThem(listArray[test], frameArray[test], test);

  initX += incrementInitX;
  frameX += incrementFrameX;
  test --;
}
*/
/*
//------------
var testElem = listArray[0].toObject(); //stage.find("#listID0")[0];
var att = document.createAttribute("data-toggle");
att.value = "collapse";
testElem.setAttributeNode(att);

var att1 = document.createAttribute("href");
att1.value = "#tableID0";
testElem.setAttributeNode(att1);

var att2 = document.createAttribute("aria-control");
att2.value = "tableID0";
testElem.setAttributeNode(att2);



var testTable = frameArray[0].toObject();//stage.find("#tableID0")[0];

var att3 = document.createAttribute("class");
att3.value = "collapse";
testTable.setAttributeNode(att3);

var att4 = document.createAttribute("id");
att4.value = "tableID0";
testTable.setAttributeNode(att4);

//------------
listArray[0].on('click', function() {
    //document.body.style.cursor = 'pointer';
    //alert(fullTableId);
    frameArray[0].collapse();
    layer.draw();
  });
  */

/**
* When dragging the tables, draw the lines again to connect them
*/

/*
listArray[0].on('mouseover', function () {
  var anim = new Kinetic.Animation(function() {
    var target = frameArray[0].find("Rect");
    target.stroke("green");
    target.strokeWidth(5);
  }, layer);
  anim.start();
    //connectThem(listArray[0],frameArray[0]);
});
listArray[0].on('mouseout', function () {
  var anim = new Kinetic.Animation(function() {
    var target = frameArray[0].find("Rect");
    target.stroke("black");
    target.strokeWidth(2);
  }, layer);
  anim.start();
    //connectThem(listArray[0],frameArray[0]);
});

*/
stage.add(layer);



