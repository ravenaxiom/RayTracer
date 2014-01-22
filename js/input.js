// http://blogs.coldbuffer.com/javascript-snippets-cross-browser-keyboard-event-detection

var Input = function () {
	var i;

	this.KEYCODES = {
		ENTER: 13,
		SPACEBAR: 32,
		SHIFT: 16,
		UP_ARROW: 38,
		DOWN_ARROW: 40,
		LEFT_ARROW: 37,
		RIGHT_ARROW: 39
	};

	this.events = [];			// format: { keycode: 13, callback: function () {} }
	this.buttonStates = [];		// format: { keycode: 13, pressed: true }

	document.onkeydown = function (e) { App.input.keydown(e); };
	document.onkeyup = function (e) { App.input.keyup(e); };
};


Input.prototype.addEventListener = function (keycode, callback) {
	this.events.push({
		keycode: keycode,
		callback: callback
	});
};


Input.prototype.setButtonState = function (keycode, pressed) {
	var i;

	for (i = 0; i < this.buttonStates.length; i++) {
		if (this.buttonStates[i].keycode === keycode) {
			this.buttonStates[i].pressed = pressed;
		}
	}

	if (i >= this.buttonStates.length) {
		this.buttonStates.push({
			keycode: keycode,
			pressed: pressed
		});
	}
};


Input.prototype.isPressed = function (keycode) {
	var i,
		isPressed = false;

	for (i = 0; i < this.buttonStates.length; i++) {
		if (this.buttonStates[i].keycode === keycode) {
			isPressed = this.buttonStates[i].pressed;
		}
	}

	return isPressed;
};


Input.prototype.keydown = function (evt) {
	var i,
		key,
		event;

	event = (evt) ? evt:(window.event) ? window.event:null;

	if (event) {
		key = (event.charCode)?event.charCode:((event.keyCode)?event.keyCode:((event.which)?event.which:0));

		for (i = 0; i < this.events.length; i++) {
			if (this.events[i].keycode === key) {
				this.events[i].callback();
			}
		}

		this.setButtonState(key, true);
		event.preventDefault();
	}
};


Input.prototype.keyup = function (evt) {
	var i,
		key,
		event;

	event = (evt) ? evt:(window.event) ? window.event:null;

	if (event) {
		key = (event.charCode)?event.charCode:((event.keyCode)?event.keyCode:((event.which)?event.which:0));

		this.setButtonState(key, false);
		event.preventDefault();
	}
};