class Tetris
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.scale(20, 20);

        this.arena = new Arena(20, 12);
        this.player = new Player(this.arena);
        
        let lastTime = 0;
        let accumulator = 0;
        const step = 1/60;
        
        const mainLoop = (millis) => {
            if(lastTime) {
                accumulator += (millis - lastTime) / 1000;
        
                while(accumulator > step) {
                    this.player.update(step);
                    accumulator -= step;
                }
            }
            lastTime = millis;
            requestAnimationFrame(mainLoop);
        }
        
        mainLoop();
    }

    draw() {
        drawMatrix(this.arena.matrix, { x: 0, y: 0 }, this.context);
        drawMatrix(this.player.matrix, this.player.position, this.context);
    }

    resetCanvas() {
        this.context.fillStyle = '#000'; //background black
        this.context.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const colors = [
    null,
    'red',
    'yellow',
    'blue',
    'green',
    'pink',
    'orange',
    'purple',
];

let drawMatrix = function (matrix, offset, context) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

