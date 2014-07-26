var g_cubeOBJ;
var g_cubeOBJparsed;
var g_ctx;
var g_renderEngine;
var g_testObject;
var g_camera;
var g_clipSpace;
var g_FPSManager;
var g_keyPressed = [];
var g_canvasWidth = 700;
var g_canvasHeight = 500;
var g_MonkeySpin = 0;
var g_frameCount = 0;
var xr=1.57;
var yr=3.17;
var see=-4;
var oldx=10,oldy=10;


/**
* This function runs the program
*/
function run() {
    gobuttonClick();
    var size = document.getElementById('in').value;
    document.getElementById('outs').value = fcode;
    document.outform.out.value = fcode;
    parseCommand(fcode, size);
    print();
    initialize();
    document.getElementById('in').value = size;
}

function read() {
    var size = document.getElementById('in').value;
    fcode = document.getElementById('outs').value;
    parseCommand(fcode, size);
    print();
    initialize();
}


function saveTextAsFile() {
    var textToWrite = document.getElementById('outn').value;

    var textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    });

    var fileNameToSaveAs = 'Javamath3Dfile.obj';


    var downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';

    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

function Matrix() {

    var tempArray = new Array(4)
    var arrayCount;
    for (arrayCount = 0; arrayCount < 4; arrayCount++)
        tempArray[arrayCount] = new Array(4)

    var rowCount, columnCount;

    for (rowCount = 0; rowCount < 4; rowCount++)
        for (columnCount = 0; columnCount < 4; columnCount++) {
            if (columnCount != rowCount) {
                tempArray[rowCount][columnCount] = 0;
            } else {
                tempArray[rowCount][columnCount] = 1;
            }

        }


    return tempArray;
}


function Normal(x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;
}

function Vertex(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = -z;
    this.w = 4;
}

function Polygon(verticesArray) {
    this.vertex = verticesArray;
    this.color = 'rgba(240, 80, 80, 1)';
}

function FPSManager() {
    this.dateNow;
    this.timeNow;
    this.timeLater;
    this.update = function () {

        this.dateNow = new Date();
        this.timeNow = this.dateNow.getTime();
        g_ctx.fillText(1000 / (this.timeNow - this.timeLater), 10, 50);
        this.timeLater = this.timeNow;
    }
}

function Object() {
    //this.verticesBuffer = [];
    //this.indicesBuffer = [];
    this.verticesArray = [];
    this.polygonsArray = [];
    this.centroidVerticesArray = [];
    this.transformMatrix = new Matrix();
    this.normalsArray = [];



    this.computeCentroid = function () {

        var averageX, averageY, averageZ;
        var polygonCount;
        var vertexCount;

        for (polygonCount = 0; polygonCount < this.polygonsArray.length; polygonCount++) {
            averageX = 0.0;
            averageY = 0.0;
            averageZ = 0.0;
            for (vertexCount = 0; vertexCount < this.polygonsArray[polygonCount].vertex.length; vertexCount++) {
                averageX += this.polygonsArray[polygonCount].vertex[vertexCount].x;
                averageY += this.polygonsArray[polygonCount].vertex[vertexCount].y;
                averageZ += this.polygonsArray[polygonCount].vertex[vertexCount].z;
            }

            averageX = averageX / this.polygonsArray[polygonCount].vertex.length;
            averageY = averageY / this.polygonsArray[polygonCount].vertex.length;
            averageZ = averageZ / this.polygonsArray[polygonCount].vertex.length;

            this.centroidVerticesArray.push(new Vertex(averageX, averageY, averageZ));
        }
    }

    this.loadOBJ = function () {

        var dataCount;
        var verticesCount;
        var verticesArray = [];

        for (dataCount = 0; dataCount < g_cubeOBJparsed.length; dataCount++) {
            if (g_cubeOBJparsed[dataCount] == 'v') {
                this.verticesArray.push(new Vertex(parseFloat(g_cubeOBJparsed[dataCount + 1]),
                    parseFloat(g_cubeOBJparsed[dataCount + 2]),
                    parseFloat(g_cubeOBJparsed[dataCount + 3])));
            }

            if (g_cubeOBJparsed[dataCount] == 'f') {
                verticesArray = [];
                verticesCount = dataCount + 1;

                while (g_cubeOBJparsed[verticesCount] != 'f' && verticesCount < g_cubeOBJparsed.length) {
                    verticesArray.push(this.verticesArray[g_cubeOBJparsed[verticesCount] - 1]);
                    verticesCount = verticesCount + 1;
                }
                this.polygonsArray.push(new Polygon(verticesArray));
            }
        }
        this.computeCentroid();
    }
}

