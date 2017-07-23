const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20,20);

const matrix = [
	[0, 0, 0],
	[1, 1, 1],
	[0, 1, 0]
];

const arena = createMatrix(20, 12);

const player = {
	position: {x: 0, y: 0},
	matrix: matrix
}

function createMatrix(height, width) {

	const matrix = [];
	while(height--) {
		matrix.push(new Array(width).fill(0));
	}

	return matrix;
}

function collide(player, arena) {
	
	for(let y = 0; y < player.matrix.length; y++) {
		
		let row = player.matrix[y];
		
		for(let x = 0; x < row.length; x++) {
			if(player.matrix[y][x] !== 0) {
				if(!arena[y + player.position.y] || //the row in the arena does not exist.
					(arena[y + player.position.y][x + player.position.x]) !== 0) { //exist but is occupied.
					
					return true;
				}
			}
		}

	}

	return false;
}


function draw() {
	drawMatrix(arena, {x: 0, y: 0})
	drawMatrix(player.matrix, player.position);
}

function resetCanvas() {
	context.fillStyle = '#000'; //background black
	context.fillRect(0, 0, canvas.width, canvas.height);
}

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;


function update(time = 0) {

	const deltaTime = time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;

	if(dropCounter >= dropInterval) {
		playerDrop();
	}


	resetCanvas();
	draw();
	requestAnimationFrame(update);
}

function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value) {
				context.fillStyle = 'red';
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});	
}

function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value) {
				arena[y + player.position.y][x + player.position.x] = value;
			}
		});
	});	
}


document.addEventListener('keydown', event => {

	switch(event.keyCode) {

		//LEFT
		case 37:
			playerMoveLeft();
			break;

		//RIGHT
		case 39:
			playerMoveRight();
			break;

		//DOWN
		case 40:
			playerDrop();
			break;
	}
});

function playerDrop() {
	
	player.position.y ++;

	if(collide(player, arena)) {
		player.position.y --;
		merge(arena,player);
		player.position.y = 0;
	}

	dropCounter = 0;
}

function playerMoveLeft() {
	player.position.x--;
	
	if(collide(player, arena)) {
		player.position.x++;
	}
}

function playerMoveRight() {
	player.position.x++;
	
	if(collide(player, arena)) {
		player.position.x--;
	}
}

update();
