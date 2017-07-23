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

function traspose(matrix) {
	// swap the symmetric elements
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < i; j++) {
			let temp = matrix[i][j];
			matrix[i][j] = matrix[j][i];
			matrix[j][i] = temp;
		}
	}
}

function reverseRows(matrix) {
	matrix = matrix.map(function(row) {
		return row.reverse();
	});
}

function rotateClockWise(matrix) {
  traspose(matrix);
  reverseRows(matrix);
}

function rotateAntiClockWise(matrix) {
  reverseRows(matrix);
  traspose(matrix);
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
				context.fillStyle = 'green';
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


		case 38: //up
		case 83: //s
			playerRotate(rotateClockWise, rotateAntiClockWise);
			break;

		case 65: //a
			playerRotate(rotateAntiClockWise, rotateClockWise);
			break;

		case 37: //left
			playerMoveLeft();
			break;

		case 39: //right
			playerMoveRight();
			break;

		case 32: //space bar
		case 40: //down
			playerDrop();
			break;
	}
});

function playerRotate(rotate, rollback) {

	let playerPosition = player.position.x ;
	rotate(player.matrix);

	if(collide(player, arena)) {
		player.position.x = playerPosition;
		rollback(player.matrix);
	}
}


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
