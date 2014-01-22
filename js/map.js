Map = function (renderer) {
	this.tiles = [
		[1, 1, 1, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 0, 1, 1]
	];

	this.TILESX = this.tiles[0].length;
	this.TILESY = this.tiles.length;
	this.GRIDSIZE = 64;
	this.WIDTH = this.TILESX;// * this.GRIDSIZE;
	this.HEIGHT = this.TILESY;// * this.GRIDSIZE;

	this.renderer = renderer;
};

Map.prototype.getTile = function (x, y) {

/* document.write(x + ' ' + y + ' ' + this.WIDTH + ' ' + this.HEIGHT + '        ==         ');		 */


	var tileX = Math.floor(y / this.GRIDSIZE),
		tileY = Math.floor(x / this.GRIDSIZE),
		tile;

	if (tileX >= 0 && tileX < this.WIDTH &&
		tileY >= 0 && tileY < this.HEIGHT) {
		tile = this.tiles[tileY][tileX];
	}

	return tile;
};


Map.prototype.setTile = function (x, y, value) {
	var tileX = Math.floor(y / this.GRIDSIZE),
		tileY = Math.floor(x / this.GRIDSIZE);

	if (tileX >= 0 && tileX < this.WIDTH &&
		tileY >= 0 && tileY < this.HEIGHT) {
		this.tiles[tileY][tileX] = value;
	}
};


Map.prototype.update = function () {
};


Map.prototype.draw = function () {
	var x,
		y;

	this.renderer.drawRect(0, 0, this.renderer.WIDTH, this.renderer.HEIGHT, this.renderer.COLORS.BLUE);

	var col;

	for (x = 0; x < this.tiles[0].length; x++) {
		for (y = 0; y < this.tiles.length; y++) {

			if (this.tiles[y][x]) {

				if (this.tiles[y][x] === 1) {
					col = this.renderer.COLORS.LIGHTGREY;
				} else if (this.tiles[y][x] === 2) {
					col = this.renderer.COLORS.RED;
				}

				this.renderer.drawRect(x * this.GRIDSIZE, y * this.GRIDSIZE, this.GRIDSIZE, this.GRIDSIZE, col);
			}
		}
	}


	for (x = 0; x <= this.WIDTH; x++) {
		this.renderer.drawLine(0, x * this.GRIDSIZE,
							   500, x * this.GRIDSIZE,
							   this.GRIDSIZE, this.renderer.COLORS.WHITE);
	}

	for (y = 0; y <= this.HEIGHT; y++) {
		this.renderer.drawLine(y * this.GRIDSIZE, 0,
							   y * this.GRIDSIZE, 500,
							   this.GRIDSIZE, this.renderer.COLORS.WHITE);
	}

};