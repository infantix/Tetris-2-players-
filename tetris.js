class Tetris
{
    constructor(element)
    {
        this.element = element;
        this.canvas = element.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.context.scale(20, 20);

        this.arena = new Arena(20, 12);
        this.player = new Player(this.arena);
        
        let lastTime = 0;
        let accumulator = 0;
        const step = 1/60;
        
        const mainLoop = (millis) => {
            if(lastTime) {
                this.draw();
                accumulator += (millis - lastTime) / 1000;
        
                while(accumulator > step) {
                    update(this, step);
                    accumulator -= step;
                }
            }
            lastTime = millis;
            requestAnimationFrame(mainLoop);
        }
        
        mainLoop();
    }

    draw() {
        resetCanvas(this);
        refreshScore(this);

        drawMatrix(this.arena.matrix, { x: 0, y: 0 }, this.context);
        drawMatrix(this.player.matrix, this.player.position, this.context);
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

let update = function (tetris, step) {
    tetris.player.update(step);
}

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

let resetCanvas = function (tetris) {
    tetris.context.fillStyle = '#000'; //background black
    tetris.context.fillRect(0, 0, tetris.canvas.width, tetris.canvas.height);
}

let refreshScore = function (tetris) {
    let text = 'Level:' + tetris.player.level + ' Score:' + tetris.player.score;
    const score = tetris.element.querySelector('.score');
	score.innerText = text;
}

