var Renderer = function (canvasID) {
	this.WIDTH = 448;
	this.HEIGHT = 448;

	this.COLORS = {
		WHITE: "#ffffff",
		BLACK: "#000000",
		LIGHTGREY: "#dddddd",
		RED: "#ff0000",
		BLUE: "#0000ff",
		GREEN: "#00ff00"
	};

	this.canvas = document.getElementById(canvasID);
	this.context = this.canvas.getContext("2d");
};


Renderer.prototype.drawPoint = function (x, y, size, color) {
	var halfSize = size / 2;

	this.context.fillStyle = color;
	this.context.fillRect(x - halfSize, y - halfSize, size, size);
};


Renderer.prototype.drawCircle = function (x, y, radius, color) {
	this.context.fillStyle = color;
	// this.context.moveTo(110,75);

	this.context.beginPath();
	this.context.arc(x, y, radius, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fill();
};


Renderer.prototype.drawLine = function (x1, y1, x2, y2, color) {
	this.context.strokeStyle = color;

	this.context.beginPath();
	this.context.moveTo(x1,y1);
    this.context.lineTo(x2,y2);
    this.context.closePath();
    this.context.stroke();
};


Renderer.prototype.drawAngledLine = function (x1, y1, angle, distance, color) {
angle = toDeg(angle);
/* angle = angle * Math.PI / 180; */
	var x2 = x1 + (distance * Math.cos(angle)),
		y2 = y1 + (distance * Math.sin(angle));

// http://doc.gold.ac.uk/CreativeComputing/creativecomputation/?page_id=1142
// Sin (x) = Opposite / Hypotenuse

	this.context.strokeStyle = color;

	this.context.beginPath();
	this.context.moveTo(x1,y1);
    this.context.lineTo(x2,y2);
    this.context.closePath();
    this.context.stroke();
};


Renderer.prototype.drawRect = function (x, y, width, height, color) {
	this.context.fillStyle = color;
	this.context.fillRect(x, y, width, height);
};