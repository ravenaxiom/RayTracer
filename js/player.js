var Player = function (map, renderer, input) {
	this.map = map;
	this.renderer = renderer;
	this.input = input;
	
	this.updateTimer = 0;
	this.UPDATESPACING = 60;
	
	this.hrays = [];
	this.vrays = [];	
	this.NUMRAYS = 3;
	this.NUMPOINTS = 7;
	
	for (i = 0; i < this.NUMRAYS; i++) {
		this.hrays[i] = { x: 0, y: 0, hit: 0 };
		this.vrays[i] = { x: 0, y: 0, hit: 0 };
	}

	this.xField = document.getElementById("xField");
	this.yField = document.getElementById("yField");
	this.angleField = document.getElementById("angleField");
	this.fovField = document.getElementById("fovField");
	this.viewHeightField = document.getElementById("viewHeightField");
	this.turnSpeedField = document.getElementById("turnSpeedField");
	this.moveSpeedField = document.getElementById("moveSpeedField");
	this.shiftMultiplierField = document.getElementById("shiftMultiplierField");
	
	this.turnOffShift();
	this.updateValues();	
};


Player.prototype.update = function () {
	this.updateTimer++;
	if (this.updateTimer >= this.UPDATESPACING) {
		this.updateValues();
		this.updateTimer = 0;
	}
	
	this.handleInput();
	this.validateAngle();
	this.rayTrace();
};


Player.prototype.validateAngle = function () {

	while (this.angle < 0) {
		this.angle += 360;
	}

	while (this.angle > 360) {
		this.angle -= 360;
	}
}


Player.prototype.draw = function () {
	var color;

	for (i = 0; i < this.NUMRAYS; i++) {
		if (this.hrays[i].hit) {
			color = this.renderer.COLORS.RED;
		} else {
			color = this.renderer.COLORS.GREEN;			
		}
		
		this.renderer.drawCircle(this.hrays[i].x, this.hrays[i].y, 3, color);
		
		if (this.vrays[i].hit) {
			color = this.renderer.COLORS.RED;
		} else {
			color = this.renderer.COLORS.GREEN;			
		}
		
		this.renderer.drawCircle(this.vrays[i].x, this.vrays[i].y, 3, color);
	}

	this.renderer.drawAngledLine(this.x, this.y, this.angle - this.fov / 2, 600, this.renderer.COLORS.LIGHTGREY);
	this.renderer.drawAngledLine(this.x, this.y, this.angle + this.fov / 2, 600, this.renderer.COLORS.LIGHTGREY);

	this.renderer.drawCircle(this.x, this.y, 10, this.renderer.COLORS.RED);
	this.renderer.drawAngledLine(this.x, this.y, this.angle, 10, this.renderer.COLORS.BLACK);
};


Player.prototype.updateValues = function () {
	this.x = parseFloat(this.xField.value);
	this.y = parseFloat(this.yField.value);
	this.angle = parseFloat(this.angleField.value);
	this.fov = parseFloat(this.fovField.value);
	this.viewHeight = parseFloat(this.viewHeightField.value);
	this.turnSpeed = parseFloat(this.turnSpeedField.value);
	this.moveSpeed = parseFloat(this.moveSpeedField.value);
	this.shiftMultiplier = parseFloat(this.shiftMultiplierField.value);	

	// convert angle to degrees
/* 	this.angle = toDeg(this.angle); */
/* 	this.fov = toDeg(this.fov); */

};


Player.prototype.handleInput = function () {
	if (this.input.isPressed(this.input.KEYCODES.UP_ARROW)) {
		this.moveForward();
	} else if (this.input.isPressed(this.input.KEYCODES.DOWN_ARROW)) {
		this.moveBack();
	}

	if (this.input.isPressed(this.input.KEYCODES.LEFT_ARROW)) {
		this.turnLeft();
	} else if (this.input.isPressed(this.input.KEYCODES.RIGHT_ARROW)) {
		this.turnRight();
	}
	
	if (this.input.isPressed(this.input.KEYCODES.SHIFT)) {
		this.turnOnShift();
	} else {
		this.turnOffShift();
	}
};


function toDeg(val) {
	return val * Math.PI / 180;
}


// CARTESIAN coords:
// 0 degrees = right, 90 = up, 180 = left, 270 = down
// X++ right, y++ down