function Camera() {
    this.transformMatrix = new Matrix();
}

function RenderEngine() {
    this.clipSpace = new Matrix();
    this.clipSpace = [
        [1.305, 0, 0, 0],
        [0, 1.740, 0, 0],
        [0, 0, 1.002, 1],
        [0, 0, -2.002, 0]
    ];

    this.render = function () {

        var polygonCount;
        var zClip;
        var zDepthOfPolygons = [];
        var zDepthOfPolygonsSorted = [];
        var polygonIndicesDepthSorted = [];

        var finalMatrix = MatrixMultiplication(g_testObject.transformMatrix, g_camera.transformMatrix);
        finalMatrix = MatrixMultiplication(finalMatrix, this.clipSpace);

        for (polygonCount = 0; polygonCount < g_testObject.polygonsArray.length; polygonCount++) {
            zClip = g_testObject.centroidVerticesArray[polygonCount].x * finalMatrix[0][2] + g_testObject.centroidVerticesArray[polygonCount].y * finalMatrix[1][2] + g_testObject.centroidVerticesArray[polygonCount].z * finalMatrix[2][2] + g_testObject.centroidVerticesArray[polygonCount].w * finalMatrix[3][2];

            zDepthOfPolygons.push(zClip);
        }


        zDepthOfPolygonsSorted = zDepthOfPolygons.slice();
        zDepthOfPolygonsSorted.sort(function (a, b) {
            return a - b
        });

        var sortCount, chaosCount;

        for (sortCount = 0; sortCount < zDepthOfPolygonsSorted.length; sortCount++) {
            for (chaosCount = 0; chaosCount < zDepthOfPolygons.length; chaosCount++) {
                if (zDepthOfPolygonsSorted[sortCount] == zDepthOfPolygons[chaosCount]) {
                    polygonIndicesDepthSorted.push(chaosCount);
                    zDepthOfPolygons[chaosCount] = 0;

                }
            }
        }

        var drawingPolygon;
        var xScreen = [];
        var yScreen = [];
        var clipVertex;
        var vertexCount;
        for (polygonCount = 0; polygonCount < polygonIndicesDepthSorted.length; polygonCount++) {
            
            drawingPolygon = g_testObject.polygonsArray[polygonIndicesDepthSorted[polygonCount]];
            xScreen = [];
            yScreen = [];

            for (vertexCount = 0; vertexCount < drawingPolygon.vertex.length; vertexCount++) {
                clipVertex = vertexMultiplication(drawingPolygon.vertex[vertexCount], finalMatrix);
                xScreen.push((clipVertex.x * g_canvasWidth) / (2 * clipVertex.w) + g_canvasWidth / 2);
                yScreen.push((clipVertex.y * g_canvasHeight) / (2 * clipVertex.w) + g_canvasHeight / 2);
            }
            
            this.drawPolygon(xScreen, yScreen, drawingPolygon.color);
        }
    }


    this.drawPolygon = function (xCoords, yCoords, color) {

        var coordsCounter = xCoords.length;

        g_ctx.fillStyle = color;
        g_ctx.beginPath();
        g_ctx.moveTo(xCoords[0], yCoords[0]);
        for (coordsCounter = 1; coordsCounter < xCoords.length; coordsCounter++)
            g_ctx.lineTo(xCoords[coordsCounter], yCoords[coordsCounter]);

        g_ctx.moveTo(xCoords[0], yCoords[0]);
        g_ctx.stroke();
        g_ctx.fill();
        g_ctx.closePath();
    }
}




function TranslationMatrix(x, y, z) {

    var outputMatrix = new Matrix();

    outputMatrix[3][0] = x;
    outputMatrix[3][1] = y;
    outputMatrix[3][2] = z;

    return outputMatrix;
}

function vertexMultiplication(vertex, matrix) {
    var outputVertex = new Vertex(0, 0, 0);

    outputVertex.x = vertex.x * matrix[0][0] + vertex.y * matrix[1][0] + vertex.z * matrix[2][0] + vertex.w * matrix[3][0];
    outputVertex.y = vertex.x * matrix[0][1] + vertex.y * matrix[1][1] + vertex.z * matrix[2][1] + vertex.w * matrix[3][1];
    outputVertex.z = vertex.x * matrix[0][2] + vertex.y * matrix[1][2] + vertex.z * matrix[2][2] + vertex.w * matrix[3][2];
    outputVertex.w = vertex.x * matrix[0][3] + vertex.y * matrix[1][3] + vertex.z * matrix[2][3] + vertex.w * matrix[3][3];

    return outputVertex;
}

