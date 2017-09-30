const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

const arena = createMatrix(20, 12);
const player = new Player();

let lastTime = 0;
let accumulator = 0;
const step = 1/60;

const mainLoop = (millis) => {
	if(lastTime) {
		accumulator += (millis - lastTime) / 1000;

		while(accumulator > step) {
			player.update(step);
			accumulator -= step;
		}
	}
	lastTime = millis;
	requestAnimationFrame(mainLoop);
}

mainLoop();

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

function createSquare() {
	return [
		[1, 1],
		[1, 1]
	];
}

function createLong() {
	return [
		[0, 2, 0, 0],
		[0, 2, 0, 0],
		[0, 2, 0, 0],
		[0, 2, 0, 0]
	];
}

function createZigR() {
	return [
		[3, 3, 0],
		[0, 3, 3],
		[0, 0, 0]
	];
}

function createZigL() {
	return [
		[0, 4, 4],
		[4, 4, 0],
		[0, 0, 0]
	];
}

function createTri() {
	return [
		[0, 5, 0],
		[5, 5, 5],
		[0, 0, 0]
	];
}

function createLL() {
	return [
		[0, 6, 0],
		[0, 6, 0],
		[6, 6, 0]
	];
}

function createLR() {
	return [
		[0, 7, 0],
		[0, 7, 0],
		[0, 7, 7]
	];
}

function createPiece() {

	const numPieces = 7;

	var pieceNum = Math.floor((Math.random() * numPieces) + 1);

	switch (pieceNum) {

		case 1:
			return createSquare();

		case 2:
			return createLong();

		case 3:
			return createZigR();

		case 4:
			return createZigL();

		case 5:
			return createTri();

		case 6:
			return createLL();

		case 7:
			return createLR();
	}

}

function createMatrix(height, width) {

	const matrix = [];
	while (height--) {
		matrix.push(new Array(width).fill(0));
	}

	return matrix;
}


function collide(player, arena) {

	for (let y = 0; y < player.matrix.length; y++) {

		let row = player.matrix[y];

		for (let x = 0; x < row.length; x++) {
			if (player.matrix[y][x] !== 0) {
				if (!arena[y + player.position.y] || //the row in the arena does not exist.
					(arena[y + player.position.y][x + player.position.x]) !== 0) { //exist but is occupied.

					return true;
				}
			}
		}

	}

	return false;
}


function draw() {
	drawMatrix(arena, { x: 0, y: 0 })
	drawMatrix(player.matrix, player.position);
}

function resetCanvas() {
	context.fillStyle = '#000'; //background black
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value) {
				arena[y + player.position.y][x + player.position.x] = value;
			}
		});
	});
}


document.addEventListener('keydown', event => {

	switch (event.keyCode) {

		case 38: //up
		case 83: //s
			player.rotateClockWise();
			break;

		case 65: //a
			player.rotateAntiClockWise();
			break;

		case 37: //left
			player.moveLeft();
			break;

		case 39: //right
			player.moveRight();
			break;

		case 32: //space bar
		case 40: //down
			player.drop();
			break;
	}
});

function deleteFullRows() {
	let rowCounter = 0;
	arena.forEach((row, index) => {
		if(isRowFull(row)) {
			const row = arena.splice(index, 1)[0].fill(0); //remove the row from the arena and reset the value.
			arena.unshift(row); //put the row on top of the arena.
			rowCounter++;
		}
	});

	return rowCounter;
}

function isRowFull(row) {
	
	for(let i=0; i<row.length ; i++) {
		if(row[i] === 0) {
			return false;
		}
	}

	return true;
}

function resetArena() {
	arena.forEach(row => row.fill(0));
}


function updateScore() {
	document.getElementById('score').innerText = player.score;
}