Player.prototype.rayTrace = function () {

	// horizontal
	var i,
		tileOffsetX,
		tileOffsetY,
		currentXa,
		currentYa,
		Ax,
		Ay,
		Cx,
		Cy,
		Dx,
		Dy,
		Ya,
		Xa;

	/*
tileOffsetX = this.x - (Math.floor(Math.floor(this.x / this.map.GRIDSIZE) * this.map.GRIDSIZE));
	tileOffsetY = this.y - (Math.floor(Math.floor(this.y / this.map.GRIDSIZE) * this.map.GRIDSIZE));
*/


	/*
currentXa = Math.floor(this.x / this.map.GRIDSIZE);
	currentYa = Math.floor(this.y / this.map.GRIDSIZE);
*/

var degAngle = toDeg(this.angle);

	if (degAngle > toDeg(180)) {
		// up
		Ay = Math.floor(this.y / this.map.GRIDSIZE) * this.map.GRIDSIZE - 1;
		Ax = this.x - (this.y - Ay) / Math.tan(degAngle);

		Ya = -this.map.GRIDSIZE;
		Xa = this.map.GRIDSIZE / Math.tan(degAngle);

		/*
Cx = Ax - Xa;
		Cy = Ay - Ya;

		Dx = Cx - Xa;
		Dy = Cy - Ya;
*/
		this.hrays[0].x = Ax;
		this.hrays[0].y = Ay;
		
		for (i = 1; i < this.NUMRAYS; i++) {
			this.hrays[i].x = this.hrays[i-1].x - Xa;
			this.hrays[i].y = this.hrays[i-1].y + Ya;		
		}

	} else {
		// down
		Ay = Math.floor(this.y / this.map.GRIDSIZE) * this.map.GRIDSIZE + this.map.GRIDSIZE;
		Ax = this.x - (this.y - Ay) / Math.tan(degAngle);

		Ya = this.map.GRIDSIZE;
		Xa = this.map.GRIDSIZE / Math.tan(degAngle);

		/*
Cx = Ax + Xa;
		Cy = Ay + Ya;

		Dx = Cx + Xa;
		Dy = Cy + Ya;
*/
		this.hrays[0].x = Ax;
		this.hrays[0].y = Ay;
		
		for (i = 1; i < this.NUMRAYS; i++) {
			this.hrays[i].x = this.hrays[i-1].x + Xa;
			this.hrays[i].y = this.hrays[i-1].y + Ya;
		}

	}
	
	for (i = 0; i < this.NUMRAYS; i++) {
		this.hrays[i].hit = this.map.getTile(this.hrays[i].y, this.hrays[i].x);
/* 		console.log(this.rays[i].hit); */
	}
		


	// this.renderer.drawCircle(Ax, Ay, 6, this.renderer.COLORS.RED);
	// this.renderer.drawCircle(Cx, Cy, 4, this.renderer.COLORS.RED);
	// this.renderer.drawCircle(Dx, Dy, 2, this.renderer.COLORS.RED);
/*

	var tile;

	tile = this.map.getTile(Ax, Ay);
	if(tile === 1) { this.map.setTile(Ax, Ay, 2); }

	tile = this.map.getTile(Cx, Cy);
	if(tile === 1) { this.map.setTile(Cx, Cy, 2); }

	tile = this.map.getTile(Dx, Dy);
	if(tile === 1) { this.map.setTile(Dx, Dy, 2); }
*/

/* document.write('Player: ' + this.x + ', ' + this.y + '. A: ' + Ax + ', ' + Ay + '. ' + 'C: ' + Cx + ', ' + Cy + '. ======'); */


/* document.write(Ax + ', ' + Ay + ', ' + Xa + ', ' + Ya + ' ------------------ ');	 */

/* 	document.write(Xa + ' ' + Ya + '     '); */
};


// SOH...
// Sine: sin(θ) = Opposite / Hypotenuse
// ...CAH...
// Cosine: cos(θ) = Adjacent / Hypotenuse
// ...TOA
// Tangent: tan(θ) = Opposite / Adjacent
// Sine(72) = Y/20 -> Y = Sine(72) * 20
// Cosine(72) = X/20 -> X = Cosine(72) *20


//

Player.prototype.moveForward = function () {
	var angleDeg = toDeg(this.angle),
		tempMoveSpeed = this.moveSpeed * this.shiftMultiplierAmount;

	this.forwardPressed = true;

	this.x += Math.cos(angleDeg) * tempMoveSpeed;
	this.y += Math.sin(angleDeg) * tempMoveSpeed;

	this.xField.value = this.x;
	this.yField.value = this.y;
};


Player.prototype.moveBack = function () {
	var angleDeg = toDeg(this.angle),
		tempMoveSpeed = this.moveSpeed * this.shiftMultiplierAmount;

	this.backPressed = true;

	this.x -= Math.cos(angleDeg) * tempMoveSpeed;
	this.y -= Math.sin(angleDeg) * tempMoveSpeed;

	this.xField.value = this.x;
	this.yField.value = this.y;
};


Player.prototype.turnLeft = function () {
	var tempTurnSpeed = this.turnSpeed * this.shiftMultiplierAmount;

	this.angle -= tempTurnSpeed;
	this.angleField.value = this.angle;

	this.turnLeftPressed = true;
};


Player.prototype.turnRight = function () {
	var tempTurnSpeed = this.turnSpeed * this.shiftMultiplierAmount;

	this.angle += tempTurnSpeed;
	this.angleField.value = this.angle;

	this.turnRightPressed = true;
};


Player.prototype.turnOnShift = function () {
	this.shiftMultiplierAmount = this.shiftMultiplier;
};


Player.prototype.turnOffShift = function () {
	this.shiftMultiplierAmount = 1;
};


Player.prototype.checkMapCollision = function () {
	/*
	https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
	def intersect(circle(P, R), rectangle(A, B, C, D)):
    S = circle(P,R)
    return pointInRectangle(P, rectangle(A,B,C,D) or
           intersectCircle(S, (A,B)) or
           intersectCircle(S, (B,C)) or
           intersectCircle(S, (C,D)) or
           intersectCircle(S, (D,A))
	 */
};