function MatrixMultiplication(MatrixA, MatrixB) {
    var rowCount, columnCount;
    var outputMatrix = new Matrix();

    for (rowCount = 0; rowCount < 4; rowCount++)
        for (columnCount = 0; columnCount < 4; columnCount++) {
            outputMatrix[rowCount][columnCount] = MatrixA[rowCount][0] * MatrixB[0][columnCount]
            + MatrixA[rowCount][1] * MatrixB[1][columnCount]
            + MatrixA[rowCount][2] * MatrixB[2][columnCount]
            + MatrixA[rowCount][3] * MatrixB[3][columnCount];
        }
    return outputMatrix;
}

function RotationXMatrix(angle) {
    var outputMatrix = new Matrix();
    outputMatrix[0][0] = 1;
    outputMatrix[0][1] = 0;
    outputMatrix[0][2] = 0;
    outputMatrix[0][3] = 0;
    outputMatrix[1][0] = 0;
    outputMatrix[1][1] = Math.cos(angle);
    outputMatrix[1][2] = Math.sin(angle);
    outputMatrix[1][3] = 0;
    outputMatrix[2][0] = 0;
    outputMatrix[2][1] = -Math.sin(angle);
    outputMatrix[2][2] = Math.cos(angle);
    outputMatrix[2][3] = 0;
    outputMatrix[3][0] = 0;
    outputMatrix[3][1] = 0;
    outputMatrix[3][2] = 0;
    outputMatrix[3][3] = 1;

    return outputMatrix;
}

function RotationYMatrix(angle) {
    var outputMatrix = new Matrix();

    outputMatrix[0][0] = Math.cos(angle);
    outputMatrix[0][1] = 0;
    outputMatrix[0][2] = -Math.sin(angle);
    outputMatrix[0][3] = 0;
    outputMatrix[1][0] = 0;
    outputMatrix[1][1] = 1;
    outputMatrix[1][2] = 0;
    outputMatrix[1][3] = 0;
    outputMatrix[2][0] = Math.sin(angle);
    outputMatrix[2][1] = 0;
    outputMatrix[2][2] = Math.cos(angle);
    outputMatrix[2][3] = 0;
    outputMatrix[3][0] = 0;
    outputMatrix[3][1] = 0;
    outputMatrix[3][2] = 0;
    outputMatrix[3][3] = 1;

    return outputMatrix;
}

function RotationZMatrix(angle) {


    var outputMatrix = new Matrix();



    outputMatrix[0][0] = Math.cos(angle);
    outputMatrix[0][1] = Math.sin(angle);
    outputMatrix[0][2] = 0;
    outputMatrix[0][3] = 0;
    outputMatrix[1][0] = -Math.sin(angle);
    outputMatrix[1][1] = Math.cos(angle);
    outputMatrix[1][2] = 0;
    outputMatrix[1][3] = 0;
    outputMatrix[2][0] = 0;
    outputMatrix[2][1] = 0;
    outputMatrix[2][2] = 1;
    outputMatrix[2][3] = 0;
    outputMatrix[3][0] = 0;
    outputMatrix[3][1] = 0;
    outputMatrix[3][2] = 0;
    outputMatrix[3][3] = 1;


    return outputMatrix;
}

