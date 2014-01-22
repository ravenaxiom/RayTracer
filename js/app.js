// http://permadi.com/tutorial/raycast/rayc7.html
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
// http://www.redblobgames.com/articles/visibility/
// http://www.arguingwithmyself.com/demos/raycaster/#v5
// http://dev.mothteeth.com/2011/11/2d-ray-casting-on-a-grid-in-as3/


var App = (function () {

	var renderer = new Renderer('myCanvas'),
		input = new Input(),
		map = new Map(renderer),
		player = new Player(map, renderer, input);


	function updateLoop () {
		map.update();
		player.update();
	}


	function drawLoop () {
		map.draw();
		player.draw();
	}

	return {
		start: function () {
			requestAnimFrame(App.update);
		},

		update: function () {
			requestAnimFrame(App.update);

			updateLoop();
			drawLoop();
		},

		input: input
	};
})();
