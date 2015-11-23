var xVantage = 0;
var yVantage = 0;
var zVantage = 500;
var eyeDistance = 500;
var debugFlag = false;
var points = renderObject(8, 200);
/* driver function to initiate all necessary functions. */
function runAll() {
	
	document.getElementById("xSliderText").innerHTML = "X Vantage: " + xVantage;
	document.getElementById("ySliderText").innerHTML = "Y Vantage: " + yVantage;
	document.getElementById("zSliderText").innerHTML = "Z Vantage: " + zVantage;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
	
	
}

function setXVantage(xValue) {
	xVantage = xValue;
	document.getElementById("xSliderText").innerHTML = "X Vantage: " + xValue;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function setYVantage(yValue) {
	yVantage = yValue;
	document.getElementById("ySliderText").innerHTML = "Y Vantage: " + yVantage;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function setZVantage(zValue) {
	zVantage = zValue;
	document.getElementById("zSliderText").innerHTML = "Z Vantage: " + zVantage;
	drawFrame(xVantage,yVantage,zVantage,eyeDistance)
}	
function toggleDebug() {
	if (debugFlag == true) {
		debugFlag = false;
	} else {
		debugFlag = true;
	}
	drawFrame(xVantage,yVantage,zVantage,eyeDistance);
}
	
// Function to draw sky as backdrop
function drawFrame(vantageX,vantageY,vantageZ,eyeDistance) {
	var canvas = document.getElementById("renderCanvas");
	var myCanvas = canvas.getContext("2d");
	var width = canvas.width/2;
	var height = canvas.height/2;
	myCanvas.beginPath();
	myCanvas.moveTo(0,0);
	myCanvas.lineTo(0,1000);
	myCanvas.lineTo(1000,1000);
	myCanvas.lineTo(1000,0);
	myCanvas.closePath();
	myCanvas.fillStyle= "rgb(0,0,0)";
	myCanvas.fill();
	myCanvas.fillStyle= "white";
	/*myCanvas.fillText("TOP X: " + (Math.sqrt(Math.pow(Math.abs(vantageZ),2)+Math.pow(points[5][0],2))),100,100);
	myCanvas.fillText("BOTTOM X: " + (Math.sqrt(Math.pow((Math.abs(Math.abs(vantageZ))+points[5][2]),2)+Math.pow(points[5][0],2))),100,150);
		myCanvas.fillText("TOP Y: " + (Math.sqrt(Math.pow(Math.abs(vantageZ),2)+Math.pow(points[5][1],2))),100,200);
	myCanvas.fillText("BOTTOM Y: " + (Math.sqrt(Math.pow((Math.abs(Math.abs(vantageZ))+points[5][2]),2)+Math.pow(points[5][1],2))),100,250);
	myCanvas.fillText(Math.abs(vantageZ)+points[5][2],100,300);*/
	var rasterizedPts = new Array();
	for (var i=0;i<points.length;i++) {
		//var distance = Math.sqrt(Math.pow(vantageX-points[i][0],2)+Math.pow(vantageY-points[i][1],2)+Math.pow(vantageZ-points[i][2],2))
		var x = ((vantageX-points[i][0]))/((eyeDistance+(vantageZ-points[i][2]))/eyeDistance);
		var y = ((vantageY-points[i][1]))/((eyeDistance+(vantageZ-points[i][2]))/eyeDistance);
		rasterizedPts[i] = [x+width,y+height];
		//myCanvas.fillRect(x+width,y+height,3,3);
		if (debugFlag == true) {
			myCanvas.fillText(points[i] + " X: " + x + " Y: " + y,x+10+width,y+height+(i*5));
		}
		
	}

	for (var i=0;i<points.length;i++) {
		for (var c=3;c<points[i].length;c++) {
			
			myCanvas.beginPath();
			myCanvas.moveTo(rasterizedPts[i][0],rasterizedPts[i][1]);
			myCanvas.lineTo(rasterizedPts[points[i][c]][0],rasterizedPts[points[i][c]][1]);
			//myCanvas.lineWidth = 10;
			myCanvas.strokeStyle = '#ff0000';
			myCanvas.stroke();
		}

	}
	
}
/*Function to creates a 3D object as a 2D array of points in space.
returns the array*/
function renderObject(numOfPoints, size) {
	var points = new Array();
	var x = 0;
	var y = 0;
	var z = 0;

	for (var i =0; i < numOfPoints; i++) {
		if (x == 0) {
			var C1 = i+4;
		} else {
			var C1 = i-4;
		}
		if (y == 0) {
			var C2 = i+2;
		} else {
			var C2 = i-2;
		}
		if (z == 0) {
			var C3 = i+1;
		} else {
			var C3 = i-1;
		}
		var subArray = [x,y,z,C1,C2,C3];
		points[i] = subArray;
		if (i%2 == 0) {
			z = size;
		} else {
			z = 0;
		}
		if (z == 0 && y == 0) {
			y = size;
		} else if (z == 0 && y == size) {
			y = 0;
		}
		if (i >= numOfPoints/2 - 1) {
			x = size;
		} else {
			x = 0;
		}
	}
	return points;
}