function initialize() {
    g_cubeOBJ = "v 0.5 0.5 0 \
    v 0.5 - 0.5 0 \
    v -0.5 0.5 0 \
    v -0.5 - 0.5 0 \
    v 0.5 0.5 1 \
    v 0.5 - 0.5 1 \
    v - 0.5 0.5 1 \
    v - 0.5 - 0.5 1 \
    v 0.5 1.5 0 \
    v - 0.5 1.5 0 \
    v 0.5 1.5 1 \
    v - 0.5 1.5 1 \
    v 0.5 2.5 0 \
    v - 0.5 2.5 0 \
    v 0.5 2.5 1 \
    v - 0.5 2.5 1 \
    f 3 1 2 4 \
    f 4 8 6 2 \
    f 3 7 8 4 \
    f 1 5 7 3 \
    f 2 6 5 1 \
    f 7 5 6 8 \
    f 10 9 1 3 \
    f 3 7 5 1 \
    f 10 12 7 3 \
    f 9 11 12 10 \
    f 1 5 11 9 \
    f 12 11 5 7 \
    f 14 13 9 10 \
    f 10 12 11 9 \
    f 14 16 12 10 \
    f 13 15 16 14 \
    f 9 11 15 13 \
    f 16 15 11 12 ";
    g_cubeOBJparsed = g_cubeOBJ.split(' ');
    g_ctx = '0';
    g_renderEngine = '0';
    g_testObject = '0';
    g_camera = '0';
    g_clipSpace = '0';
    g_FPSManager = '0';
    g_keyPressed = [];
    g_canvasWidth = 700;
    g_canvasHeight = 500;
    g_MonkeySpin = 0;
    g_frameCount = 0;

    g_cubeOBJ = document.outform.out.value.trim();
    g_cubeOBJparsed = g_cubeOBJ.split(' ');
    document.getElementById('in').innerHTML = document.getElementById('out').innerHTML;
    g_ctx = document.getElementById('canvas').getContext('2d');
    //g_ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';

    g_testObject = new Object();
    g_camera = new Camera();

    //g_clipSpace = initializeClipSpace();
    //g_FPSManager = new FPSManager();
    g_renderEngine = new RenderEngine();
    
    //window.document.onkeypress = onKeyPress;
    window.document.onkeydown = onKeyDown;
    window.document.onkeyup = onKeyUp;
        
    g_testObject.loadOBJ();
    g_testObject.transformMatrix = RotationXMatrix(1.57);
    g_testObject.transformMatrix = MatrixMultiplication(g_testObject.transformMatrix,RotationYMatrix(g_MonkeySpin));
    g_testObject.transformMatrix = MatrixMultiplication(g_testObject.transformMatrix,TranslationMatrix(0,0,-5));
    //g_testObject.transformMatrix = TranslationMatrix(0,0,-5);
    //g_testObject.transformMatrix = RotationXMatrix(1);
    //g_testObject.transformMatrix = RotationXMatrix(g_testZ);
    //g_testObject.transformMatrix = MatrixMultiplication(g_testObject.transformMatrix,TranslationMatrix(0,0,-3));
    //g_camera.transformMatrix = new Matrix();        
    //g_renderEngine.render();
        
    //60 FPS? Ha, I wish
    setInterval(nextFrame, 1000/60);
}

function nextFrame() { 
    g_frameCount++; 
    g_ctx.clearRect(0,0,g_canvasWidth,g_canvasHeight);
    g_testObject.transformMatrix = new Matrix();
    g_testObject.transformMatrix = RotationXMatrix(xr);
    g_testObject.transformMatrix = MatrixMultiplication(g_testObject.transformMatrix,RotationYMatrix(yr));  
    g_testObject.transformMatrix = MatrixMultiplication(g_testObject.transformMatrix,TranslationMatrix(0,0,see));
    g_renderEngine.render();
}

/**
* A key is being held down, so handle it
*/
function onKeyDown(event) {
    event = event || window.event;
    g_keyPressed[event.keyCode] = true;
}

/**
* A key has been released, so handle it
*/
function onKeyUp(event) {
    event = event || window.event;
    g_keyPressed[event.keyCode] = false;
}

var can, ctx, canX, canY, mouseIsDown = 0;// 터치 구현 By 박재영

function init() {
    can = document.getElementById('canvas');
    ctx = can.getContext('2d');

    can.addEventListener('mousewheel',mouseWheel, false);
    can.addEventListener('mousedown', mouseDown, false);
    can.addEventListener('mousemove', mouseXY, false);
    can.addEventListener('touchstart', touchDown, false);
    can.addEventListener('touchmove', touchXY, true);
    can.addEventListener('touchend', touchUp, false);
    
    document.body.addEventListener('mouseup', mouseUp, false);
    document.body.addEventListener('touchcancel', touchUp, false);
}

function mouseWheel(event){
    mouseController.wheel(event);
    return false;
}

function mouseUp() {
    mouseIsDown = 0;
    mouseXY();
}

function touchUp() {
    mouseIsDown = 0;
    // no touch to track, so just show state
    showPos();
}

function mouseDown() {
    mouseIsDown = 1;
    mouseXY();
}

function touchDown() {
    mouseIsDown = 1;
    touchXY();
}

function mouseXY(e) {
    if (!e)
        var e = event;
    oldx=canX;
    oldy=canY;
    canX = e.pageX - can.offsetLeft;
    canY = e.pageY - can.offsetTop;
    showPos();
}

function touchXY(e) {
    if (!e)
        var e = event;
    oldx=canX;
    oldy=canY;
    e.preventDefault();
    canX = e.targetTouches[0].pageX - can.offsetLeft;
    canY = e.targetTouches[0].pageY - can.offsetTop;
    showPos();
}

function showPos() {
    // large, centered, bright green text
    
    if (mouseIsDown){
        yr=yr-(canX-oldx)/640;
        xr=xr-(canY-oldy)/480;
    }
    if (!mouseIsDown)
    {}
    ;
}
function zplus(){
    see+=0.2;
    document.getElementById('in').value = (see+5).toFixed(1);  
}
function zminus(){
    see-=0.2;
    document.getElementById('in').value = (see+5).toFixed(1);  
}
